const cron = require("node-cron");
const upcomingEventsController = require("../controllers/upcomingEventsController");
const { sendUpcomingEventEmails } = require("../controllers/sendEmailsController");

// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily cron job to check upcoming events...");
  await upcomingEventsController.checkUpcomingEvents(
    { }, // mock req
    { 
      json: (msg) => console.log("Cron job:", msg), 
      status: () => ({ json: (err) => console.error(err) }) 
    }
  );
});
// Cron to send emails automatically at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("Running daily cron job to send event emails at 9 AM...");
  await sendUpcomingEventEmails({}, {
    json: (msg) => console.log("Cron email:", msg),
    status: () => ({ json: (err) => console.error(err) })
  });
});

// await UpcomingEvent.deleteMany({ status: "sent" });
