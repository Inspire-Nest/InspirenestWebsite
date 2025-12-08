const mongoose = require("mongoose");

const giftPreferenceSchema = new mongoose.Schema({
    companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  occasionType: {
    type: String,
    enum: ["birthday", "wedding_anniversary", "work_anniversary"],
    required: true,
  },
  personType: {
    type: String, // e.g., 'Employee', 'Spouse', 'Kid - 1'
    required: true,
  },

  // ✅ New field - Subscription Level
  level: {
    type: String, // Example values: "Basic", "Standard", "Premium", etc.
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
  edibleGift: [
    {
      eat_id: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],

  // ⭐ Store custom gifts: custom_id + description
  customGift: [
    {
      custom_id: { type: String, required: true },
      description: { type: String, required: true }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("GiftPreference", giftPreferenceSchema);
