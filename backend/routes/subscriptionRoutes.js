const express = require('express');
const router = express.Router();
const controller = require('../controllers/subscriptionController');

// Save subscriptions
router.post('/save', controller.saveSubscriptions);

// Get all subscriptions
router.get('/subscription', controller.getSubscriptions);

module.exports = router;
