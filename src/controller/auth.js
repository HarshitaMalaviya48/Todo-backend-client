const authModule = require("../modules/auth")


// POST method to register user
const registration = async (req, res) => {
  try {

    const posted_data = req.body;
    const response = await authModule.register_user(posted_data);
   
    res.status(response.status_code).json({...response.res});
  } catch (err) {
    console.log(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      console.log("in duplicate error", err.name);
      const field = err.errors[0].path;
      return res.status(409).json({ message: `${field} already exists` });
    }
    return res.status(500).json({ message: "Internal Server error" });
  }
};



// POST method to login user

const login = async (req, res) => {
  try {

    const posted_data = req.body;
    const response = await authModule.login_user(posted_data);
    
    return res.status(response.status_code).json({
      ...response.res
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

module.exports = {
    registration,
    login
}