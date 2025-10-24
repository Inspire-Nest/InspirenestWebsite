const mongoose = require("mongoose");

const eventTemplateSchema = new mongoose.Schema({
  eventType: {
    type: String,
    enum: ["Birthday", "Work Anniversary", "Wedding Anniversary"],
    required: true,
  },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Force exactly "eventtemplates" collection
module.exports = mongoose.model(
  "EventTemplate",
  eventTemplateSchema,
  "eventtemplates"
);
