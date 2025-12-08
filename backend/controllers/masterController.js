const {
  EmployeeLevel,
  EditableGift,
  CustomGift,
  Industry,
  VendorType,
  City,
  Category
} = require("../models/Master");

// ---------- Employee Level ----------
exports.addEmployeeLevel = async (req, res) => {
  try {
    const saved = await new EmployeeLevel({ name: req.body.name }).save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.getEmployeeLevels = async (req, res) => {
  try {
    res.json(await EmployeeLevel.find().sort({ name: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ---------- Editable Gifts ----------
exports.addEditableGift = async (req, res) => {
  try {
    const saved = await new EditableGift({ name: req.body.name }).save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.getEditableGifts = async (req, res) => {
  try {
    res.json(await EditableGift.find().sort({ name: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ---------- Custom Gifts ----------
exports.addCustomGift = async (req, res) => {
  try {
    const saved = await new CustomGift({ name: req.body.name }).save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.getCustomGifts = async (req, res) => {
  try {
    res.json(await CustomGift.find().sort({ name: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ---------- Industry ----------
exports.addIndustry = async (req, res) => {
  try {
    const saved = await new Industry({ name: req.body.name }).save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.getIndustries = async (req, res) => {
  try {
    res.json(await Industry.find().sort({ name: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ---------- Vendor Type ----------
exports.addVendorType = async (req, res) => {
  try {
    const saved = await new VendorType({ name: req.body.name }).save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.getVendorTypes = async (req, res) => {
  try {
    res.json(await VendorType.find().sort({ name: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ---------- City ----------
exports.addCity = async (req, res) => {
  try {
    const saved = await new City({ name: req.body.name }).save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.getCities = async (req, res) => {
  try {
    res.json(await City.find().sort({ name: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};

// ---------- Category ----------
exports.addCategory = async (req, res) => {
  try {
    const saved = await new Category({ name: req.body.name }).save();
    res.status(201).json(saved);
  } catch (err) { res.status(400).json({ error: err.message }); }
};
exports.getCategories = async (req, res) => {
  try {
    res.json(await Category.find().sort({ name: 1 }));
  } catch (err) { res.status(500).json({ error: err.message }); }
};
