const express = require('express');
const router = express.Router();
const rewardsController = require('../controllers/rewards.controller');

router.post('/:type', rewardsController.triggerReward);


module.exports = router;
