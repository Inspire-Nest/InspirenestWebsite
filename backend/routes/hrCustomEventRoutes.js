const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/hrCustomEventController");

// ✅ CRUD Routes
router.post("/events", createEvent); // Create new event
router.get("/events", getEvents); // Get all events
router.get("/events/:id", getEventById); // Get single event
router.put("/events/:id", updateEvent); // Update event
router.delete("/events/:id", deleteEvent); // Delete event

module.exports = router;
