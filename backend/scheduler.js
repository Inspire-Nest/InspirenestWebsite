const cron = require("node-cron");
const Employee = require("./models/Employee");

// Run every day at 12:01 AM
cron.schedule("1 0 * * *", async () => {
  console.log("Running daily event fetch job...");

  const today = new Date();
  const next7 = new Date();
  next7.setDate(today.getDate() + 7);

  const employees = await Employee.find();

  const upcomingEvents = [];

  employees.forEach((emp) => {
    const events = [];

    // 🎂 Birthday
    if (emp.dateOfBirth) {
      const dob = new Date(emp.dateOfBirth);
      const thisYearDob = new Date(
        today.getFullYear(),
        dob.getMonth(),
        dob.getDate()
      );
      if (thisYearDob >= today && thisYearDob <= next7) {
        events.push({ occasion: "Birthday", eventDate: thisYearDob });
      }
    }

    // 🎉 Work Anniversary
    if (emp.dateOfJoining) {
      const doj = new Date(emp.dateOfJoining);
      const workAnniv = new Date(
        today.getFullYear(),
        doj.getMonth(),
        doj.getDate()
      );
      if (workAnniv >= today && workAnniv <= next7) {
        events.push({ occasion: "Work Anniversary", eventDate: workAnniv });
      }
    }

    // 💍 Wedding Anniversary
    if (emp.anniversaryDate) {
      const anniv = new Date(emp.anniversaryDate);
      const weddingAnniv = new Date(
        today.getFullYear(),
        anniv.getMonth(),
        anniv.getDate()
      );
      if (weddingAnniv >= today && weddingAnniv <= next7) {
        events.push({
          occasion: "Wedding Anniversary",
          eventDate: weddingAnniv,
        });
      }
    }

    // Push all matched events
    events.forEach((e) => {
      upcomingEvents.push({
        eventDate: e.eventDate.toISOString().split("T")[0],
        occasion: e.occasion,
        nameOfEmployee: `${emp.firstName} ${emp.lastName}`,
        companyName: emp.company, // populate with company later
        relation: "Employee", // for now fixed
      });
    });
  });

  console.log("Upcoming Events (next 7 days):", upcomingEvents);
  // 👉 You can store them in DB or expose via API
});
