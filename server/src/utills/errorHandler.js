const { Sequelize } = require("../db/models");

const sequelizeUniqueConstraintError = (error, res) => {
    console.log("Error in error handler utills",error);
if (error.name === "SequelizeUniqueConstraintError") {
      console.log("in duplicate error", error.name);
      const field = error.errors[0].path;
      return res.status(409).json({ error: `${field} already exists` });
    }
    return res.status(500).json({ error: "Internal Server error" });
}

const sequelizeForeignKeyConstraintError = (error, res) => {
     console.log("Error in error handler utills",error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res
        .status(409)
        .json({ error: "can not delete because your todo is pending" });
    }
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while deleting user" });
}

const handleServerError = (error, res) => {
    console.log("Error in error handler utills",error);
    
    return res.status(500).json({error: "Internal server error"});
}

const handleTodoError = (error, res) => {
  console.log("Error in error handler utills",error);
  if(error instanceof Sequelize.ForeignKeyConstraintError){
    return res.status(400).json({message: "Invalid userId: user does not exist."})
  }
  return res.status(500).json({error: "Internal server error"});
}

module.exports = {sequelizeUniqueConstraintError, sequelizeForeignKeyConstraintError, handleServerError, handleTodoError}
