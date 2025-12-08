const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  vendorType: { type: String, required: true },
  vendorName: { type: String, required: true },
  contactNo: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true },
  gstNumber: { type: String, required: true },

  address: {
    address1: { type: String, required: true },
    address2: { type: String },
    townOrVillage: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    gpsLocationLink: { type: String, required: true },
  },

  managerDetails: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },

  storeDetails: {
    generalContact: { type: String, required: true },
  },

  headOffice: {
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    contactPerson: { type: String, required: true },
    contactDesignation: { type: String, required: true },
    contactPhone: { type: String, required: true },
    contactEmail: { type: String, required: true },
  },

  remark: { type: String, required: true },

  bankDetails: {
    accountHolderName: { type: String, required: true },
    bankName: { type: String, required: true },
    accountNo: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankBranch: { type: String, required: true },
    bankAddress: { type: String, required: true },
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Vendor", vendorSchema);
