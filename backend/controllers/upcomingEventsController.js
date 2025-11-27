// const Employee = require("../models/Employee");
// const UpcomingEvent = require("../models/UpcomingEvent");
// const path = require("path");

// // Save Event Helper
// async function saveUpcomingEvent(employee, eventType, eventDate, templateFileName) {
//   const templatePath = path.join("uploads", "templates", templateFileName);

//   // Avoid duplicates
//   const exists = await UpcomingEvent.findOne({ employee: employee._id, eventType, eventDate });
//   if (exists) return;

//   const event = new UpcomingEvent({
//     employee: employee._id,
//     eventType,
//     eventDate,
//     templateImage: templatePath,
//     email: employee.email,
//     whatsappNumber: employee.whatsappNumber
//   });

//   await event.save();
// }

// // Main Function
// exports.checkUpcomingEvents = async (req, res) => {
//   try {
//     const today = new Date();
//     const oneWeekLater = new Date();
//     oneWeekLater.setDate(today.getDate() + 7);

//     const employees = await Employee.find();

//     for (let emp of employees) {
//       // 🎂 Birthday
//       if (emp.dateOfBirth) {
//         const birthdayThisYear = new Date(today.getFullYear(), emp.dateOfBirth.getMonth(), emp.dateOfBirth.getDate());
//         if (birthdayThisYear >= today && birthdayThisYear <= oneWeekLater) {
//           await saveUpcomingEvent(emp, "Birthday", birthdayThisYear, "birthday.jpg");
//         }
//       }

//       // 💼 Work Anniversary
//       if (emp.dateOfJoining) {
//         const workAnniversary = new Date(today.getFullYear(), emp.dateOfJoining.getMonth(), emp.dateOfJoining.getDate());
//         if (workAnniversary >= today && workAnniversary <= oneWeekLater) {
//           await saveUpcomingEvent(emp, "Work Anniversary", workAnniversary, "work_anniversary.jpg");
//         }
//       }

//       // 💍 Wedding Anniversary
//       if (emp.anniversaryDate) {
//         const weddingAnniversary = new Date(today.getFullYear(), emp.anniversaryDate.getMonth(), emp.anniversaryDate.getDate());
//         if (weddingAnniversary >= today && weddingAnniversary <= oneWeekLater) {
//           await saveUpcomingEvent(emp, "Wedding Anniversary", weddingAnniversary, "wedding.jpg");
//         }
//       }
//     }

//     res.json({ message: "Upcoming events checked and stored successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to check events" });
//   }
// };
// const Employee = require("../models/Employee");
// const UpcomingEvent = require("../models/UpcomingEvent");
// const Template = require("../models/Template");
// const path = require("path");

// // Save Event Helper
// async function saveUpcomingEvent(employee, personName, relation, companyName, eventType, eventDate, template, email, whatsappNumber) {
//   if (!template) return; // skip if template not found

//   // Avoid duplicates
//   const exists = await UpcomingEvent.findOne({
//     employee: employee._id,
//     relation,
//     eventType,
//     eventDate
//   });
//   if (exists) return;

//   const event = new UpcomingEvent({
//     employee: employee._id,
//     employeeName: personName,
//     relation,
//     companyName,
//     eventType,
//     eventDate,
//     templateImage: template.image, // path from DB
//     templateName: template.name,   // template name
//     email,
//     whatsappNumber
//   });

//   await event.save();
// }

// // Main Function
// exports.checkUpcomingEvents = async (req, res) => {
//   try {
//     const today = new Date();
//     const oneWeekLater = new Date();
//     oneWeekLater.setDate(today.getDate() + 7);

//     // Fetch all employees with company info
//     const employees = await Employee.find().populate("company");

//     // Fetch all templates
//     const templates = await Template.find();

//     for (let emp of employees) {
//       const companyName = emp.company?.name || "Unknown";

//       // Helper to get template by name
//       const getTemplate = (name) => templates.find(t => t.name === name);

//       // 🎂 Employee Birthday
//       if (emp.dateOfBirth) {
//         const dobThisYear = new Date(today.getFullYear(), emp.dateOfBirth.getMonth(), emp.dateOfBirth.getDate());
//         if (dobThisYear >= today && dobThisYear <= oneWeekLater) {
//           await saveUpcomingEvent(emp, `${emp.firstName} ${emp.lastName}`, "employee", companyName, "Birthday", dobThisYear, getTemplate("Birthday"), emp.email, emp.whatsappNumber);
//         }
//       }

