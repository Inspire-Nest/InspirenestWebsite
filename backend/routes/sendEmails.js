// const express = require("express");
// const router = express.Router();
// const sendEmailsController = require("../controllers/sendEmailsController");

// // POST endpoint to send emails
// router.post(
//   "/send-upcoming-event-emails",
//   sendEmailsController.sendUpcomingEventEmails
// );

// module.exports = router;

const express = require("express");
const router = express.Router();
const sendEmailsController = require("../controllers/sendEmailsController");
const uploadController = require("../controllers/sendEmailsController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/editedTemplates"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.post(
  "/send-upcoming-event-emails",
  sendEmailsController.sendUpcomingEventEmails
);

// ⭐ NEW ROUTE — upload edited template
router.post(
  "/upload-edited-template/:id",
  upload.single("editedImage"),
  uploadController.uploadEditedTemplate
);

module.exports = router;
