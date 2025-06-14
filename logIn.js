const bcrypt = require("bcrypt");
const { app } = require("./index");
const db = require("./models");
const user = db.user;

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const emailsArr = await user.findAll({
    attributes: ["email"],
  });

  const emails = emailsArr.map((obj) => {
    return obj.dataValues.email;
  });

  if (!emails.includes(email)) {
    return res.json({msg: "Enter valid email", userCredential: {email, password}});
  } else {
    const userLogin = await user.findOne({
      where: {
        email: email
      }
    })
    console.log(userLogin);
    
    const hashedPassword = await user.findOne({
      attributes: ["password"],
      where: {
        email: email,
      },
    });

    const hashPass = hashedPassword.dataValues.password;
    const isPasswordValid = await comparePassword(password, hashPass);

    if (isPasswordValid) {
      return res.json({message: "User is logged in", token: await userLogin.generateToken()});
    } else {
      return res.json({msg: "Invalid Password"});
    }
  }
});

const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
