const xlsx = require("xlsx");
const CalendarEvent = require("../models/calendarEvent");
const moment = require("moment");

// Helper function to format event dates
function formatEventDate(dateStr) {
  if (!dateStr) return "";

  const currentYear = new Date().getFullYear();

  // Try common date formats directly
  let parsedDate = moment(
    dateStr,
    [
      "MMMM D", // January 1
      "MMMM D, YYYY", // January 1, 2025
      "DD/MM/YYYY", // 22/03/2025
      "D MMMM YYYY", // 1 January 2025
      "MMM-DD", // Apr-28, Sep-05
      "MMMM DD", // March 08
    ],
    true
  );

  if (parsedDate.isValid()) {
    // Add year if missing
    if (!dateStr.includes(currentYear) && parsedDate.year() === 2001) {
      parsedDate.year(currentYear);
    }
    return parsedDate.format("DD-MM-YYYY");
  }

  // Handle relative cases
  if (/Last Friday of/i.test(dateStr)) {
    const month = dateStr.split(" ")[3];
    let lastFriday = moment()
      .year(currentYear)
      .month(month)
      .endOf("month")
      .day("Friday");
    if (lastFriday.month() !== moment().month(month).month()) {
      lastFriday.subtract(7, "days");
    }
    return lastFriday.format("DD-MM-YYYY");
  }

  if (/First Friday of/i.test(dateStr)) {
    const month = dateStr.split(" ")[3];
    let firstFriday = moment()
      .year(currentYear)
      .month(month)
      .startOf("month")
      .day("Friday");
    if (firstFriday.date() > 7) {
      firstFriday.add(7, "days");
    }
    return firstFriday.format("DD-MM-YYYY");
  }

  // Handle "whole month" or "varies"
  if (/whole month/i.test(dateStr)) {
    const month = dateStr.split(" ")[0];
    return `01-${moment()
      .month(month)
      .format("MM")}-${currentYear} (whole month)`;
  }

  if (/varies/i.test(dateStr)) {
    const month = dateStr.split(" ")[0];
    return `01-${moment().month(month).format("MM")}-${currentYear} (varies)`;
  }

  // Handle "first week"
  if (/first week/i.test(dateStr)) {
    const month = dateStr.split(" ")[0];
    return `01-${moment()
      .month(month)
      .format("MM")}-${currentYear} (first week)`;
  }

  // Handle standalone month like "November"
  if (
    /^(January|February|March|April|May|June|July|August|September|October|November|December)$/i.test(
      dateStr
    )
  ) {
    return `01-${moment().month(dateStr).format("MM")}-${currentYear} (month)`;
  }

  return dateStr; // fallback if unrecognized
}

// ✅ Upload Excel and Save
// exports.uploadEvents = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const workbook = xlsx.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
//       defval: "",
//     });

//     const formattedData = sheetData
//       .filter((row) => row.__EMPTY_1 && row.__EMPTY_1 !== "Event Name")
//       .map((row) => ({
//         eventDate: formatEventDate(row.__EMPTY || ""),
//         eventName: row.__EMPTY_1 || "",
//         scope: row.__EMPTY_2 || "",
//         category: row.__EMPTY_3 || "",
//         suggestedActivities: row.__EMPTY_4 || "",
//       }));

//     await CalendarEvent.insertMany(formattedData);

//     res.status(201).json({
//       message: "Excel uploaded and data saved successfully",
//       count: formattedData.length,
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: "Error uploading calendar events",
//       error: err.message,
//     });
//   }
// };

exports.uploadEvents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
      defval: "",
    });

    const formattedData = [];

    for (let i = 0; i < sheetData.length; i++) {
      const row = sheetData[i];

      const eventDate = row["Event Date"]?.toString().trim();
      const eventName = row["Event Name"] || "";
      const scope = row["Scope"] || "";
      const category = row["Category"] || "";
      const suggestedActivities = row["Suggested Activities"] || "";

      // ❌ Validate format: must be DD-MM-YYYY
      if (!moment(eventDate, "DD-MM-YYYY", true).isValid()) {
        return res.status(400).json({
          message: `Invalid date format in row ${
            i + 2
          }. Expected DD-MM-YYYY but got "${eventDate}".`,
        });
      }

      formattedData.push({
        eventDate,
        eventName,
        scope,
        category,
        suggestedActivities,
      });
    }

    // Save to DB
    await CalendarEvent.insertMany(formattedData);

    res.status(201).json({
      message: "Excel uploaded and data saved successfully",
      count: formattedData.length,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error uploading calendar events",
      error: err.message,
    });
  }
};

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find();
    res.json(events);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching events", error: error.message });
  }
};

// Get single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await CalendarEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching event", error: error.message });
  }
};

// Update event by ID
// exports.updateEvent = async (req, res) => {
//   try {
//     const event = await CalendarEvent.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//       }
//     );
//     if (!event) return res.status(404).json({ message: "Event not found" });
//     res.json({ message: "Event updated successfully", event });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating event", error: error.message });
//   }
// };

// Example: Update event API
exports.updateEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findByIdAndUpdate(
      req.params.id,
      {
        eventDate: req.body.eventDate,
        eventName: req.body.eventName,
        scope: req.body.scope,
        category: req.body.category,
        suggestedActivities: req.body.suggestedActivities,
        giftProposal: req.body.giftProposal, // save from UI
        budget: req.body.budget, // save from UI
      },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating event", error: error.message });
  }
};

// Delete event by ID
exports.deleteEvent = async (req, res) => {
  try {
    const event = await CalendarEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting event", error: error.message });
  }
};

exports.getAllCalendarEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find(); // Fetch all documents
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Save selected events with gift proposal and budget
exports.saveSelectedEvents = async (req, res) => {
  try {
    const updates = req.body; // array of { eventId, giftProposal, budget }

    const promises = updates.map((item) =>
      CalendarEvent.findByIdAndUpdate(item.eventId, {
        giftProposal: item.giftProposal,
        budget: item.budget,
      })
    );

    await Promise.all(promises);

    res.json({ message: "Selected events updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to save events", error: err.message });
  }
};
