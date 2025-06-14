//third-party module
const bcrypt = require("bcrypt");
const express = require("express");
const { isValidPhoneNumber } = require("libphonenumber-js");
const emailValidator = require("email-validator");

//local modules
const db = require("./models");
const user = db.user;

console.log(user);

const app = express();

app.use(express.json());

app.post("/registration", async (req, res) => {
  const { userName, email, phoneNo, profile, password } = req.body;

  if (
    !isValidPhoneNumber(phoneNo) ||
    !/^[a-zA-Z0-9_]{3,}$/.test(userName) ||
    !emailValidator.validate(email) ||
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    )
  ) {
    return res.status(400).json({
      msg: "Invalid credentials",
      userCredentials: { userName, email, phoneNo, profile, password },
    });
  } else if (
    !userName ||
    !email ||
    !phoneNo ||
    !password
  ) {
    return res.status(400).json({ message: "Every field is mandatory", userCredentials: { userName, email, phoneNo, profile, password }, });
  } else {
    const hashedPassword = await hashPassword(password);

    try {
      const newUser = await user.create({
        userName,
        email,
        phoneNo,
        profile,
        password: hashedPassword,
      });
      res
        .status(200)
        .json({message: "Registration successful", data: newUser});
    } catch (err) {
      res.status(404).send(err);
    }
  }
});

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on port 3000");
});

module.exports = {
  app,
};
