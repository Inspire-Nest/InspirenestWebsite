const CalendarSelectedEvent = require("../models/CalendarSelectedEvent");

// ✅ Save selected events with gift proposal and budget
// exports.saveCalendarSelectedEvents = async (req, res) => {
//   try {
//     const { selectedEvents, companyId } = req.body;

//     if (!Array.isArray(selectedEvents) || selectedEvents.length === 0) {
//       return res.status(400).json({ message: "No events provided" });
//     }

//     // Optional: Clear old selections for the same company
//     if (companyId) {
//       await CalendarSelectedEvent.deleteMany({ companyId });
//     }

//     // Insert new selections
//     const saved = await CalendarSelectedEvent.insertMany(
//       selectedEvents.map((e) => ({
//         ...e,
//         companyId,
//       }))
//     );

//     res.status(200).json({
//       message: "Calendar events saved successfully!",
//       saved,
//     });
//   } catch (error) {
//     console.error("Error saving calendar selected events:", error);
//     res.status(500).json({
//       message: "Server error while saving events",
//       error: error.message,
//     });
//   }
// };

// ✅ Save selected events with gift proposal and budget
// exports.saveCalendarSelectedEvents = async (req, res) => {
//   try {
//     const { selectedEvents, companyId } = req.body;

//     if (!Array.isArray(selectedEvents) || selectedEvents.length === 0) {
//       return res.status(400).json({ message: "No events provided" });
//     }

//     // ❌ Remove this line to avoid deleting previous entries
//     // if (companyId) {
//     //   await CalendarSelectedEvent.deleteMany({ companyId });
//     // }

//     // ✅ Insert new selections
//     const saved = await CalendarSelectedEvent.insertMany(
//       selectedEvents.map((e) => ({
//         ...e,
//         companyId,
//       }))
//     );

//     res.status(200).json({
//       message: "Calendar events saved successfully!",
//       saved,
//     });
//   } catch (error) {
//     console.error("Error saving calendar selected events:", error);
//     res.status(500).json({
//       message: "Server error while saving events",
//       error: error.message,
//     });
//   }
// };

exports.saveCalendarSelectedEvents = async (req, res) => {
  try {
    const events = req.body; // should be an array

    if (!Array.isArray(events) || events.length === 0) {
      return res.status(400).json({ message: "No events provided" });
    }

    const saved = [];

    for (const e of events) {
      const newEvent = new CalendarSelectedEvent({
        eventId: e.eventId,
        giftProposal: e.giftProposal || "",
        budget: e.budget || "",
        companyId: e.companyId || "",
      });
      const savedEvent = await newEvent.save();
      saved.push(savedEvent);
    }

    res.json({ message: "Calendar events saved successfully!", saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving calendar events" });
  }
};

// ✅ Fetch all saved events (with populated event details)
exports.getCalendarSelectedEvents = async (req, res) => {
  try {
    const { companyId } = req.query;
    const query = companyId ? { companyId } : {};

    const events = await CalendarSelectedEvent.find(query).populate("eventId");
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching calendar selected events:", error);
    res.status(500).json({
      message: "Server error while fetching selected events",
      error: error.message,
    });
  }
};

exports.getAllSavedCalendarEvents = async (req, res) => {
  try {
    const allEvents = await CalendarSelectedEvent.find({})
      .populate("eventId")
      .sort({ createdAt: -1 }); // newest first

    res.status(200).json(allEvents);
  } catch (error) {
    console.error("Error fetching all calendar selected events:", error);
    res.status(500).json({
      message: "Server error while fetching all selected events",
      error: error.message,
    });
  }
};
