//local module

const userModule = require("../modules/user");
const {sequelizeUniqueConstraintError, sequelizeForeignKeyConstraintError, handleServerError} = require("../utills/errorHandler")
const db = require("../db/models");
const user = db.user;

//GET method to get user details

const userGet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await userModule.user_get(userId);

    return res.status(response.status_code).json({ ...response.res });
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
    const response = await userModule.user_update(userId, posted_data, authHeader);

    return res.status((await response).status_code).json({
      ...response.res,
    });
  } catch (error) {
    console.error(error);
    return sequelizeUniqueConstraintError(error, res);
  }
};

// DELETE method to delete user
const userDelete = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await userModule.user_delete(userId);

    res.status(response.status_code).json({ ...response.res });
  } catch (error) {
    return sequelizeForeignKeyConstraintError(error, res)
    
  }
};

module.exports = { userUpdate, userDelete, userGet };
