const express = require("express");
const router = express.Router();
const giftController = require("../controllers/giftPreferenceController");

// Save gift preferences
router.post("/giftsave", giftController.saveGiftPreferences);

// Get preferences for a specific occasion type
router.get("/:occasionType", giftController.getPreferencesByOccasion);

module.exports = router;
