const emailValidator = require("email-validator");
const constants = require("./constant");

// User details validator function
const userDetailsValidator = (userName, email, phoneNo) => {
  if (!userName) {
    return "Username is Mandatory";
  }
  if (!email) {
    return "Email is Mandatory";
  }
  if (!phoneNo) {
    return "Phone Number is Mandatory";
  }
  if (!constants.PHONENO_REGEX.test(phoneNo)) {
    return "Invalid PhoneNo";
  }
  if (!constants.USERNAME_REGEX.test(userName)) {
    return "Username length must be more than or equal to 3 and should be all charcter";
  }
  // console.log("email", email);

  if (!emailValidator.validate(email)) {
    return "Email format is not proper";
  }

  return null;
};

//Validate Password
const validtaPassword = (password) => {
  if (!password) {
    return "Password is mandatory";
  }
  if (!constants.PASSWORD_REGEX.test(password)) {
    return "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }
  return null;
};

const bodyParsing = (body) => {
  if(!body){
    return{
      status_code: 400,
      res: {message: "Nothing is provided"}
    }
  }
}
module.exports = {
  userDetailsValidator,
  validtaPassword,
  bodyParsing
};
