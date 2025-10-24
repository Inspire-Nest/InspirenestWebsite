const HrCustomEvent = require("../models/hrCustomEvent");

// ✅ Create Event
exports.createEvent = async (req, res) => {
  try {
    const { eventName, eventDate, description } = req.body;

    if (!eventName || !eventDate) {
      return res
        .status(400)
        .json({ message: "Event name and date are required" });
    }

    const event = new HrCustomEvent({ eventName, eventDate, description });
    await event.save();

    res.status(201).json({ message: "Event created successfully", event });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating event", error: err.message });
  }
};

// ✅ Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await HrCustomEvent.find().sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: err.message });
  }
};

// ✅ Get Single Event
exports.getEventById = async (req, res) => {
  try {
    const event = await HrCustomEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: err.message });
  }
};

// ✅ Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { eventName, eventDate, description } = req.body;
    const event = await HrCustomEvent.findByIdAndUpdate(
      req.params.id,
      { eventName, eventDate, description },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event updated successfully", event });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating event", error: err.message });
  }
};

// ✅ Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await HrCustomEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: err.message });
  }
};
