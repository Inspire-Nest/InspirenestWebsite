const express = require("express");
const router = express.Router();
const {
  createEmployee,
  getEmployeesByCompany,
  updateEmployee,
  deleteEmployee,
  getUpcomingEvents,
} = require("../controllers/employeeController");
const multer = require("multer");
const path = require("path");
const { bulkUploadEmployees } = require("../controllers/employeeController");

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, "bulk_upload_" + Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Route for bulk upload
router.post("/bulk-upload", upload.single("file"), bulkUploadEmployees);
router.post("/create", createEmployee);
router.get("/employees/companies/:companyId", getEmployeesByCompany);
router.put("/:id", updateEmployee);
router.delete("/:id", deleteEmployee);
router.get("/upcoming-events", getUpcomingEvents);

module.exports = router;
