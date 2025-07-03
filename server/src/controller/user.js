//local module

const userModule = require("../modules/user");
const {sequelizeUniqueConstraintError, sequelizeForeignKeyConstraintError, handleServerError} = require("../utills/errorHandler")


//GET method to get user details

const userGet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {status_code, ...rest} = await userModule.user_get(userId);

    return res.status(status_code).json(rest);
  } catch (error) {
    return handleServerError(error, res)
  }
};

// PUT method to update user

const userUpdate = async (req, res) => {
  try {
    const posted_data = req.body;
    const userId = req.user.userId;
    const authHeader = req.headers.authorization
    const {status_code, ...rest} = await userModule.user_update(userId, posted_data, req.file, authHeader);

    return res.status(status_code).json(rest);
  } catch (error) {
    console.error(error);
    return sequelizeUniqueConstraintError(error, res);
  }
};

// DELETE method to delete user
const userDelete = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {status_code, ...rest} = await userModule.user_delete(userId);

    res.status(status_code).json(rest);
  } catch (error) {
    return sequelizeForeignKeyConstraintError(error, res)
    
  }
};

module.exports = { userUpdate, userDelete, userGet };
