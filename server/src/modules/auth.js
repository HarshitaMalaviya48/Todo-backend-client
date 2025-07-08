const jwt = require("jsonwebtoken");

const {generateToken} = require("../middleware/jwt")
const {
  userDetailsValidator,
  validtaPassword,
  bodyParsing,
} = require("../utills/userValidator");
const passwordHelper = require("../utills/passwordHelper");
const db = require("../db/models");
const user = db.user;
const blackListToken = db.blackListToken;

exports.register_user = async (data, file) => {
  const bodyParsingError = bodyParsing(data);
  if (bodyParsingError) return bodyParsingError;
  
  const { userName, email, phoneNo, password } = data;
  const profilePath = file ? `uploads/${file.filename}` : `uploads/profile_icon.jpg`;
  const profileUrl = `http://localhost:3001/${profilePath.replace(/\\/g, "/")}`;
  console.log("statis profile icon", profileUrl);
  
  const userErrors = userDetailsValidator(userName, email, phoneNo);
  const passwordError = validtaPassword(password);

  const validationErrors = {...userErrors, ...passwordError}
  if(Object.keys(validationErrors).length > 0){
    return {status_code: 400, error: validationErrors}
  }
  const hashedPassword = await passwordHelper.hashPassword(password);
  // console.log(hashedPassword);

  const newUser = await user.create({
    userName,
    email,
    phoneNo,
    profile: profileUrl,
    password: hashedPassword,
  });

  return {
    status_code: 200,
    message: "User registered Successfully",
    data: {
      ...newUser.toJSON(),
      profile: profileUrl
    },
  };

  // throw new Error("database connection failed")
};

exports.login_user = async (data) => {
  const bodyParsingError = bodyParsing(data);
  if (bodyParsingError) {
    return bodyParsingError;
  }
  const { email, password, confirmPassword } = data;

  // console.log(email, password);
  const error = {};
  if(!email){
    error.email = "Email is Mandatory"
  }
  if(!password){
    error.password = "Password is Mandatory"
  }
  if(!confirmPassword){
    error.confirmPassword = "Confirm Password is Mandatory";
  }
  console.log("error", error);
  
  if(Object.keys(error).length > 0){
    return {status_code: 400, error: error}
  }
  
  if(confirmPassword !== password){
    error.doesPasswordMatched = "Password do not Matched";
    return {status_code: 400, error: error};
  }

  const getUser = await user.findOne({
    where: { email },
  });

  if (
    !getUser ||
    !(await passwordHelper.comparePassword(password, getUser.password))
  ) {
    error.credentialError = "Invalid Credentials"
    return {
      status_code: 401,
       error:  error,
    };
  }

  return {
    status_code: 200,
    message: "User is logged in", token: await generateToken(getUser) ,
  };
};

exports.logout_user = async (authHeader) => {
  const token = authHeader.split(" ")[1];

  if (token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    await blackListToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });
  }

  return {
    status_code: 200,
   message: "user logout successfully" ,
  };
};
