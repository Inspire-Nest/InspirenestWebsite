// const mongoose = require("mongoose");

// const employeeSchema = new mongoose.Schema({
//   company: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Company",
//     required: true,
//   },

//   firstName: String,
//   lastName: String,
//   employeeCode: { type: String, unique: true }, // will be auto-generated
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

//   spouseFirstName: String,
//   spouseLastName: String,
//   spouseDob: Date,
//   spouseEmail: String,
//   spousePhone: String,

//   child1Name: String,
//   child1Gender: String,
//   child1Dob: Date,

//   child2Name: String,
//   child2Gender: String,
//   child2Dob: Date,

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Employee", employeeSchema);

const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },

  firstName: {
    type: String,
    required: [true, "First name is required"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
    trim: true,
  },
  employeeCode: {
    type: String,
    unique: true, // auto-generated
  },
  employeeLevel: {
    type: String,
    required: [true, "Employee level is required"],
  },
  // ⭐ Store edible gifts with ID + Description
  edibleGifts: [
    {
      id: String,
      eat_id: String,
      description: String,
    }
  ],

  // ⭐ Store custom gifts with ID + Description
  customGifts: [
    {
      id: String,
      custom_id: String,
      description: String,
    }
  ],
  managerName: String,
  managerEmail: String,

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
  },
  whatsappNumber: {
    type: String,
    required: [true, "WhatsApp number is required"],
  },

  gender: {
    type: String,
    required: [true, "Gender is required"],
  },
  maritalStatus: {
    type: String,
    required: [true, "Marital status is required"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
  },
  dateOfJoining: {
    type: Date,
    required: [true, "Date of joining is required"],
  },

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
