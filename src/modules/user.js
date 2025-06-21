const db = require("../../models");
const user = db.user;
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

exports.user_update = async (userId, data) => {
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