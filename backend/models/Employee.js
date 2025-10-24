// const mongoose = require('mongoose');

// const employeeSchema = new mongoose.Schema({
//   company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // link to Company

//   firstName: String,
//   lastName: String,
//   employeeCode: String,
//   employeeLevel: String,

//   managerName: String,
//   managerEmail: String,
//   email: { type: String, unique: true },
//   phoneNumber: String,
//   whatsappNumber: String,

//   gender: String,
//   maritalStatus: String,
//   dateOfBirth: Date,
//   dateOfJoining: Date,
//   anniversaryDate: Date,

//   primaryAddress: String,
//   secondaryAddress: String,
//   pincode: String,
//   city: String,
//   state: String,
//   country: String,

//   // Spouse (optional if married)
//   spouseFirstName: String,
//   spouseLastName: String,
//   spouseDob: Date,
//   spouseEmail: String,
//   spousePhone: String,

//   // Child details
//   child1Name: String,
//   child1Gender: String,
//   child1Dob: Date,

//   child2Name: String,
//   child2Gender: String,
//   child2Dob: Date,

//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Employee', employeeSchema);

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },

  firstName: String,
  lastName: String,
  employeeCode: { type: String, unique: true }, // will be auto-generated
  employeeLevel: String,

  managerName: String,
  managerEmail: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  whatsappNumber: String,

  gender: String,
  maritalStatus: String,
  dateOfBirth: Date,
  dateOfJoining: Date,
  anniversaryDate: Date,

  primaryAddress: String,
  secondaryAddress: String,
  pincode: String,
  city: String,
  state: String,
  country: String,

  spouseFirstName: String,
  spouseLastName: String,
  spouseDob: Date,
  spouseEmail: String,
  spousePhone: String,

  child1Name: String,
  child1Gender: String,
  child1Dob: Date,

  child2Name: String,
  child2Gender: String,
  child2Dob: Date,

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Employee", employeeSchema);
