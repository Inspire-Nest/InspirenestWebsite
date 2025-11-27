const express = require("express");
const router = express.Router();
const upcomingEventsController = require("../controllers/upcomingEventsController");
const {
  getAllUpcomingEvents,
} = require("../controllers/upcomingEventsController");

// GET all upcoming events
router.get("/upcoming-events", getAllUpcomingEvents);
// Endpoint to manually trigger
router.get(
  "/check-upcoming-events",
  upcomingEventsController.checkUpcomingEvents
);

module.exports = router;
