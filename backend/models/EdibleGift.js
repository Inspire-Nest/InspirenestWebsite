const mongoose = require("mongoose");

const EdibleGiftSchema = new mongoose.Schema(
  {
    eat_id: {
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
  { timestamps: true }
);

module.exports = mongoose.model("EdibleGift", EdibleGiftSchema);
