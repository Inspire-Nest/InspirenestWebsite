const express = require("express");
const router = express.Router();
const EdibleGift = require("../models/EdibleGift");

// Create edible gift(s)
router.post("/", async (req, res) => {
  try {
    const data = req.body;

    // Allow single or multiple JSON entries
    if (Array.isArray(data)) {
      const result = await EdibleGift.insertMany(data);
      res.status(201).json({
        message: "Multiple edible gifts added successfully",
        data: result,
      });
    } else {
      const newGift = new EdibleGift(data);
      const result = await newGift.save();
      res.status(201).json({
        message: "Edible gift added successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error("Error adding edible gift:", error);
    res.status(400).json({ error: error.message });
  }
});

// Get all edible gifts
router.get("/", async (req, res) => {
  try {
    const gifts = await EdibleGift.find().sort({ createdAt: -1 });
    res.json(gifts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch edible gifts" });
  }
});

module.exports = router;
