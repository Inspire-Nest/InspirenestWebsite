const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company", // reference to Company collection
    required: true,
  },
  personType: {
    type: String,
    required: true,
  },
  birthday: {
    type: Boolean,
    default: false,
  },
  work_anniversary: {
    type: Boolean,
    default: false,
  },
  wedding_anniversary: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SubscriptionPreference", subscriptionSchema);
