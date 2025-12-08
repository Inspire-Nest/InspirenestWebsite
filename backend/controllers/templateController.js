const Template = require("../models/Template");

exports.uploadTemplate = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const { name, eventType, companyId } = req.body;

    if (!name || !eventType || !companyId) {
      return res.status(400).json({ message: "Name, eventType, and company_id are required" });
    }

    const template = new Template({
      name,
      eventType,
      image: `/uploads/templates/${req.file.filename}`,
      companyId,
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
exports.getTemplates = async (req, res) => {
  try {
    const { companyId } = req.query;

    if (!companyId) {
      return res.status(400).json({ message: "companyId is required" });
    }

    const templates = await Template.find({ companyId });

    res.status(200).json(templates);
  } catch (err) {
    res.status(500).json({ message: "Error fetching templates", error: err.message });
  }
};

exports.getTemplateByEventType = async (req, res) => {
  try {
    const { eventType } = req.params;
    const companyId = req.query.company_id;

    if (!companyId) {
      return res.status(400).json({ message: "company_id is required" });
    }

    const template = await Template.findOne({
      eventType,
      company_id: companyId,
    });

    if (!template) {
      return res.status(404).json({
        message: "Template not found for this event and company",
      });
    }

    res.status(200).json(template);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching template",
      error: err.message,
    });
  }
};
