const { format, parse } = require("date-fns");

//local module
const {
  validateTodo,
  validateDate,
  todoFoundOrNot,
  userIsAuthorizedOrNot,
} = require("../utills/todoHelper");
const db = require("../db/models");
const todo = db.todo;

exports.todo_create = async (data, userId) => {
  const { title, description, date } = data;

  const validateTodoerror = validateTodo(title, description, date);
  const validateDateRes = validateDate(date);
  let validationErrors = { ...validateTodoerror };

  if (validateDateRes.error && !validationErrors.date) {
    validationErrors.date = validateDateRes.message;
    return {
      status_code: 400,
      error: validationErrors,
    };
  } else if(Object.keys(validationErrors).length > 0) {
    return {
      status_code: 400,
      error: validationErrors,
    };
  }

  const formattedDate = validateDateRes.date;

  const createTodo = await todo.create({
    title,
    description,
    date: formattedDate,
    userId,
  });

  return {
    status_code: 200,
    message: "Todo is created",
    data: createTodo,
  };
};

exports.todo_reads = async (userId) => {
  const userTodo = await todo.findAll({
    where: { userId },
  });

  if (!userTodo || userTodo.length === 0) {
    return {
      status_code: 404,
      message: "No todo founds for user",
    };
  }

  const formattedTodo = userTodo.map((item) => {
    const dateObj = new Date(item.date);
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      date: format(dateObj, "yyyy-MM-dd"),
      userId: item.userId,
    };
  });
  return {
    status_code: 200,
    data: formattedTodo,
  };
};

exports.tood_update = async (data, id, userId) => {
  const userTodo = await todo.findOne({
    where: { id },
  });

  const todoFoundOrNotRes = todoFoundOrNot(userTodo);
  if (todoFoundOrNotRes) {
    return {
      ...todoFoundOrNotRes,
    };
  }

  const userIsAuthorizedOrNotRes = userIsAuthorizedOrNot(
    userTodo.userId,
    userId
  );

  if (userIsAuthorizedOrNotRes) {
    return {
      ...userIsAuthorizedOrNotRes,
    };
  }

  const title = data.title || userTodo.title;
  const description = data.description || userTodo.description;
  let date = userTodo.date;
  if (data.date) {
    const validateDateRes = validateDate(data.date);
    if (validateDateRes.error) {
      return {
        status_code: 400,
        message: validateDateRes.message,
      };
    }
    date = validateDateRes.date;
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

  return {
    status_code: 200,
    message: "Todo updated successfully",
    data: updatedTodo,
  };
};

exports.todo_delete = async (id, userId) => {
  const userTodo = await todo.findOne({
    where: { id },
  });

  // console.log("id", id);
  // console.log("userID", userId);
  // console.log("usertodo", userTodo.userId);

  const todoFoundOrNotRes = todoFoundOrNot(userTodo);
  if (todoFoundOrNotRes) {
    return {
      ...todoFoundOrNotRes,
    };
  }

  const userIsAuthorizedOrNotRes = userIsAuthorizedOrNot(
    userTodo.userId,
    userId
  );

  if (userIsAuthorizedOrNotRes) {
    return {
      ...userIsAuthorizedOrNotRes,
    };
  }

  await todo.destroy({
    where: { id },
  });

  return {
    status_code: 200,
    message: "Todo is deleted",
  };
};

exports.todo_read = async (id, userId) => {
  // console.log("id", id);
  // console.log("userId", userId);

  const userTodo = await todo.findOne({
    where: { id },
  });

  const todoFoundOrNotRes = todoFoundOrNot(userTodo);
  if (todoFoundOrNotRes) {
    return {
      ...todoFoundOrNotRes,
    };
  }

  const userIsAuthorizedOrNotRes = userIsAuthorizedOrNot(
    userTodo.userId,
    userId
  );

  if (userIsAuthorizedOrNotRes) {
    return {
      ...userIsAuthorizedOrNotRes,
    };
  }

  return {
    status_code: 200,
    data: {
      id: userTodo.id,
      title: userTodo.title,
      description: userTodo.description,
      date: userTodo.date,
      userId: userTodo.userId,
    },
  };
};
