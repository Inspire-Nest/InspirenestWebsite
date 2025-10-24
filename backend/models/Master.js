const mongoose = require("mongoose");

// Generic schema
const masterFieldSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

// Export separate collections
const EmployeeLevel = mongoose.model("EmployeeLevel", masterFieldSchema);
const EditableGift = mongoose.model("EditableGift", masterFieldSchema);
const CustomGift = mongoose.model("CustomGift", masterFieldSchema);
const Industry = mongoose.model("Industry", masterFieldSchema);
const VendorType = mongoose.model("VendorType", masterFieldSchema);
const City = mongoose.model("City", masterFieldSchema);
const Category = mongoose.model("Category", masterFieldSchema);

module.exports = {
  EmployeeLevel,
  EditableGift,
  CustomGift,
  Industry,
  VendorType,
  City,
  Category
};
