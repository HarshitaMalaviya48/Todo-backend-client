const emailValidator = require("email-validator");
const constants = require("./constant");

// User details validator function
const userDetailsValidator = (userName, email, phoneNo) => {
 const error = {};

  if (!userName) {
    error.userName = "Username is mandatory";
  } else if (!constants.USERNAME_REGEX.test(userName)) {
    error.userName = "Username must be at least 3 characters and contain only letters";
  }

  if (!email) {
    error.email = "Email is mandatory";
  } else if (!emailValidator.validate(email)) {
    error.email = "Email format is not valid";
  }

  if (!phoneNo) {
    error.phoneNo = "Phone number is mandatory";
  } else if (!constants.PHONENO_REGEX.test(phoneNo)) {
    error.phoneNo = "Invalid phone number format";
  }
  return Object.keys(error).length > 0 ? error : null;
};

//Validate Password
const validtaPassword = (password, isRequired = true) => {
  const error = {};

  if (!password || password.trim() === "") {
    if (isRequired) {
      error.password = "Password is mandatory";
    }
  } else if (!constants.PASSWORD_REGEX.test(password)) {
    error.password =
      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character.";
  }

  return Object.keys(error).length > 0 ? error : null;
};

const bodyParsing = (body) => {
  if(!body){
    return{
      status_code: 400,
      error: "Nothing is provided"
    }
  }
}
module.exports = {
  userDetailsValidator,
  validtaPassword,
  bodyParsing
};
