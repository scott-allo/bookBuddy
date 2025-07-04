const User = require('../models/User');
const Badge = require('../models/Badge');

// Exemple de mapping type -> badge à attribuer
const badgeMap = {
  'lecture-1-livre': {
    nom: 'lecture-1-livre',
    label: "You added your first book!",
    description: 'Added the first book',
    icone_url: 'badge1.png'
  },
  'lecture-3-livres': {
    nom: 'lecture-3-livres',
    label: '3 books milestone reached!',
    description: 'Added 3 books',
    icone_url: 'badge2.png'
  },
  'lecture-5-livres': {
    nom: 'lecture-5-livres',
    label: "5 books – You're on a roll!",
    description: 'Added 5 books',
    icone_url: 'badge3.png'
  },
  'lecture-7-livres': {
    nom: 'lecture-7-livres',
    label: '7 books – Manga Sensei!',
    description: 'Added 7 books',
    icone_url: 'badge4.png'
  },
  'lecture-10-livres': {
    nom: 'lecture-10-livres',
    label: '10 books – Book Master!',
    description: 'Added 10 books',
    icone_url: 'badge5.png'
  },
  // Ajoute d'autres types ici
};

exports.triggerReward = async (req, res) => {
  try {
    console.log('triggerReward appelé avec type :', req.params.type, 'et userId :', req.body.userId);
    const { userId } = req.body;
    const { type } = req.params;
    const badgeInfo = badgeMap[type];
    if (!badgeInfo) {
      console.error('Type de badge inconnu :', type);
      return res.status(400).json({ message: 'Type de récompense inconnu' });
    }

    // Vérifie si le badge existe déjà, sinon le crée
    let badge = await Badge.findOne({ nom: badgeInfo.nom });
    if (!badge) {
      try {
        badge = new Badge(badgeInfo);
        await badge.save();
        console.log('Badge créé :', badge);
      } catch (err) {
        console.error('Erreur lors de la création du badge :', err);
        return res.status(500).json({ message: 'Erreur création badge', error: err.message });
      }
    } else {
      console.log('Badge déjà existant :', badge.nom);
    }

    // Attribue le badge à l'utilisateur s'il ne l'a pas déjà
    const user = await User.findById(userId);
    if (!user) {
      console.error('Utilisateur non trouvé :', userId);
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    if (!user.badges.includes(badge._id)) {
      user.badges.push(badge._id);
      await user.save();
      console.log('Badge attribué à l\'utilisateur');
      return res.json({ message: 'Badge attribué !', badge });
    } else {
      console.log('Badge déjà obtenu par l\'utilisateur');
      return res.json({ message: 'Badge déjà obtenu', badge });
    }
  } catch (err) {
    console.error('Erreur triggerReward :', err);
    res.status(500).json({ message: 'Erreur lors de la gamification', error: err.message });
  }
};

// Fonction utilitaire pour attribuer un badge et le retourner
exports.giveBadgeToUser = async (userId, type) => {
  const badgeMap = {
    'lecture-1-livre': {
      nom: 'lecture-1-livre',
      label: 'You added your first book!',
      description: 'Added the first book',
      icone_url: 'badge1.png'
    },
    'lecture-3-livres': {
      nom: 'lecture-3-livres',
      label: '3 books milestone reached!',
      description: 'Added 3 books',
      icone_url: 'badge2.png'
    },
    'lecture-5-livres': {
      nom: 'lecture-5-livres',
      label: "5 books – You're on a roll!",
      description: 'Added 5 books',
      icone_url: 'badge3.png'
    },
    'lecture-7-livres': {
      nom: 'lecture-7-livres',
      label: '7 books – Manga Sensei!',
      description: 'Added 7 books',
      icone_url: 'badge4.png'
    },
    'lecture-10-livres': {
      nom: 'lecture-10-livres',
      label: '10 books – Book Master!',
      description: 'Added 10 books',
      icone_url: 'badge5.png'
    },
  };
  const badgeInfo = badgeMap[type];
  if (!badgeInfo) return null;

  let badge = await Badge.findOne({ nom: badgeInfo.nom });
  if (!badge) {
    badge = new Badge(badgeInfo);
    await badge.save();
  }
  const user = await User.findById(userId);
  if (!user) return null;
  if (!user.badges.includes(badge._id)) {
    user.badges.push(badge._id);
    await user.save();
    return badge;
  } else {
    return badge;
  }
};