//       // 💼 Work Anniversary
//       if (emp.dateOfJoining) {
//         const dojThisYear = new Date(today.getFullYear(), emp.dateOfJoining.getMonth(), emp.dateOfJoining.getDate());
//         if (dojThisYear >= today && dojThisYear <= oneWeekLater) {
//           await saveUpcomingEvent(emp, `${emp.firstName} ${emp.lastName}`, "employee", companyName, "Work Anniversary", dojThisYear, getTemplate("Work Anniversary"), emp.email, emp.whatsappNumber);
//         }
//       }

//       // 💍 Wedding Anniversary
//       if (emp.anniversaryDate) {
//         const wedThisYear = new Date(today.getFullYear(), emp.anniversaryDate.getMonth(), emp.anniversaryDate.getDate());
//         if (wedThisYear >= today && wedThisYear <= oneWeekLater) {
//           await saveUpcomingEvent(emp, `${emp.firstName} ${emp.lastName}`, "employee", companyName, "Wedding Anniversary", wedThisYear, getTemplate("Wedding Anniversary"), emp.email, emp.whatsappNumber);
//         }
//       }

//       // 💖 Spouse Birthday
//       if (emp.spouseDob) {
//         const spouseDobThisYear = new Date(today.getFullYear(), emp.spouseDob.getMonth(), emp.spouseDob.getDate());
//         if (spouseDobThisYear >= today && spouseDobThisYear <= oneWeekLater) {
//           await saveUpcomingEvent(emp, `${emp.spouseFirstName} ${emp.spouseLastName}`, "spouse", companyName, "Birthday", spouseDobThisYear, getTemplate("Birthday"), emp.spouseEmail, emp.spousePhone);
//         }
//       }

//       // 👶 Children Birthdays
//       if (emp.child1Dob) {
//         const child1DobThisYear = new Date(today.getFullYear(), emp.child1Dob.getMonth(), emp.child1Dob.getDate());
//         if (child1DobThisYear >= today && child1DobThisYear <= oneWeekLater) {
//           await saveUpcomingEvent(emp, emp.child1Name, "child", companyName, "Birthday", child1DobThisYear, getTemplate("Birthday"), null, null);
//         }
//       }

//       if (emp.child2Dob) {
//         const child2DobThisYear = new Date(today.getFullYear(), emp.child2Dob.getMonth(), emp.child2Dob.getDate());
//         if (child2DobThisYear >= today && child2DobThisYear <= oneWeekLater) {
//           await saveUpcomingEvent(emp, emp.child2Name, "child", companyName, "Birthday", child2DobThisYear, getTemplate("Birthday"), null, null);
//         }
//       }
//     }

//     res.json({ message: "Upcoming events including spouse & children stored successfully!" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to check events" });
//   }
// };
const Employee = require("../models/Employee");
const UpcomingEvent = require("../models/UpcomingEvent");
const Template = require("../models/Template");
const SubscriptionPreference = require("../models/SubscriptionPreference");
const GiftPreference = require("../models/GiftPreference");

// ✅ Helper to normalize event types
function normalizeEventType(eventType) {
  switch (eventType) {
    case "Birthday":
      return "birthday";
    case "Work Anniversary":
      return "work_anniversary";
    case "Wedding Anniversary":
      return "wedding_anniversary";
    default:
      return "";
  }
}

