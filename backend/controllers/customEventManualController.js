const CustomEventManual = require("../models/CustomEventManual");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// Create new custom event (POST JSON body)
exports.createCustomEvent = async (req, res) => {
  try {
    const { date, nameOfEvent, requiredGifts, budgetPerGift, totalBudget } = req.body;

    const newEvent = new CustomEventManual({
      date,
      nameOfEvent,
      requiredGifts,
      budgetPerGift,
      totalBudget,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({
      message: "Custom event created successfully",
      event: savedEvent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating custom event",
      error: error.message,
    });
  }
};
// Get all custom events (GET)
exports.getCustomEvents = async (req, res) => {
  try {
    const events = await CustomEventManual.find().sort({ date: -1 }); // latest first
    res.status(200).json({
      message: "Custom events fetched successfully",
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching custom events",
      error: error.message,
    });
  }
};



// Upload Excel and save events (POST with file)
exports.uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = path.join(__dirname, "../uploads", req.file.filename);

    // Read Excel
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0]; // First sheet
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Transform rows into model format
    const eventsToInsert = sheetData.map((row) => ({
      date: row.date ? new Date(row.date) : null,
      nameOfEvent: row.nameOfEvent || "",
      requiredGifts: row.requiredGifts || "",
      budgetPerGift: row.budgetPerGift || 0,
      totalBudget: row.totalBudget || 0,
    }));

    // Insert into DB
    const inserted = await CustomEventManual.insertMany(eventsToInsert);

    // Delete file after processing (optional cleanup)
    fs.unlinkSync(filePath);

    res.status(201).json({
      message: "Excel data uploaded successfully",
      count: inserted.length,
      data: inserted,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading Excel data",
      error: error.message,
    });
  }
};
