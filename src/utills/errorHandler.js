const sequelizeUniqueConstraintError = (error, res) => {
    console.log("Error in error handler utills",error);
if (error.name === "SequelizeUniqueConstraintError") {
      console.log("in duplicate error", error.name);
      const field = error.errors[0].path;
      return res.status(409).json({ message: `${field} already exists` });
    }
    return res.status(500).json({ message: "Internal Server error" });
}

const sequelizeForeignKeyConstraintError = (error, res) => {
     console.log("Error in error handler utills",error);
    if (error.name === "SequelizeForeignKeyConstraintError") {
      return res
        .status(500)
        .json({ message: "can not delete because your todo is pending" });
    }
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting user" });
}

const handleServerError = (error, res) => {
    console.log("Error in error handler utills",error);
    
    return res.status(500).json({error: "Internal server error"});
}

module.exports = {sequelizeUniqueConstraintError, sequelizeForeignKeyConstraintError, handleServerError}
