const express = require("express");
const router = express.Router();
const selectedEventController = require("../controllers/selectedEventController");

router.get("/events/monthly", selectedEventController.getEventsByMonth);
router.post("/events/save", selectedEventController.saveSelectedEvents);
router.get("/selected-events", selectedEventController.getSelectedEvents);
module.exports = router;
