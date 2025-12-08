const mongoose = require("mongoose");

const CompanyTypeSchema = new mongoose.Schema(
  {
    companyType: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    collection: "companytypes", // ✅ explicitly tell Mongoose to use this collection
  }
);

module.exports = mongoose.model("CompanyType", CompanyTypeSchema);
