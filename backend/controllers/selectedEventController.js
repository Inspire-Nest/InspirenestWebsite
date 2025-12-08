const SelectedEvent = require("../models/SelectedEvent");
const CustomEvent = require("../models/CustomEvent");

// Get events by month
exports.getEventsByMonth = async (req, res) => {
  try {
    const { month, year } = req.query; // e.g. ?month=8&year=2025

    if (!month || !year) {
      return res.status(400).json({ message: "Month and Year are required" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const events = await CustomEvent.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching monthly events", error: error.message });
  }
};

// Save selected events
exports.saveSelectedEvents = async (req, res) => {
  try {
    const { selectedEventIds } = req.body; // Array of ObjectIds

    if (!Array.isArray(selectedEventIds) || selectedEventIds.length === 0) {
      return res.status(400).json({ message: "No events selected" });
    }

    const saved = await SelectedEvent.insertMany(
      selectedEventIds.map((id) => ({ eventId: id }))
    );

    res
      .status(201)
      .json({ message: "Selected events saved successfully", data: saved });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error saving selected events", error: error.message });
  }
};

// Get all selected events (with full event details)
exports.getSelectedEvents = async (req, res) => {
  try {
    const data = await SelectedEvent.find()
      .populate("eventId") // Fetch data from CustomEvent
      .sort({ createdAt: -1 }); // optional: latest first

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching selected events",
      error: error.message,
    });
  }
};
