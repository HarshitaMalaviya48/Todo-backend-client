const jwt = require("jsonwebtoken")

const db = require("../db/models");
const user = db.user;
const blackListToken = db.blackListToken;
const {
  userDetailsValidator,
  validtaPassword,
  bodyParsing,
} = require("../utills/userValidator");
const passwordHelper = require("../utills/passwordHelper");

exports.user_get = async (userId) => {
    const userDetail = await user.findOne({
        where: {id: userId}
    })

    if(!userDetail){
        return {
            status_code: 404,
            res: {message: "User not found"}
        }
    }

    return {
        status_code: 200,
        res: {data: userDetail}
    }
} 

exports.user_update = async (userId, data, authHeader) => {
    const bodyParsingError = bodyParsing(data);
  if (bodyParsingError)  return bodyParsingError;

    const existingUser = await user.findOne({
      attributes: ["userName", "email", "password", "profile", "phoneNo"],
      where: {
        id: userId,
      },
    });

    if(!existingUser){
        return {
            status_code: 404,
            res: {message: "User does not Exists"}
        }
    }

    const userName = data.userName || existingUser.userName;
    const email = data.email || existingUser.email;
    const phoneNo = data.phoneNo || existingUser.phoneNo;
    const profile = data.file ? data.file.path : existingUser.profile;

    const error = userDetailsValidator(userName, email, phoneNo);
    if (error) {
      return { status_code: 400, res: { message: error } };
    }

    let finalHashPassword = existingUser.password;
    let passwordchanged = false;
    const newPassword = data.password;
    if (newPassword) {
      const passwordError = validtaPassword(newPassword);
      if (passwordError) {
        return { status_code: 400, res: { message: passwordError } };
      }
      finalHashPassword = await passwordHelper.hashPassword(newPassword);
      passwordchanged = true;
    }

    const isSensitiveChange = email != existingUser.email || passwordchanged;

    if(isSensitiveChange){
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
      console.log("in update block",decoded);
      
      await blackListToken.create({
        token,
        expiresAt: new Date(decoded.exp * 1000)
      })
    }

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
          id: userId,
        },
      }
    );

    const updatedUser = await user.findOne({
      where: { id: userId },
    });
    console.log("updated user",updatedUser)

    return {
        status_code: 200,
        res: {
            message: "User updated successfully",
            redirectToLogin: isSensitiveChange,
            data: updatedUser
        }
    }

}

exports.user_delete = async (userId) => {
    const existingUser = await user.findOne({
      where: { id: userId },
    });
    console.log(existingUser);

    if (!existingUser) {
      return {
        status_code: 404,
        res: {message: "User does not exist"}
      };
    }

    await user.destroy({
      where: { id: userId },
    });

    return {
        status_code: 200,
        res: { message: "User deleted successfully" }
    }


}