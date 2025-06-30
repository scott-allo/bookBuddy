const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// Récupérer les infos du profil utilisateur
router.get('/:id', userController.getUserProfile);
// Modifier les infos du profil utilisateur
router.put('/:id', userController.updateUserProfile);

module.exports = router; 