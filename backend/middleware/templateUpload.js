const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, "template_" + Date.now() + path.extname(file.originalname));
  },
});

const uploadTemplate = multer({ storage });

module.exports = uploadTemplate;
