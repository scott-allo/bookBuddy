const User = require('../models/User');

// Récupérer les infos du profil utilisateur
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('livres').populate('badges').populate('favoris');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({
      id: user._id,
      nom: user.nom,
      email: user.email,
      date_inscr: user.date_inscr,
      date_of_birth: user.date_of_birth,
      gender: user.gender,
      avatar_url: user.avatar_url,
      livres: user.livres,
      badges: user.badges,
      favoris: user.favoris
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: err.message });
  }
};

// Modifier les infos du profil utilisateur
exports.updateUserProfile = async (req, res) => {
  try {
    const { nom, email, password, date_of_birth, gender, avatar_url } = req.body;
    const update = {};
    if (nom) update.nom = nom;
    if (email) update.email = email;
    if (date_of_birth) update.date_of_birth = date_of_birth;
    if (gender) update.gender = gender;
    if (avatar_url) update.avatar_url = avatar_url;
    if (password) {
      const bcrypt = require('bcrypt');
      update.mdp_hash = await bcrypt.hash(password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Profil mis à jour', user });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: err.message });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucun fichier envoyé' });
    const avatarUrl = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.params.id, { avatar_url: avatarUrl }, { new: true });
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Avatar mis à jour', avatar_url: avatarUrl });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'upload de l\'avatar', error: err.message });
  }
};

// Récupérer la liste des favoris d'un utilisateur
exports.getUserFavoris = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favoris');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user.favoris);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des favoris', error: err.message });
  }
};

// Ajouter ou retirer un favori (toggle)
exports.toggleFavori = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    const livreId = req.params.livreId;
    const index = user.favoris.indexOf(livreId);
    let action;
    if (index === -1) {
      user.favoris.push(livreId);
      action = 'ajouté';
    } else {
      user.favoris.splice(index, 1);
      action = 'retiré';
    }
    await user.save();
    res.json({ message: `Livre ${action} aux favoris`, favoris: user.favoris });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la modification des favoris', error: err.message });
  }
}; 