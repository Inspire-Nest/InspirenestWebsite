const mongoose = require("mongoose");

const giftPreferenceSchema = new mongoose.Schema({
  occasionType: {
    type: String,
    enum: ["birthday", "wedding_anniversary", "work_anniversary"],
    required: true,
  },
  personType: {
    type: String, // e.g., 'Employee', 'Spouse', 'Kid - 1'
    required: true,
  },
  whatsapp: {
    type: Boolean,
    default: false,
  },
  email: {
    type: Boolean,
    default: false,
  },
  edibleGift: {
    type: [String],
    default: "",
  },
  customGift: {
    type: [String],
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GiftPreference", giftPreferenceSchema);
