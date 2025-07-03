const authModule = require("../modules/auth");
const {
  sequelizeUniqueConstraintError,
  handleServerError,
} = require("../utills/errorHandler");

// POST method to register user
const registration = async (req, res) => {
  try {
    const posted_data = req.body;
    const response = await authModule.register_user(posted_data);
    const { status_code, ...rest } = response;

    res.status(status_code).json(rest);
  } catch (error) {
    console.log(error);
    return sequelizeUniqueConstraintError(error, res);
  }
};

// POST method to login user

const login = async (req, res) => {
  try {
    const posted_data = req.body;
    const { status_code, ...rest } = await authModule.login_user(posted_data);

    return res.status(status_code).json(rest);
  } catch (error) {
    return handleServerError(error, res);
  }
};

//method to logout user

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const { status_code, ...rest } = await authModule.logout_user(authHeader);

    return res.status(status_code).json(rest);
  } catch (error) {
    return handleServerError(error, res);
  }
};

module.exports = {
  registration,
  login,
  logout,
};
