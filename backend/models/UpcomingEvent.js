// const mongoose = require("mongoose");

// const upcomingEventSchema = new mongoose.Schema({
//   employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
//   employeeName: { type: String, required: true },
//   relation: { type: String, enum: ["employee", "spouse", "child"], required: true },
//   companyName: { type: String, required: true },

//   eventType: { 
//     type: String, 
//     enum: ["Birthday", "Work Anniversary", "Wedding Anniversary"], 
//     required: true 
//   },
//   eventDate: { type: Date, required: true },
//   templateImage: { type: String, required: true }, // path to template
//   email: { type: String }, // email of person
//   whatsappNumber: { type: String }, // whatsapp of person
//   status: { type: String, enum: ["pending", "sent"], default: "pending" },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("UpcomingEvent", upcomingEventSchema);
const mongoose = require("mongoose");

const upcomingEventSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  employeeName: { type: String, required: true },
  relation: { type: String, enum: ["employee", "spouse", "child"], required: true },
  companyName: { type: String, required: true },

  eventType: { 
    type: String, 
    enum: ["Birthday", "Work Anniversary", "Wedding Anniversary"], 
    required: true 
  },
  eventDate: { type: Date, required: true },
  templateImage: { type: String, required: true }, // path to template
  email: { type: String }, // email of person
  whatsappNumber: { type: String }, // whatsapp of person

  // ✅ Separate statuses
  emailStatus: { type: String, enum: ["pending", "sent"], default: "pending" },
  whatsappStatus: { type: String, enum: ["pending", "sent"], default: "pending" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("UpcomingEvent", upcomingEventSchema);
