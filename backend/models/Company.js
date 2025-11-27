// const mongoose = require('mongoose');

// const companySchema = new mongoose.Schema({
//   country: { type: String, required: true },
//   customerName: { type: String, required: true },
//   companyType: { type: String, required: true },
//   industry: { type: String, required: true },
//   gstrNumber: { type: String, required: true },
//   isActive: { type: Boolean, default: true },

//   address: {
//     street1: { type: String, required: true },
//     street2: { type: String },
//     city: { type: String, required: true },
//     state: { type: String, required: true },
//     postalCode: { type: String, required: true }
//   },

//   pointOfContact: {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     phone: { type: String, required: true },
//     roleInApp: { type: String, required: true },
//     designation: { type: String, required: true },
//     customerId: { type: String, required: true },
//   }
// });

// module.exports = mongoose.model('Company', companySchema);

const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  country: { type: String, required: true },
  customerName: { type: String, required: true },
  companyType: { type: String, required: true },
  industry: { type: String, required: true },
  gstrNumber: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  question: { type: String, required: false },  

  address: {
    street1: { type: String, required: true },
    street2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
  },

  pointOfContact: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    roleInApp: { type: String, required: true },
    designation: { type: String, required: true },
    customerId: { type: String, unique: true }, // 🔹 will be auto-generated
  },
});

// 🔹 Pre-save hook to auto-generate customerId
companySchema.pre("save", async function (next) {
  if (this.pointOfContact.customerId) return next(); // already set

  try {
    // find the last saved company (sorted by _id descending)
    const lastCompany = await mongoose
      .model("Company")
      .findOne()
      .sort({ _id: -1 })
      .lean();

    let nextCode = "CUST001";
    if (lastCompany?.pointOfContact?.customerId) {
      const lastNum = parseInt(
        lastCompany.pointOfContact.customerId.replace("CUST", ""),
        10
      );
      const nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
      nextCode = `CUST${String(nextNum).padStart(3, "0")}`;
    }

    this.pointOfContact.customerId = nextCode;
    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Company", companySchema);
