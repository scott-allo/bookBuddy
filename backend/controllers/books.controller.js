const Livre = require('../models/Livre');
const User = require('../models/User');
const rewardsController = require('./rewards.controller');

// Ajouter un nouveau livre à la collection de l'utilisateur
exports.addBook = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { titre, auteur, image_url, nb_pages, nb_tomes, tomes_lus, categorie, status, userId, description } = req.body;
    let imagePath = image_url;
    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;
    }
    const livre = new Livre({
      titre,
      auteur,
      image_url: imagePath,
      nb_pages: Number(nb_pages),
      nb_tomes: nb_tomes ? Number(nb_tomes) : undefined,
      tomes_lus: tomes_lus ? Number(tomes_lus) : 0,
      categorie,
      progression: 0, // par défaut
      status,
      description
    });
    const savedBook = await livre.save();
    await User.findByIdAndUpdate(userId, { $push: { livres: savedBook._id } });

    // Recharge l'utilisateur APRÈS le push pour avoir la liste à jour
    const userAfterPush = await User.findById(userId);
    const nbLivres = userAfterPush.livres.length;
    let badgeType = null;
    if (nbLivres === 1) badgeType = 'lecture-1-livre';
    else if (nbLivres === 3) badgeType = 'lecture-3-livres';
    else if (nbLivres === 5) badgeType = 'lecture-5-livres';
    else if (nbLivres === 7) badgeType = 'lecture-7-livres';
    else if (nbLivres === 10) badgeType = 'lecture-10-livres';
    console.log('nbLivres:', nbLivres, 'badgeType:', badgeType);
    let badgeResult = null;
    if (badgeType) {
      console.log('Tentative d\'attribution du badge :', badgeType);
      badgeResult = await rewardsController.giveBadgeToUser(userId, badgeType);
    }
    console.log('nbLivres:', nbLivres, 'badgeType:', badgeType, 'badgeResult:', badgeResult);
    console.log('Après ajout, user.livres.length =', nbLivres);

    res.status(201).json({ book: savedBook, badge: badgeResult });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de l'ajout du livre", error: err.message });
  }
};

// Récupérer tous les livres de la collection de l'utilisateur
exports.getAllBooks = async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await User.findById(userId).populate('livres');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user.livres);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des livres', error: err.message });
  }
};

// Récupérer les détails d'un livre spécifique
exports.getBookById = async (req, res) => {
  try {
    const livre = await Livre.findById(req.params.id);
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json(livre);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du livre', error: err.message });
  }
};

// Récupérer une liste de livres filtrés
exports.filterBooks = async (req, res) => {
  try {
    const { auteur, categorie } = req.query;
    const filter = {};
    if (auteur) filter.auteur = auteur;
    if (categorie) filter.categorie = categorie;
    const livres = await Livre.find(filter);
    res.json(livres);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du filtrage', error: err.message });
  }
};

// Mettre à jour les informations d'un livre
exports.updateBook = async (req, res) => {
  try {
    const livre = await Livre.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json(livre);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
  }
};

// Mettre à jour la progression de lecture
exports.updateProgress = async (req, res) => {
  try {
    const { progression } = req.body;
    const livre = await Livre.findByIdAndUpdate(req.params.id, { progression }, { new: true });
    if (!livre) return res.status(404).json({ message: 'Livre non trouvé' });
    res.json(livre);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la progression', error: err.message });
  }
};

// Ajouter un livre aux favoris
exports.addFavorite = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { $addToSet: { favoris: req.params.id } });
    res.json({ message: 'Livre ajouté aux favoris' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout aux favoris', error: err.message });
  }
};

// Retirer un livre des favoris
exports.removeFavorite = async (req, res) => {
  try {
    const { userId } = req.body;
    await User.findByIdAndUpdate(userId, { $pull: { favoris: req.params.id } });
    res.json({ message: 'Livre retiré des favoris' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors du retrait des favoris', error: err.message });
  }
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    const livreId = req.params.id;
    const userId = req.query.userId;
    // Supprimer le livre de la collection Livre
    await Livre.findByIdAndDelete(livreId);
    // Retirer l'ID du livre du tableau livres de l'utilisateur
    if (userId) {
      await User.findByIdAndUpdate(userId, { $pull: { livres: livreId } });
    }
    // Retirer l'ID du livre du tableau favoris de tous les utilisateurs
    await User.updateMany({}, { $pull: { favoris: livreId } });
    res.json({ message: 'Livre supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la suppression du livre", error: err.message });
  }
};
