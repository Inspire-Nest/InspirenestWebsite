const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
    companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  name: { type: String, required: true },       // e.g. "Birthday Template 1"
  eventType: { type: String, required: true },  // e.g. "Birthday", "Wedding Anniversary"
  image: { type: String, required: true },      // stored file path
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Template", templateSchema);
