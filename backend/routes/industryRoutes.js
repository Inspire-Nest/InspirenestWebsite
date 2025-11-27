const express = require("express");
const router = express.Router();
const Industry = require("../models/Industry");

router.post("/", async (req, res) => {
  try {
    const { industryName } = req.body;

    if (!industryName) {
      return res.status(400).json({ error: "Industry name is required" });
    }

    const existing = await Industry.findOne({
      industryName: industryName.trim(),
    });
    if (existing) {
      return res.status(400).json({ error: "Industry already exists" });
    }

    const newIndustry = new Industry({ industryName: industryName.trim() });
    await newIndustry.save();

    res.status(201).json({
      message: "Industry added successfully",
      industry: newIndustry,
    });
  } catch (error) {
    console.error("❌ Error while adding industry:", error);
    res.status(500).json({ error: error.message }); // print real message
  }
});

// ✅ GET — Fetch all industries
router.get("/", async (req, res) => {
  try {
    const industries = await Industry.find().sort({ createdAt: -1 });
    res.status(200).json(industries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch industries" });
  }
});

module.exports = router;
