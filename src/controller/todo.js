//local module
const { handleTodoError } = require("../utills/errorHandler");
const todoModule = require("../modules/todo");

const create = async (req, res) => {
  try {
    const posted_data = req.body;
    const userId = req.user.userId;
    const {status_code, ...rest} = await todoModule.todo_create(posted_data, userId);
    res.status(status_code).json(rest);
  } catch (error) {
    return handleTodoError(error, res);
  }
};

const readTodos = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {status_code, ...rest} = await todoModule.todo_reads(userId);
    return res.status(status_code).json(rest);
  } catch (error) {
    return handleTodoError(error, res);
  }
};

const readTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const {status_code, ...rest} = await todoModule.todo_read(id, userId);

    return res.status(status_code).json(rest);
  } catch (error) {
    return handleTodoError(error, res);
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const posted_data = req.body;
    const userId = req.user.userId;

    const {status_code, ...rest} = await todoModule.tood_update(posted_data, id, userId);
    return res.status(status_code).json(rest);
  } catch (error) {
    return handleTodoError(error, res);
  }
};

const deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.userId;
    const {status_code, ...rest} = await todoModule.todo_delete(id, userId);

    return res.status(status_code).json(rest);
  } catch (error) {
    return handleTodoError(error, res);
  }
};

module.exports = {
  create,
  readTodo,
  readTodos,
  update,
  deleteTodo,
};
