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
    const { nom, email, password } = req.body;
    const update = {};
    if (nom) update.nom = nom;
    if (email) update.email = email;
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