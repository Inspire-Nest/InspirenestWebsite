const express = require('express');
const router = express.Router();
const vendorController = require('../controllers/vendorController');

router.post('/vendor', vendorController.createVendor);
router.get('/vendor', vendorController.getAllVendors);
router.get('/vendor/:id', vendorController.getVendorById);
router.put('/vendor/:id', vendorController.updateVendor);
router.delete('/vendor/:id', vendorController.deleteVendor);

module.exports = router;
