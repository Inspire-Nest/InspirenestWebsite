const Vendor = require('../models/Vendor');

// Create Vendor
exports.createVendor = async (req, res) => {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json({ message: 'Vendor created successfully', vendor });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create vendor', error: error.message });
  }
};

// Get all Vendors
exports.getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vendors', error: error.message });
  }
};

// Get Vendor by ID
exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.status(200).json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching vendor', error: error.message });
  }
};

// Update Vendor
exports.updateVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.status(200).json({ message: 'Vendor updated', vendor });
  } catch (error) {
    res.status(400).json({ message: 'Update failed', error: error.message });
  }
};

// Delete Vendor
exports.deleteVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
    res.status(200).json({ message: 'Vendor deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};
