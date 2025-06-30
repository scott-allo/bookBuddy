const express = require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewards.controller');

// Déclencher une action de gamification (ex : attribuer un badge)
router.post('/:type', rewardsController.triggerReward);

// Tu pourras ajouter tes routes ici plus tard

module.exports = router;
