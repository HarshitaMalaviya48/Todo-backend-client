const multer = require("multer");

//To stote profile locally
console.log("Inside multer");
const storage = multer.diskStorage({
  
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },
  filename: (req, file, callback) => {
    const suffix = Date.now();
    callback(null, suffix + "_" + file.originalname);
  },
});
console.log("outside multer");

exports.upload = multer({ storage });