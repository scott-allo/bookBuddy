const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Récupérer les infos du profil utilisateur
router.get('/:id', userController.getUserProfile);
// Modifier les infos du profil utilisateur
router.put('/:id', userController.updateUserProfile);
// Upload de l'avatar utilisateur
router.post('/:id/avatar', upload.single('avatar'), userController.uploadAvatar);
// Récupérer les favoris d'un utilisateur
router.get('/:id/favoris', userController.getUserFavoris);
// Ajouter/retirer un favori
router.post('/:id/favoris/:livreId', userController.toggleFavori);

module.exports = router; 