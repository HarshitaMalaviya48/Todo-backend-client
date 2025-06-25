const express = require("express");
const router = express.Router();
const { registration, login, logout } = require("../controller/auth");
const { upload } = require("../utills/uploadPhoto");
const { jwtAuthMiddleware } = require("../middleware/jwt");

router.post("/registration", upload.single("profile"), registration);

router.post("/login", login);

router.post("/logout", jwtAuthMiddleware, logout);

module.exports = router;
