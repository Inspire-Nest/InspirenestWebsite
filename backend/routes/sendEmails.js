const express = require("express");
const router = express.Router();
const sendEmailsController = require("../controllers/sendEmailsController");

// POST endpoint to send emails
router.post("/send-upcoming-event-emails", sendEmailsController.sendUpcomingEventEmails);

module.exports = router;
