const User = require('../models/User');
const Badge = require('../models/Badge');

// Exemple de mapping type -> badge à attribuer
const badgeMap = {
  'lecture-5-livres': {
    nom: 'Lecteur assidu',
    description: 'A lu 5 livres',
    icone_url: 'lecteur-assidu.png'
  },
  // Ajoute d'autres types ici
};

exports.triggerReward = async (req, res) => {
  try {
    const { userId } = req.body;
    const { type } = req.params;
    const badgeInfo = badgeMap[type];
    if (!badgeInfo) return res.status(400).json({ message: 'Type de récompense inconnu' });

    // Vérifie si le badge existe déjà, sinon le crée
    let badge = await Badge.findOne({ nom: badgeInfo.nom });
    if (!badge) {
      badge = new Badge(badgeInfo);
      await badge.save();
    }

    // Attribue le badge à l'utilisateur s'il ne l'a pas déjà
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if (!user.badges.includes(badge._id)) {
      user.badges.push(badge._id);
      await user.save();
      return res.json({ message: 'Badge attribué !', badge });
    } else {
      return res.json({ message: 'Badge déjà obtenu', badge });
    }
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la gamification', error: err.message });
  }
};
