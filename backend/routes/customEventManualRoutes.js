const express = require("express");
const router = express.Router();
const customEventManualController = require("../controllers/customEventManualController");
const upload = require("../middleware/upload"); // your multer config

// POST: create event
router.post("/create/manual", customEventManualController.createCustomEvent);

// GET: fetch all events
router.get("/get/manual", customEventManualController.getCustomEvents);
// Excel Upload API
router.post(
  "/upload-excel/manual",
  upload.single("file"), // file field name must be 'file'
  customEventManualController.uploadExcel
);
module.exports = router;
