const express = require("express");
const router = express.Router();
const {
  createCustomEvent,
  getAllCustomEvents,
  updateCustomEvent,
  deleteCustomEvent,
} = require("../controllers/CustomEventController");

router.post("/custom-events", createCustomEvent);
router.get("/get/custom-events", getAllCustomEvents);
router.put("/update/custom-events/:id", updateCustomEvent);
router.delete("/delete/custom-events/:id", deleteCustomEvent);

module.exports = router;
