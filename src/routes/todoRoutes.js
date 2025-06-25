const express = require("express");
const router = express.Router();

const { create, readTodo, readTodos, update, deleteTodo } = require("../controller/todo.js");
const { jwtAuthMiddleware } = require("../middleware/jwt.js");
router.use(jwtAuthMiddleware);
router.post("/create", create);
router.get("/readTodo/:id", readTodo);
router.get("/readTodos", readTodos);
router.put("/update/:id", update);
router.delete("/delete/:id", deleteTodo);

module.exports = router;
