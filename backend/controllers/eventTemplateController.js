const EventTemplate = require("../models/EventTemplate");

// Upload + fetch all in one API
const uploadTemplate = async (req, res) => {
  try {
    const { eventType, title } = req.body;

    // Validate fields
    if (!eventType || !title) {
      return res.status(400).json({ message: "Event type and title are required" });
    }

    // File check
    if (!req.file) {
      return res.status(400).json({ message: "Template image file is required" });
    }

    // Limit check (max 10 per event type)
    const count = await EventTemplate.countDocuments({ eventType });
    if (count >= 10) {
      return res.status(400).json({ message: "Limit of 10 templates per event type reached" });
    }

    // Save template
    const imageUrl = `/uploads/${req.file.filename}`;
    const template = new EventTemplate({ eventType, title, imageUrl });
    await template.save();

    // Fetch all templates after saving
    const allTemplates = await EventTemplate.find().sort({ createdAt: -1 });

    res.status(201).json({
      message: "Template uploaded successfully",
      savedTemplate: template,
      allTemplates
    });

  } catch (error) {
    console.error("Upload template error:", error);
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};

// Regular GET route for fetching templates only
const getTemplates = async (req, res) => {
  try {
    const templates = await EventTemplate.find().sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch templates", error: error.message });
  }
};

module.exports = {
  uploadTemplate,
  getTemplates
};
