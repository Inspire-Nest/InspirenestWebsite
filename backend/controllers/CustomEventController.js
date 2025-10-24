const CustomEvent = require("../models/CustomEvent");

// Create a new custom event
exports.createCustomEvent = async (req, res) => {
  try {
    const { date, nameOfEvent, requiredGifts, budgetPerGift, totalBudget } =
      req.body;

    const newEvent = new CustomEvent({
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
    res
      .status(500)
      .json({ message: "Error creating custom event", error: error.message });
  }
};

// Get all custom events
exports.getAllCustomEvents = async (req, res) => {
  try {
    const events = await CustomEvent.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

// Update a custom event
exports.updateCustomEvent = async (req, res) => {
  try {
    const { id } = req.params; // event id from URL
    const updatedEvent = await CustomEvent.findByIdAndUpdate(id, req.body, {
      new: true, // return updated document
      runValidators: true, // validate schema on update
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: "Custom event not found" });
    }

    res
      .status(200)
      .json({
        message: "Custom event updated successfully",
        event: updatedEvent,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating custom event", error: error.message });
  }
};

// Delete a custom event
exports.deleteCustomEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await CustomEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Custom event not found" });
    }

    res.status(200).json({ message: "Custom event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting custom event", error: error.message });
  }
};
