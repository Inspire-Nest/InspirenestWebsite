require("dotenv").config(); // Load env vars
require("./cron/upcomingEventsJob");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // ⬅️ Add this line

const upcomingEventsRoutes = require("./routes/upcomingEvents");
const emailRoutes = require("./routes/sendEmails");
const authRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const masterRoutes = require("./routes/masterRoutes");
const giftRoutes = require("./routes/giftPreferenceRoutes");
const subscriptionRoutes = require("./routes/subscriptionRoutes");
const CustomEventRoutes = require("./routes/CustomEventRoutes");
const eventTemplateRoutes = require("./routes/eventTemplateRoutes");
const selectedEventRoutes = require("./routes/selectedEventRoutes");
const customEventManualRoutes = require("./routes/customEventManualRoutes");
const selectedEventManualRoutes = require("./routes/selectedEventManualRoutes");
const hrCustomEventRoutes = require("./routes/hrCustomEventRoutes");
const calendarEventRoutes = require("./routes/calendarEventRoutes");
const templateRoutes = require("./routes/templateRoutes");
const calendarSelectedEventRoutes = require("./routes/calendarSelectedEventRoutes");
const EmpLevelRoutes = require("./routes/EmpLevelRoutes");
const CompanyTypeRoutes = require("./routes/CompanyTypeRoutes");
const industryRoutes = require("./routes/industryRoutes");
const countryRoutes = require("./routes/countryRoutes");
const edibleGiftRoutes = require("./routes/edibleGiftRoutes");
const customGiftRoutes = require("./routes/customGiftRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
mongoose.connection.on("connected", () => {
  console.log("Connected to DB:", mongoose.connection.name);
});

// routes
app.use("/api", templateRoutes);
app.use("/api", selectedEventManualRoutes);
app.use("/api", customEventManualRoutes);
app.use("/api", selectedEventRoutes);
app.use("/api", subscriptionRoutes);
app.use("/api", authRoutes);
app.use("/api", companyRoutes);
app.use("/api", employeeRoutes);
app.use("/api", vendorRoutes);
app.use("/api", masterRoutes);
app.use("/api", giftRoutes);
app.use("/api", CustomEventRoutes);
app.use("/api/events", upcomingEventsRoutes);
app.use("/api", emailRoutes);
app.use("/api", eventTemplateRoutes);
// app.use("/uploads", express.static("uploads"));
app.use("/api", hrCustomEventRoutes);
app.use("/api", calendarEventRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", calendarSelectedEventRoutes);
app.use("/api", EmpLevelRoutes);
app.use("/api/all/companytypes", CompanyTypeRoutes);
app.use("/api/all/industries", industryRoutes);
app.use("/api/all/countries", countryRoutes);
app.use("/api/all/ediblegifts", edibleGiftRoutes);
app.use("/api/all/customgifts", customGiftRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
