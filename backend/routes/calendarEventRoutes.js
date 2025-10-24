// const express = require("express");
// const multer = require("multer");
// const {
//   uploadEvents,
//   getEvents,
//   getEventById,
//   updateEvent,
//   deleteEvent,
// } = require("../controllers/calendarEventController");

// const router = express.Router();
// const upload = multer({ dest: "uploads/" }); // store uploaded Excel temporarily

// // Upload Excel file
// router.post("/calendar-events/upload", upload.single("file"), uploadEvents);

// // CRUD APIs
// router.get("/calendar-events/", getEvents);
// router.get("/calendar-events/:id", getEventById);
// router.put("/calendar-events/:id", updateEvent);
// router.delete("/calendar-events/:id", deleteEvent);

// module.exports = router;

const express = require("express");
const multer = require("multer");
const {
  uploadEvents,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  getAllCalendarEvents,
  saveSelectedEvents,
} = require("../controllers/calendarEventController");

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // store uploaded Excel temporarily

// Upload Excel file
router.post("/calendar-events/upload", upload.single("file"), uploadEvents);

// CRUD APIs
router.get("/calendarevents", getEvents);
router.get("/calendarevents/cal", getAllCalendarEvents);

router.get("/calendar-events/:id", getEventById);
router.put("/calendar-events/:id", updateEvent);
router.delete("/calendar-events/:id", deleteEvent);
router.post("/calendar-events/save-selected", saveSelectedEvents);

module.exports = router;
