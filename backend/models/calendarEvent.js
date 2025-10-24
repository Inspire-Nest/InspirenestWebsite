const mongoose = require("mongoose");

const calendarEventSchema = new mongoose.Schema(
  {
    eventDate: { type: String, default: "" },
    eventName: { type: String, default: "" },
    scope: { type: String, default: "" },
    category: { type: String, default: "" },
    suggestedActivities: { type: String, default: "" },
    budget: { type: String, default: "" },
    giftProposal: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CalendarEvent", calendarEventSchema);
