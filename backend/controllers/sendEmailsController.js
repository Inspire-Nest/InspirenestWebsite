// const UpcomingEvent = require("../models/UpcomingEvent");
// const nodemailer = require("nodemailer");
// require("dotenv").config();
// const path = require("path");

// exports.sendUpcomingEventEmails = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     // ✅ Fetch events where emailStatus is pending
//     const events = await UpcomingEvent.find({
//       emailStatus: "pending",
//       email: { $ne: null },
//       eventDate: { $gte: today, $lte: tomorrow },
//     });

//     if (!events.length) {
//       return res.json({ message: "No pending events with email found." });
//     }

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     for (let event of events) {
//       const eventDate = new Date(event.eventDate);
//       const dd = String(eventDate.getDate()).padStart(2, "0");
//       const mm = String(eventDate.getMonth() + 1).padStart(2, "0");
//       const yyyy = eventDate.getFullYear();
//       const prefix = event.eventType === "Birthday" ? "BDY" : "ANN";
//       const formattedCode = `${prefix}-${dd}${mm}${yyyy}`;

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
//             filename: path.basename(event.templateImage),
//             path: path.join(__dirname, "..", event.templateImage),
//             cid: "eventImage"
//           }
//         ]
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//         console.log(`Email sent to ${event.email} for ${event.eventType}`);

//         // ✅ Update only emailStatus to 'sent'
//         event.emailStatus = "sent";
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

// Convert any UTC date → IST
function toIST(date) {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
}

// exports.sendUpcomingEventEmails = async (req, res) => {
//   try {
//     // ⭐ Today in IST (set to 00:00)
//     const todayIST = toIST(new Date());
//     todayIST.setHours(0, 0, 0, 0);

//     // ⭐ Tomorrow in IST (00:00)
//     const tomorrowIST = new Date(todayIST);
//     tomorrowIST.setDate(todayIST.getDate() + 1);

//     console.log("🔵 IST Today:", todayIST);
//     console.log("🟢 IST Tomorrow:", tomorrowIST);

//     // Fetch pending events (do NOT filter date here)
//     const events = await UpcomingEvent.find({
//       emailStatus: "pending",
//       email: { $ne: null },
//     });

//     // 🔥 Filter events in IST date range
//     const todayEvents = events.filter((event) => {
//       let eventIST = toIST(new Date(event.eventDate));
//       eventIST.setHours(0, 0, 0, 0);

//       return eventIST.getTime() === todayIST.getTime();
//     });

//     console.log(`Found ${todayEvents.length} events for today (IST)`);

//     if (todayEvents.length === 0) {
//       return res.json({ message: "No events found for today (IST)" });
//     }

//     // Email setup
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     for (let event of todayEvents) {
//       const eventDate = new Date(event.eventDate);
//       const dd = String(eventDate.getDate()).padStart(2, "0");
//       const mm = String(eventDate.getMonth() + 1).padStart(2, "0");
//       const yyyy = eventDate.getFullYear();
//       const prefix = event.eventType === "Birthday" ? "BDY" : "ANN";

//       const formattedCode = `${prefix}-${dd}${mm}${yyyy}`;

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
//             filename: path.basename(event.templateImage),
//             path: path.join(__dirname, "..", event.templateImage),
//             cid: "eventImage",
//           },
//         ],
//       };

//       try {
//         await transporter.sendMail(mailOptions);
//         console.log(`📧 Email sent to: ${event.email}`);

//         event.emailStatus = "sent";
//         await event.save();
//       } catch (err) {
//         console.error(`❌ Error sending email to ${event.email}:`, err.message);
//       }
//     }

//     res.json({
//       message: "Event emails sent successfully (IST)",
//       total: todayEvents.length,
//     });
//   } catch (err) {
//     console.error("❌ Error:", err);
//     res.status(500).json({ error: "Failed to send event emails" });
//   }
// };

exports.sendUpcomingEventEmails = async (req, res) => {
  try {
    const nowIST = toIST(new Date());

    // 🔵 Today 00:00 IST
    const todayIST = new Date(nowIST);
    todayIST.setHours(0, 0, 0, 0);

    // Fetch all events with pending email
    const events = await UpcomingEvent.find({
      emailStatus: "pending",
      email: { $ne: null },
    });

    const todayEvents = events.filter((event) => {
      let eventIST = toIST(new Date(event.eventDate));
      eventIST.setHours(0, 0, 0, 0);
      return eventIST.getTime() === todayIST.getTime();
    });

    if (todayEvents.length === 0) {
      return res.json({ message: "No events found for today (IST)" });
    }

    // Email transport setup
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (let event of todayEvents) {
      // ⭐ Determine which template to send
      let templateToSend = event.templateImage;

      if (event.editedTemplateImage && event.editedAt) {
        const editedIST = toIST(new Date(event.editedAt));
        const editedHour = editedIST.getHours();

        console.log("Edited At (IST):", editedIST);

        // ⭐ if edited before 9AM → use edited image
        if (editedHour < 9) {
          templateToSend = event.editedTemplateImage;
          console.log("➡ Sending EDITED template for:", event.employeeName);
        } else {
          console.log("➡ Edited after 9AM — sending original template");
        }
      }

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: event.email,
        subject: `Happy ${event.eventType}!`,
        html: `
          <p>Hi ${event.employeeName},</p>
          <p>Wishing you a very Happy ${event.eventType}!</p>
          <img src="cid:eventImage" style="width:300px;" />
        `,
        attachments: [
          {
            filename: path.basename(templateToSend),
            path: path.join(__dirname, "..", templateToSend),
            cid: "eventImage",
          },
        ],
      };

      try {
        await transporter.sendMail(mailOptions);
        event.emailStatus = "sent";
        await event.save();
      } catch (error) {
        console.error("Mail error:", error);
      }
    }

    res.json({
      message: "Emails sent successfully",
      total: todayEvents.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send event emails" });
  }
};

exports.uploadEditedTemplate = async (req, res) => {
  try {
    const eventId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const updatedEvent = await UpcomingEvent.findByIdAndUpdate(
      eventId,
      {
        editedTemplateImage: req.file.path,
        editedAt: new Date(),
      },
      { new: true }
    );

    res.json({
      message: "Edited template uploaded successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload edited template" });
  }
};
