const mongoose = require("mongoose");

const CustomGiftSchema = new mongoose.Schema(
  {
    custom_id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, collection: "customgifts" }
);

delete mongoose.connection.models["CustomGift"];

module.exports = mongoose.model("CustomGift", CustomGiftSchema);
