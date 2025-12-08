const mongoose = require("mongoose");

const selectedEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomEvent",
      required: true,
    },
    selectedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SelectedEvent", selectedEventSchema);
