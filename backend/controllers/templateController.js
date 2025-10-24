const Template = require("../models/Template");

// Upload Template
exports.uploadTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { name, eventType } = req.body;
    if (!name || !eventType) {
      return res.status(400).json({ message: "Template name and event type are required" });
    }

    const template = new Template({
      name,
      eventType,
      image: `/uploads/templates/${req.file.filename}`, // stored path
    });

    await template.save();
    res.status(201).json({
      message: "Template uploaded successfully",
      template,
    });
  } catch (err) {
    res.status(500).json({ message: "Error uploading template", error: err.message });
  }
};

// Get all templates
exports.getTemplates = async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching templates", error: err.message });
  }
};

// Get template by event type
exports.getTemplateByEventType = async (req, res) => {
  try {
    const template = await Template.findOne({ eventType: req.params.eventType });
    if (!template) {
      return res.status(404).json({ message: "Template not found for this event type" });
    }
    res.status(200).json(template);
  } catch (err) {
    res.status(500).json({ message: "Error fetching template", error: err.message });
  }
};
