const express = require("express");
const router = express.Router();
const {
  createCompany,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  getNextCustomerId,
} = require("../controllers/companyController");

router.post("/company/create", createCompany);
router.get("/company/", getAllCompanies);
router.get("/company/:id", getCompanyById);
router.put("/company/:id", updateCompany);
router.delete("/company/:id", deleteCompany);
router.get("/company/next-id", getNextCustomerId);

module.exports = router;
