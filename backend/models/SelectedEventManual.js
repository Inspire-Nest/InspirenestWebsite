const mongoose = require("mongoose");

const selectedEventManualSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomEventManual", // <-- links to your master table
      required: true,
    },
    selectedAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SelectedManualEvent", selectedEventManualSchema);
