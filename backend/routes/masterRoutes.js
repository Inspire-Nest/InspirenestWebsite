const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/masterController");

// Employee Level
router.post("/employee-levels", ctrl.addEmployeeLevel);
router.get("/employee-levels", ctrl.getEmployeeLevels);

// Editable Gifts
router.post("/editable-gifts", ctrl.addEditableGift);
router.get("/editable-gifts", ctrl.getEditableGifts);

// Custom Gifts
router.post("/custom-gifts", ctrl.addCustomGift);
router.get("/custom-gifts", ctrl.getCustomGifts);

// Industry
router.post("/industries", ctrl.addIndustry);
router.get("/industries", ctrl.getIndustries);

// Vendor Types
router.post("/vendor-types", ctrl.addVendorType);
router.get("/vendor-types", ctrl.getVendorTypes);

// Cities
router.post("/cities", ctrl.addCity);
router.get("/cities", ctrl.getCities);

// Categories
router.post("/categories", ctrl.addCategory);
router.get("/categories", ctrl.getCategories);

module.exports = router;
