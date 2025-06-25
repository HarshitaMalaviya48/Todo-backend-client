//third-party module
const express = require("express");
const router = express.Router();

//local module
const { jwtAuthMiddleware } = require("../middleware/jwt.js");
const { userUpdate, userDelete, userGet } = require("../controller/user.js");
const {upload} = require("../utills/uploadPhoto.js");

router.use(jwtAuthMiddleware);
router.get("/get-details", userGet)
router.put("/update", upload.single("profile"), userUpdate);

router.delete("/delete", userDelete);

module.exports = router;
