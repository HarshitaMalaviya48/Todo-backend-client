const multer = require("multer");

//To stote profile locally
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    const suffix = Date.now();
    callback(null, suffix + "_" + file.originalname);
  },
});

exports.upload = multer({ storage });