const express = require("express");
const router = express.Router();

const { create, read, update, deleteTodo } = require("../controller/todo.js");
const { jwtAuthMiddleware } = require("../jwt.js");
router.use(jwtAuthMiddleware)
router.post("/create", create);
router.get("/read", read);
router.put("/update/:id", update);
router.delete("/delete/:id", deleteTodo);

module.exports = router;
