const bcrypt = require("bcrypt");
const emailValidator = require("email-validator");

//local module
const db = require("../../models");
const user = db.user;

// POST method to register user
const registration = async (req, res) => {
  try {
    const { userName, email, phoneNo, password } = req.body;
    const profilePath = req.file ? req.file.path : null;
    const isValid = userValidator(userName, email, phoneNo, res);

    if (isValid !== true) return;

    const isPasswordValid = validtaePassword(password, res);

    if (isPasswordValid !== true) return;

    const hashedPassword = await hashPassword(password);
    console.log(hashedPassword);

    const newUser = await user.create({
      userName,
      email,
      phoneNo,
      profile: profilePath,
      password: hashedPassword,
    });
    res.status(200).json({ message: "Registration successful", data: newUser });
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: "Internal server error" });
  }
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// POST method to login user

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const getUser = await user.findOne({
      where: { email },
    });
    console.log("In login api");

    if (!getUser || !(await comparePassword(password, getUser.password))) {
      return res.json({
        msg: "Invalid credentials",
      });
    }
    return res.json({
      message: "User is logged in",
      token: await getUser.generateToken(),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server error" });
  }
};

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// PUT method to update user

const userUpdate = async (req, res) => {
  try {
    const updateId = req.params.id;

    const existingUser = await user.findOne({
      attributes: ["userName", "email", "password", "profile", "phoneNo"],
      where: {
        id: updateId,
      },
    });

    const userName = req.body.userName || existingUser.userName;
    const email = req.body.email || existingUser.email;
    const phoneNo = req.body.phoneNo || existingUser.phoneNo;
    const profile = req.file ? req.file.path : existingUser.profile;

    const isValid = userValidator(userName, email, phoneNo, res);
    if (isValid !== true) return;

    let finalHashPassword = existingUser.password;
    let passwordchanged = false;
    if (req.body.password) {
      const isValidPassword = validtaePassword(req.body.password, res);
      if (isValidPassword !== true) return;
      finalHashPassword = await hashPassword(req.body.password);
      passwordchanged = true;
    }

    const isSensitiveChange = email != existingUser.email || passwordchanged;

    await user.update(
      {
        userName,
        email,
        password: finalHashPassword,
        profile,
        phoneNo,
      },
      {
        where: {
          id: updateId,
        },
      }
    );

    const updatedUser = await user.findOne({
      where: { id: updateId },
    });

    return res.status(200).json({
      message: "User updated successfully",
      redirectToLogin: isSensitiveChange,
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the user." });
  }
};

// DELETE method to delete user
const userDelete = async (req, res) => {
  const deleteId = req.params.id;

  console.log(deleteId);

  try {
    const existingUser = await user.findOne({
      where: { id: deleteId },
    });
    console.log(existingUser);

    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    await user.destroy({
      where: { id: deleteId },
    });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred while deleting user" });
  }
};

// User details validator function
const userValidator = (userName, email, phoneNo, res) => {
  if (!userName || !email || !phoneNo) {
    return res.status(400).json({
      message: "Every field is mandatory",
    });
  }
  if (!/^\d{10}$/.test(phoneNo)) {
    return res.status(400).json({ message: "Invalid PhoneNo" });
  }
  if (!/^[a-zA-Z0-9_]{3,}$/.test(userName)) {
    return res
      .status(400)
      .json({ message: "Username length must be more than 3" });
  }
  if (!emailValidator.validate(email)) {
    return res.status(400).json({ message: "Email format is not proper" });
  }

  return true;
};

//Validate Password
const validtaePassword = (password, res) => {
  if (!password) {
    return res.status(400).json({
      message: "Every field is mandatory",
    });
  }
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    });
  }
  return true;
};

module.exports = { registration, login, userUpdate, userDelete };
