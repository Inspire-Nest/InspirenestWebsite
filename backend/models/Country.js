const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    countryName: {
      type: String,
      required: [true, "Country name is required"],
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "countries",
  }
);

// Prevent overwrite errors in dev/watch mode
delete mongoose.connection.models["Country"];
module.exports = mongoose.model("Country", CountrySchema);
