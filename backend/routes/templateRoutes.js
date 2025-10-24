const express = require("express");
const router = express.Router();
const uploadTemplate = require("../middleware/uploadTemplate");
const templateController = require("../controllers/templateController");

// POST: Upload a new template
router.post("/templates", uploadTemplate.single("image"), templateController.uploadTemplate);

// GET: Fetch all templates
router.get("/templates", templateController.getTemplates);

// GET: Fetch template by name
router.get("/templates/:name", templateController.getTemplateByEventType);

module.exports = router;
