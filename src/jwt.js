const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token,"token");
    

    if(!token){
        return res.status(401).json({error: "unathorization "})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        console.log("user decoded", decoded);
        
        next();
    }catch(err){
        console.log(err);
         return res.status(401).json({error: "unathorization "})
    }
}

module.exports = {jwtAuthMiddleware}