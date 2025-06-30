const Livre = require('../models/Livre');
const User = require('../models/User');

// Ajouter un nouveau livre à la collection de l'utilisateur
exports.addBook = async (req, res) => {
  try {
    const { titre, auteur, image_url, nb_pages, categorie, progression, userId } = req.body;
    const livre = new Livre({ titre, auteur, image_url, nb_pages, categorie, progression });
    const savedBook = await livre.save();
    // Ajouter le livre à la collection de l'utilisateur
    await User.findByIdAndUpdate(userId, { $push: { livres: savedBook._id } });
    res.status(201).json(savedBook);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du livre', error: err.message });
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
