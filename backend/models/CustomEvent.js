const mongoose = require("mongoose");

const customEventSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    nameOfEvent: {
      type: String,
      required: true,
    },
    requiredGifts: {
      type: String,
      required: true,
    },
    budgetPerGift: {
      type: Number,
      required: true,
    },
    totalBudget: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomEvent", customEventSchema);
