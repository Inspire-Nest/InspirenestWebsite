const express = require("express");
const router = express.Router();
const CompanyType = require("../models/CompanyType");

// Create
router.post("/", async (req, res) => {
  try {
    const { companyType } = req.body;
    if (!companyType)
      return res.status(400).json({ message: "Company type is required" });

    const newType = await CompanyType.create({ companyType });
    res.status(201).json({ message: "Company type created", data: newType });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create company type", error: err.message });
  }
});

// ✅ GET all company types
router.get("/", async (req, res) => {
  try {
    const companyTypes = await CompanyType.find();
    console.log("Fetched:", companyTypes); // check your console output
    res.status(200).json(companyTypes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
