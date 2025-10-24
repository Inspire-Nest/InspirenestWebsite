const multer = require("multer");
const path = require("path");

// storage for template images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/templates/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, "template_" + Date.now() + path.extname(file.originalname));
  },
});

// only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed (jpeg, jpg, png, gif)"), false);
  }
};

const uploadTemplate = multer({ storage, fileFilter });

module.exports = uploadTemplate;
