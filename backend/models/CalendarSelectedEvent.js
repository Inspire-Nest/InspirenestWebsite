const mongoose = require("mongoose");

const calendarSelectedEventSchema = new mongoose.Schema(
  {
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "CalendarEvent" },
    giftProposal: { type: String, default: "" },
    budget: { type: String, default: "" },
    companyId: { type: String, default: "" }, // optional for company-specific saves
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "CalendarSelectedEvent",
  calendarSelectedEventSchema
);
