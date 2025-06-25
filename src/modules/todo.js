
//local module
const { validateTodo, validateDate } = require("../utills/todoHelper");
const db = require("../db/models");
const todo = db.todo;

exports.todo_create = async (data, userId) => {
  const { title, description, date } = data;

  const validateTodoRes = validateTodo(title, description, date);
  if (validateTodoRes) {
    return {
      status_code: 400,
      res: { message: validateTodoRes },
    };
  }

  const validateDateRes = validateDate(date);

  if(validateDateRes.error){
    return {
      status_code: 400,
      res: {message: validateDateRes.message}
    }
  }

  const formattedDate = validateDateRes.date
 
  

  const createTodo = await todo.create({
    title,
    description,
    date: formattedDate,
    userId,
  });

  return {
    status_code: 200,
    res: {message: "Todo is created", data: createTodo },
  };
};

exports.todo_reads = async (userId) => {
  const userTodo = await todo.findAll({
    where: { userId },
  });

  if (!userTodo || userTodo.length === 0) {
    return {
      status_code: 404,
      res: { message: "No todo founds for user" },
    };
  }

  const formattedTodo = userTodo.map((item) => {
    const dateObj = new Date(item.date);
    return {
      id: item.id,
      title: item.title,
      description: item.description,
      date: format(dateObj, "dd-MM-yyyy"),
      userId: item.userId,
    };
  });
  return {
    status_code: 200,
    res: { data: formattedTodo },
  };
};

exports.tood_update = async (data, id, userId) => {
  const userTodo = await todo.findOne({
    where: { id },
  });

  if(!userTodo){
    return {
      status_code: 400,
      res: {message: "Todo not found"}
    }
  }

  if (userTodo.userId != userId) {
    return {
      status_code: 400,
      res: { message: "Unauthorized: not your todo" },
    };
  }

  const title = data.title || userTodo.title;
  const description = data.description || userTodo.description;
  let date = userTodo.date;
  if (data.date) {
   const validateDateRes = validateDate(data.date);
   if(validateDateRes.error){
    return {
      status_code: 400,
      res: {message: validateDateRes.message}
    }
   }
   date = validateDateRes.date
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
    res: { message: "Todo updated successfully", data: updatedTodo },
  };
};

exports.todo_delete = async (id, userId) => {
  const userTodo = await todo.findOne({
    where: { id },
  });

  if (!userTodo) {
    return {
      status_code: 400,
      res: { message: "Todo not found" },
    };
  }
  // console.log("id", id);
  // console.log("userID", userId);
  // console.log("usertodo", userTodo.userId);
  
  
  

  if (userTodo.userId != userId) {
    return {
      status_code: 401,
      res: {
        message: "Unauthorized: Not your todo",
      },
    };
  }

  await todo.destroy({
    where: { id },
  });

  return {
    status_code: 200,
    res: { message: "Todo is deleted" },
  };
};

exports.todo_read = async (id, userId) => {
  // console.log("id", id);
  // console.log("userId", userId);

  const userTodo = await todo.findOne({
    where: { id },
  });
  
  if (!userTodo) {
    return {
      status_code: 400,
      res: { message: "Todo not found" },
    };
  }

  if (userTodo.userId != userId) {
    return {
      status_code: 401,
      res: { message: "Unauthorized : Not your todo" },
    };
  }

  return {
    status_code: 200,
    res: {
      data: {
        id: userTodo.id,
        title: userTodo.title,
        description: userTodo.description,
        date: userTodo.date,
        userId: userTodo.userId,
      },
    },
  };
};
