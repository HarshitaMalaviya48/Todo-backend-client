const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
    console.log("in jwt authorization");

    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({ error: "Unauthorized: Token missing or malformed" });
    }
    
    const token = req.headers.authorization.split(" ")[1];
    // console.log(token,"token");
    

    if(!token){
        return res.status(401).json({error: "unathorization "})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        // console.log("user decoded", decoded);
        
        next();
    }catch(err){
        console.log(err);
         return res.status(401).json({error: "your token has been expired"})
    }
}

module.exports = {jwtAuthMiddleware}