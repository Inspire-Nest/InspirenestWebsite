// models/Logo.js
const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema({
  image: { type: String, required: true }, // stored file path
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Logo", logoSchema);
