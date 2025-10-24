const express = require("express");
const router = express.Router();
const selectedEventController = require("../controllers/selectedEventManualController");

// POST: save selected events
router.post("/save/manual", selectedEventController.saveSelectedEvents);

// GET: fetch selected events
router.get("/manual", selectedEventController.getSelectedEvents);

module.exports = router;
