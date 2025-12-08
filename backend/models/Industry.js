const mongoose = require("mongoose");

const IndustrySchema = new mongoose.Schema(
  {
    industryName: {
      type: String,
      required: [true, "Industry name is required"],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "industries", // ✅ explicitly map to the correct collection
  }
);

// Prevent overwriting model in watch mode (optional but safe)
delete mongoose.connection.models["Industry"];
module.exports = mongoose.model("Industry", IndustrySchema);