// ✅ Helper to normalize a date (set hours to 0 to avoid timezone issues)
function normalizeDate(dateObj) {
  const d = new Date(dateObj);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ✅ Helper to check if a date is within next X days
function isDateWithinNextDays(dateObj, days) {
  const today = normalizeDate(new Date());
  const target = normalizeDate(
    new Date(new Date().getFullYear(), dateObj.getMonth(), dateObj.getDate())
  );
  const diff = (target - today) / (1000 * 60 * 60 * 24); // difference in days
  return diff >= 0 && diff <= days;
}

// ✅ Save event helper
// async function saveUpcomingEvent(
//   employee,
//   personName,
//   relation,
//   company,
//   eventType,
//   eventDate,
//   template
// ) {
//   if (!template) return;

//   // 🔹 Company subscription check
//   const subscription = await SubscriptionPreference.findOne({ company: company._id });
//   if (!subscription) return;

//   const eventEnabled =
//     (eventType === "Birthday" && subscription.birthday) ||
//     (eventType === "Work Anniversary" && subscription.work_anniversary) ||
//     (eventType === "Wedding Anniversary" && subscription.wedding_anniversary);

//   if (!eventEnabled) return;

//   // ✅ Normalize types
//   const normalizedType = normalizeEventType(eventType);
//   const normalizedRelation = relation ? relation.toLowerCase() : "";

//   // ✅ Fix — find gift preferences using normalized occasionType
//   const giftPref = await GiftPreference.findOne({
//     occasionType: normalizedType,
//     personType: { $regex: new RegExp(normalizedRelation, "i") },
//   });

//   if (!giftPref) return;

//   // 🔹 Prevent duplicates
//   const exists = await UpcomingEvent.findOne({
//     employee: employee._id,
//     relation: normalizedRelation,
//     eventType,
//     eventDate: normalizeDate(eventDate),
//   });
//   if (exists) return;

//   // 🔹 Save event
//   const event = new UpcomingEvent({
//     employee: employee._id,
//     employeeName: personName,
//     relation: normalizedRelation,
//     companyName: company.customerName || "Unknown",
//     eventType,
//     eventDate: normalizeDate(eventDate),
//     templateImage: template.image,
//     email: giftPref.email ? employee.email : null,
//     whatsappNumber: giftPref.whatsapp ? employee.whatsappNumber : null,
//   });

//   await event.save();
// }
// ✅ Updated dynamic saveUpcomingEvent
// ✅ Updated dynamic saveUpcomingEvent (handles all relations automatically)
async function saveUpcomingEvent(employee, personName, relation, company, eventType, eventDate, template) {
  if (!template) return;

  // 🔹 Normalize relation for consistent matching
  const normalizedRelation = (relation || "employee").toLowerCase();

  // 🔹 Try finding the most relevant subscription dynamically
  let subscription = await SubscriptionPreference.findOne({
    company: company._id,
    personType: { $regex: new RegExp(normalizedRelation, "i") },
  });

  // 🔹 Fallback: if no exact match, try for generic terms
  if (!subscription) {
    if (normalizedRelation.includes("child") || normalizedRelation.includes("kid")) {
      subscription = await SubscriptionPreference.findOne({
        company: company._id,
        personType: { $regex: /child|kid/i },
      });
    } else if (normalizedRelation.includes("spouse") || normalizedRelation.includes("wife") || normalizedRelation.includes("husband")) {
      subscription = await SubscriptionPreference.findOne({
        company: company._id,
        personType: { $regex: /spouse|wife|husband/i },
      });
    } else {
      subscription = await SubscriptionPreference.findOne({
        company: company._id,
        personType: { $regex: /employee/i },
      });
    }
  }

  // 🚫 If still not found, skip
  if (!subscription) return;

  // ✅ Check if event type is enabled for that person type
  const eventEnabled =
    (eventType === "Birthday" && subscription.birthday) ||
    (eventType === "Work Anniversary" && subscription.work_anniversary) ||
    (eventType === "Wedding Anniversary" && subscription.wedding_anniversary);

  if (!eventEnabled) return;

  const normalizedType = normalizeEventType(eventType);

  // 🎁 Fetch matching gift preference dynamically
  const giftPref = await GiftPreference.findOne({
    occasionType: normalizedType,
    personType: { $regex: new RegExp(normalizedRelation, "i") },
  });

  // ⚙️ If not found, fallback to generic type (e.g., “Employee” gift)
  if (!giftPref) {
    await GiftPreference.findOne({
      occasionType: normalizedType,
      personType: { $regex: /employee/i },
    });
  }

  // 🔹 Prevent duplicate events
  const exists = await UpcomingEvent.findOne({
    employee: employee._id,
    relation: normalizedRelation,
    eventType,
    eventDate: normalizeDate(eventDate),
  });
  if (exists) return;

  // ✅ Save event
  const event = new UpcomingEvent({
    employee: employee._id,
    employeeName: personName,
    relation: normalizedRelation,
    companyName: company.customerName || "Unknown",
    eventType,
    eventDate: normalizeDate(eventDate),
    templateImage: template.image,
    email: giftPref?.email ? employee.email : null,
    whatsappNumber: giftPref?.whatsapp ? employee.whatsappNumber : null,
    emailStatus: giftPref?.email ? "pending" : null,
    whatsappStatus: giftPref?.whatsapp ? "pending" : null,
  });

  await event.save();
}

// ✅ Rotate templates for each event type
function getTemplateByType(templates, eventType, index) {
  const filtered = templates.filter((t) => t.eventType === eventType);
  if (filtered.length === 0) return null;
  return filtered[index % filtered.length];
}

// ✅ Main API — check upcoming events
// exports.checkUpcomingEvents = async (req, res) => {
//   try {
//     const employees = await Employee.find().populate("company");
//     const templates = await Template.find();
//     const counters = { Birthday: 0, "Work Anniversary": 0, "Wedding Anniversary": 0 };

//     for (const emp of employees) {
//       const company = emp.company;
//       if (!company) continue;

//       // 🎂 Employee Birthday
//       if (emp.dateOfBirth && isDateWithinNextDays(emp.dateOfBirth, 7)) {
//         const dobThisYear = new Date(
//           new Date().getFullYear(),
//           emp.dateOfBirth.getMonth(),
//           emp.dateOfBirth.getDate()
//         );
//         const template = getTemplateByType(templates, "Birthday", counters.Birthday++);
//         await saveUpcomingEvent(
//           emp,
//           `${emp.firstName} ${emp.lastName}`,
//           "employee",
//           company,
//           "Birthday",
//           dobThisYear,
//           template
//         );
//       }

//       // 💼 Work Anniversary
//       if (emp.dateOfJoining && isDateWithinNextDays(emp.dateOfJoining, 7)) {
//         const dojThisYear = new Date(
//           new Date().getFullYear(),
//           emp.dateOfJoining.getMonth(),
//           emp.dateOfJoining.getDate()
//         );
//         const template = getTemplateByType(
//           templates,
//           "Work Anniversary",
//           counters["Work Anniversary"]++
//         );
//         await saveUpcomingEvent(
//           emp,
//           `${emp.firstName} ${emp.lastName}`,
//           "employee",
//           company,
//           "Work Anniversary",
//           dojThisYear,
//           template
//         );
//       }

//       // 💍 Wedding Anniversary
//       if (emp.anniversaryDate && isDateWithinNextDays(emp.anniversaryDate, 7)) {
//         const wedThisYear = new Date(
//           new Date().getFullYear(),
//           emp.anniversaryDate.getMonth(),
//           emp.anniversaryDate.getDate()
//         );
//         const template = getTemplateByType(
//           templates,
//           "Wedding Anniversary",
//           counters["Wedding Anniversary"]++
//         );
//         await saveUpcomingEvent(
//           emp,
//           `${emp.firstName} ${emp.lastName}`,
//           "spouse",
//           company,
//           "Wedding Anniversary",
//           wedThisYear,
//           template
//         );
//       }

//       // 👩‍❤️‍👨 Spouse Birthday
//       if (emp.spouseDob && isDateWithinNextDays(emp.spouseDob, 7)) {
//         const spouseDobThisYear = new Date(
//           new Date().getFullYear(),
//           emp.spouseDob.getMonth(),
//           emp.spouseDob.getDate()
//         );
//         const template = getTemplateByType(templates, "Birthday", counters.Birthday++);
//         await saveUpcomingEvent(
//           emp,
//           emp.spouseName || "Spouse",
//           "spouse",
//           company,
//           "Birthday",
//           spouseDobThisYear,
//           template
//         );
//       }

//       // 👶 Child1 Birthday
//       if (emp.child1Dob && isDateWithinNextDays(emp.child1Dob, 7)) {
//         const c1DobThisYear = new Date(
//           new Date().getFullYear(),
//           emp.child1Dob.getMonth(),
//           emp.child1Dob.getDate()
//         );
//         const template = getTemplateByType(templates, "Birthday", counters.Birthday++);
//         await saveUpcomingEvent(
//           emp,
//           emp.child1Name || "Kid - 1",
//           "child",
//           company,
//           "Birthday",
//           c1DobThisYear,
//           template
//         );
//       }

//       // 👧 Child2 Birthday
//       if (emp.child2Dob && isDateWithinNextDays(emp.child2Dob, 7)) {
//         const c2DobThisYear = new Date(
//           new Date().getFullYear(),
//           emp.child2Dob.getMonth(),
//           emp.child2Dob.getDate()
//         );
//         const template = getTemplateByType(templates, "Birthday", counters.Birthday++);
//         await saveUpcomingEvent(
//           emp,
//           emp.child2Name || "Kid - 2",
//           "child",
//           company,
//           "Birthday",
//           c2DobThisYear,
//           template
//         );
//       }
//     }

//     res.json({
//       message: "✅ Upcoming events stored successfully based on subscriptions & gift preferences!",
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "❌ Failed to check upcoming events" });
//   }
// };
// ✅ Main API — check upcoming events
exports.checkUpcomingEvents = async (req, res) => {
  try {
    const employees = await Employee.find().populate("company");
    const templates = await Template.find();
    const counters = { Birthday: 0, "Work Anniversary": 0, "Wedding Anniversary": 0 };

    for (const emp of employees) {
      const company = emp.company;
      if (!company) continue;

      // 🎂 Employee Birthday
      if (emp.dateOfBirth && isDateWithinNextDays(emp.dateOfBirth, 7)) {
        const dobThisYear = new Date(new Date().getFullYear(), emp.dateOfBirth.getMonth(), emp.dateOfBirth.getDate());
        const template = getTemplateByType(templates, "Birthday", counters.Birthday++);
        await saveUpcomingEvent(emp, `${emp.firstName} ${emp.lastName}`, "employee", company, "Birthday", dobThisYear, template);
      }

      // 💼 Employee Work Anniversary
      if (emp.dateOfJoining && isDateWithinNextDays(emp.dateOfJoining, 7)) {
        const dojThisYear = new Date(new Date().getFullYear(), emp.dateOfJoining.getMonth(), emp.dateOfJoining.getDate());
        const template = getTemplateByType(templates, "Work Anniversary", counters["Work Anniversary"]++);
        await saveUpcomingEvent(emp, `${emp.firstName} ${emp.lastName}`, "employee", company, "Work Anniversary", dojThisYear, template);
      }

      // 💍 Employee Wedding Anniversary
      if (emp.anniversaryDate && isDateWithinNextDays(emp.anniversaryDate, 7)) {
        const wedThisYear = new Date(new Date().getFullYear(), emp.anniversaryDate.getMonth(), emp.anniversaryDate.getDate());
        const template = getTemplateByType(templates, "Wedding Anniversary", counters["Wedding Anniversary"]++);
        // ✅ relation changed from "spouse" → "employee"
        await saveUpcomingEvent(emp, `${emp.firstName} ${emp.lastName}`, "employee", company, "Wedding Anniversary", wedThisYear, template);
      }

      // 👩‍❤️‍👨 Spouse Birthday
      if (emp.spouseDob && isDateWithinNextDays(emp.spouseDob, 7)) {
        const spouseDobThisYear = new Date(new Date().getFullYear(), emp.spouseDob.getMonth(), emp.spouseDob.getDate());
        const template = getTemplateByType(templates, "Birthday", counters.Birthday++);
        await saveUpcomingEvent(emp, emp.spouseName || "Spouse", "spouse", company, "Birthday", spouseDobThisYear, template);
      }

      // 👶 Child 1 Birthday
      if (emp.child1Dob && isDateWithinNextDays(emp.child1Dob, 7)) {
        const c1DobThisYear = new Date(new Date().getFullYear(), emp.child1Dob.getMonth(), emp.child1Dob.getDate());
        const template = getTemplateByType(templates, "Birthday", counters.Birthday++);
        await saveUpcomingEvent(emp, emp.child1Name || "Kid - 1", "child", company, "Birthday", c1DobThisYear, template);
      }

      // 👧 Child 2 Birthday
      if (emp.child2Dob && isDateWithinNextDays(emp.child2Dob, 7)) {
        const c2DobThisYear = new Date(new Date().getFullYear(), emp.child2Dob.getMonth(), emp.child2Dob.getDate());
        const template = getTemplateByType(templates, "Birthday", counters.Birthday++);
        await saveUpcomingEvent(emp, emp.child2Name || "Kid - 2", "child", company, "Birthday", c2DobThisYear, template);
      }
    }

    res.json({ message: "✅ Upcoming events stored successfully based on subscriptions & gift preferences!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "❌ Failed to check upcoming events" });
  }
};

// GET all upcoming events
exports.getAllUpcomingEvents = async (req, res) => {
  try {
    const events = await UpcomingEvent.find()
      .sort({ eventDate: 1 }) // sort by nearest event date first
      .populate("employee", "firstName lastName email whatsappNumber");

    res.status(200).json({
      message: "Upcoming events fetched successfully",
      total: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};