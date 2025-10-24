// const UpcomingEvent = require("../models/UpcomingEvent");
// const nodemailer = require("nodemailer");
// require("dotenv").config();
// const path = require("path");

// exports.sendUpcomingEventEmails = async (req, res) => {
//   try {
//     // Fetch all pending events with email
//       const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     const events = await UpcomingEvent.find({
//       status: "pending",
//       email: { $ne: null },
//       eventDate: { $gte: today, $lte: tomorrow }, // <= instead of <
//             // eventDate: { $gte: today, $lt: tomorrow }, // only today

//     });

//     if (!events.length) {
//       return res.json({ message: "No pending events with email found." });
//     }

//     // Configure transporter
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     for (let event of events) {
//       // Format date as DDMMYYYY
//       const eventDate = new Date(event.eventDate);
//       const dd = String(eventDate.getDate()).padStart(2, "0");
//       const mm = String(eventDate.getMonth() + 1).padStart(2, "0");
//       const yyyy = eventDate.getFullYear();
//       const prefix = event.eventType === "Birthday" ? "BDY" : "ANN";
//       const formattedCode = `${prefix}-${dd}${mm}${yyyy}`;

//       // Prepare email
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: event.email,
//         subject: `Happy ${event.eventType}!`,
//         html: `
//           <p>Hi ${event.employeeName},</p>
//           <p>Wishing you a very Happy ${event.eventType}!</p>
//           <p>Your code: <b>${formattedCode}</b></p>
//           <img src="cid:eventImage" alt="${event.eventType}" style="width:300px;"/>
//         `,
//         attachments: [
//           {
//         filename: path.basename(event.templateImage),
//         path: path.join(__dirname, "..", event.templateImage), // use relative path from backend root
//         cid: "eventImage"
//       }
//         ]
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${event.email} for ${event.eventType}`);

//         // Update event status
//         event.status = "sent";
//         await event.save();
//       } catch (err) {
//         console.error(`Error sending email to ${event.email}:`, err.message);
//       }
//     }

//     res.json({ message: "Emails processed", total: events.length });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to send emails" });
//   }
// };
const UpcomingEvent = require("../models/UpcomingEvent");
const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");

exports.sendUpcomingEventEmails = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // ✅ Fetch events where emailStatus is pending
    const events = await UpcomingEvent.find({
      emailStatus: "pending",
      email: { $ne: null },
      eventDate: { $gte: today, $lte: tomorrow },
    });

    if (!events.length) {
      return res.json({ message: "No pending events with email found." });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (let event of events) {
      const eventDate = new Date(event.eventDate);
      const dd = String(eventDate.getDate()).padStart(2, "0");
      const mm = String(eventDate.getMonth() + 1).padStart(2, "0");
      const yyyy = eventDate.getFullYear();
      const prefix = event.eventType === "Birthday" ? "BDY" : "ANN";
      const formattedCode = `${prefix}-${dd}${mm}${yyyy}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: event.email,
        subject: `Happy ${event.eventType}!`,
        html: `
          <p>Hi ${event.employeeName},</p>
          <p>Wishing you a very Happy ${event.eventType}!</p>
          <p>Your code: <b>${formattedCode}</b></p>
          <img src="cid:eventImage" alt="${event.eventType}" style="width:300px;"/>
        `,
        attachments: [
          {
            filename: path.basename(event.templateImage),
            path: path.join(__dirname, "..", event.templateImage),
            cid: "eventImage"
          }
        ]
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${event.email} for ${event.eventType}`);

        // ✅ Update only emailStatus to 'sent'
        event.emailStatus = "sent";
        await event.save();
      } catch (err) {
        console.error(`Error sending email to ${event.email}:`, err.message);
      }
    }

    res.json({ message: "Emails processed", total: events.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send emails" });
  }
};
