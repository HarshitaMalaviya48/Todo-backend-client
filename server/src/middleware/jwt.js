const jwt = require("jsonwebtoken");

require("dotenv").config();
const db = require("../db/models");
const blackListToken = db.blackListToken;

const jwtAuthMiddleware = async (req, res, next) => {
  console.log("in jwt authorization");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Token missing or malformed" });
  }

  const token = req.headers.authorization.split(" ")[1];
  // console.log(token,"token");

  if (!token) {
    return res.status(401).json({ error: "Unauthorized " });
  }

  const isBlackListed = await blackListToken.findOne({
    where: { token },
  });

  if (isBlackListed) {
    return res
      .status(401)
      .json({
        error:
          "User has been logged out or have changed sensitive details like email or password",
      });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
   console.log("In jwtauth middleware", decoded);
   
    req.user = decoded;
    // console.log("user decoded", decoded);

    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: "your token has been expired" });
  }
};

const generateToken = async (user) => {
  try {
    console.log("In generate token fun",user);
    
    return jwt.sign(
      {
        userId: user.id,
        userName: user.userName,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "8h" }
    );
  } catch (err) {
    console.error(err);
  }
};

module.exports = { jwtAuthMiddleware, generateToken };
