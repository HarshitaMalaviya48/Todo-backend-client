//local module

const userModule = require("../modules/user");
const db = require("../../models");
const user = db.user;

//GET method to get user details

const userGet = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await userModule.user_get(userId);

    return res.status(response.status_code).json({ ...response.res });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
};

// PUT method to update user

const userUpdate = async (req, res) => {
  try {
    const posted_data = req.body;
    const userId = req.user.userId;
    const response = await userModule.user_update(userId, posted_data);

    return res.status((await response).status_code).json({
      ...response.res,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
};

// DELETE method to delete user
const userDelete = async (req, res) => {
  try {
    const userId = req.user.userId;
    const response = await userModule.user_delete(userId);

    res.status(response.status_code).json({ ...response.res });
  } catch (err) {
    console.log(err);

    if (err.name === "SequelizeForeignKeyConstraintError") {
      return res
        .status(500)
        .json({ message: "can not delete because your todo is pending" });
    }
    console.error(err);
    return res
      .status(500)
      .json({ message: "An error occurred while deleting user" });
  }
};

module.exports = { userUpdate, userDelete, userGet };
