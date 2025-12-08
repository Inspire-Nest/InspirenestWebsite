// models/EmpLevel.js
const mongoose = require("mongoose");

const EmpLevelSchema = new mongoose.Schema(
  {
        companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true
    },
    level: {
      type: String,
      required: true,
      trim: true,
      unique: true, // optional: prevent duplicates like L1 appearing twice
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // only createdAt
  }
);

module.exports = mongoose.model("EmpLevel", EmpLevelSchema);
