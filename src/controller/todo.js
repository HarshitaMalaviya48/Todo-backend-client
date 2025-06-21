//third-party module

const { format, parse } = require("date-fns");

//local module
const db = require("../../models");
const todo = db.todo;
const todoModule = require("../modules/todo")

const create = async (req, res) => {
  try {
    const posted_data = req.body;
    const response = await todoModule.todo_create(posted_data);
    res.status(200).json({ message: "Todo created", createTodo });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const read = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userTodo = await todo.findAll({
      where: { userId },
    });

    if (!userTodo || userTodo.length === 0) {
      return res.status(404).json({ message: "No todo founds for user" });
    }

    const formattedTodo = userTodo.map((item) => {
      const dateObj = new Date(item.date);
      return {
        id: item.id,
        title: item.title,
        description: item.description,
        date: format(dateObj, "dd-MM-yyyy"),
      };
    });
    console.log(formattedTodo);
    return res.status(200).json(formattedTodo);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    if(!req.body){
      return res.status(400).json({ message: "No fields provided for update." });
    }
    const userTodo = await todo.findOne({
      where: { id },
    });

    if (userTodo.userId != req.user.userId) {
      return res.status(400).json({ error: "Unauthorized: not your todo" });
    }

    const title = req.body.title || userTodo.title;
    const description = req.body.description || userTodo.description;
    let date = userTodo.date;
    if (req.body.date) {
      const parsedDate = parse(req.body.date, "dd-MM-yyyy", new Date());

      if (isNaN(parsedDate))
        return res.status(400).json({ message: "date is not valid" });
      const dateObj = new Date(parsedDate);
      date = format(dateObj, "yyyy-MM-dd");
    }

    await todo.update(
      {
        title,
        description,
        date,
      },
      { where: { id } }
    );

    const updatedTodo = await todo.findOne({
      where: { id },
    });

    return res.status(200).json({
      message: "Todo updated successfully",
      data: {
        title: updatedTodo.title,
        description: updatedTodo.description,
        date: updatedTodo.date,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteTodo = async (req, res) => {
  try {
    const id = req.params.id;
    const userTodo = await todo.findOne({
      attributes: ["userId"],
      where: { id },
    });

    if (!userTodo) {
      return res.status(400).json({ error: "Todo not found" });
    }

    if (userTodo.userId != req.user.userId) {
      return res.status(401).json({ error: "Unauthorized: Not your todo" });
    }

    await todo.destroy({
      where: { id },
    });

    return res.status(200).json({ message: "todo deleted" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  create,
  read,
  update,
  deleteTodo,
};
