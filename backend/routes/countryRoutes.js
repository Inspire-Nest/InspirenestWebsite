const express = require("express");
const router = express.Router();
const Country = require("../models/Country");

// ✅ POST — Add new country
router.post("/", async (req, res) => {
  try {
    const { countryName } = req.body;
    if (!countryName)
      return res.status(400).json({ error: "Country name is required" });

    const existing = await Country.findOne({ countryName: countryName.trim() });
    if (existing)
      return res.status(400).json({ error: "Country already exists" });

    const country = new Country({ countryName: countryName.trim() });
    await country.save();

    res.status(201).json({ message: "Country added successfully", country });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ GET — Fetch all countries (sorted alphabetically)
router.get("/", async (req, res) => {
  try {
    const countries = await Country.find().sort({ countryName: 1 });
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch countries" });
  }
});

module.exports = router;
