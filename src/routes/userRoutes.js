//third-party module
const multer = require("multer");
const express = require("express");
const router = express.Router();

//local module
const db = require("../../models");
const user = db.user;
const {
  registration,
  login,
  userUpdate,
  userDelete,
} = require("../controller/user.js");

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

const upload = multer({ storage });


router.post("/registration", upload.single("profile"), registration);

router.post("/login", login);

router.put("/update/:id", upload.single("profile"), userUpdate);

router.delete("/delete/:id", userDelete);

module.exports = router;
