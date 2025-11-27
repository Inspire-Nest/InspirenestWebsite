// routes/EmpLevelRoutes.js
const express = require("express");
const router = express.Router();
const EmpLevel = require("../models/EmpLevel");

// ✅ Create new employee level
router.post("/emplevels", async (req, res) => {
  try {
    const { level } = req.body;
    if (!level) {
      return res.status(400).json({ message: "Level is required" });
    }

    const newLevel = new EmpLevel({ level });
    await newLevel.save();
    res.status(201).json({ message: "Employee level created", data: newLevel });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create employee level",
      error: error.message,
    });
  }
});

// ✅ Get all employee levels
router.get("/get/emplevels", async (req, res) => {
  try {
    const levels = await EmpLevel.find().sort({ createdAt: 1 });
    res.json(levels);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch employee levels",
      error: error.message,
    });
  }
});

module.exports = router;
