const {
  userDetailsValidator,
  validtaPassword,
  bodyParsing,
} = require("../utills/userValidator");
const passwordHelper = require("../utills/passwordHelper");
const db = require("../../models");
const user = db.user;

exports.register_user = async (data) => {
  const bodyParsingError = bodyParsing(data);
  if (bodyParsingError)  return bodyParsingError;

  const { userName, email, phoneNo, password } = data;
  const profilePath = data.file ? data.file.path : null;
  const error = userDetailsValidator(userName, email, phoneNo);

  if (error) {
    console.log("in validator error block");

    return { status_code: 400, res: { message: error } };
  }

  const passwordError = validtaPassword(password);

  if (passwordError) {
    console.log("in password  validator error block");
    return { status_code: 400, res: { message: passwordError } };
  }

  const hashedPassword = await passwordHelper.hashPassword(password);
  console.log(hashedPassword);

  const newUser = await user.create({
    userName,
    email,
    phoneNo,
    profile: profilePath,
    password: hashedPassword,
  });

  return {
    status_code: 200,
    res: { message: "User registered Successfully", data: newUser },
  };
};

exports.login_user = async (data) => {
  const bodyParsingError = bodyParsing(data);
  if (bodyParsingError) {
    return bodyParsingError;
  }
  const { email, password } = data;

  console.log(email, password);
  if (!email || !password) {
    return {
      status_code: 400,
      res: { message: "Email and Password both are mendatory" },
    };
  }

  const getUser = await user.findOne({
    where: { email },
  });

  if (
    !getUser ||
    !(await passwordHelper.comparePassword(password, getUser.password))
  ) {
    return {
      status_code: 401,
      res: { message: "Invalid Credentials" },
    };
  }

  return {
    status_code: 200,
    res: { message: "User is logged in", token: await getUser.generateToken() },
  };
};
