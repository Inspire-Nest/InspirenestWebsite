const express = require("express");
const router = express.Router();
const {
  saveCalendarSelectedEvents,
  getCalendarSelectedEvents,
  getAllSavedCalendarEvents,
} = require("../controllers/calendarSelectedEventController");

// POST → save selected events with gift proposal & budget
router.post("/calendareventselection/save", saveCalendarSelectedEvents);

// GET → get previously saved events
router.get("/calendareventselection/get", getCalendarSelectedEvents);

// 🆕 GET → Get all saved events (history of all companies)
router.get("/calendareventselection/all", getAllSavedCalendarEvents);

module.exports = router;
