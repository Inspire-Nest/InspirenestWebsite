const SelectedEvent = require("../models/SelectedEventManual");
const CustomEvent = require("../models/CustomEventManual");

// Save selected events
exports.saveSelectedEvents = async (req, res) => {
  try {
    const { selectedEventIds } = req.body; // Array of event IDs

    if (!Array.isArray(selectedEventIds) || selectedEventIds.length === 0) {
      return res.status(400).json({ message: "No events selected" });
    }

    // Insert selected events
    const saved = await SelectedEvent.insertMany(
      selectedEventIds.map(id => ({ eventId: id }))
    );

    res.status(201).json({
      message: "Selected events saved successfully",
      data: saved,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving selected events",
      error: error.message,
    });
  }
};

// Get all selected events (with full event details)
exports.getSelectedEvents = async (req, res) => {
  try {
    const data = await SelectedEvent.find().populate("eventId"); 
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching selected events",
      error: error.message,
    });
  }
};
