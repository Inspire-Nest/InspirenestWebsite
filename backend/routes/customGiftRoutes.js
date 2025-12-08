const express = require("express");
const router = express.Router();
const CustomGift = require("../models/CustomGift");

// ✅ Create custom gift(s)
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      const result = await CustomGift.insertMany(data);
      res.status(201).json({
        message: "Multiple custom gifts added successfully",
        data: result,
      });
    } else {
      const newGift = new CustomGift(data);
      const result = await newGift.save();
      res.status(201).json({
        message: "Custom gift added successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error("Error adding custom gift:", error);
    res.status(400).json({ error: error.message });
  }
});

// ✅ Get all custom gifts
router.get("/", async (req, res) => {
  try {
    const gifts = await CustomGift.find().sort({ createdAt: -1 });
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch custom gifts" });
  }
});

module.exports = router;
