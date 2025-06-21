const express = require("express");
const router = express.Router();
const {registration, login} = require("../controller/auth")
const {upload} = require("../utills/uploadPhoto")

router.post("/registration", upload.single("profile"), registration);

router.post("/login", login);

module.exports = router;