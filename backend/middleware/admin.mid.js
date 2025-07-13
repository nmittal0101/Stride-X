import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

function adminMiddleware(req,res,next){
   
    const authHeader=req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({message:"No token provided"});
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded=jwt.verify(token,process.env.JWT_ADMIN_PASSWORD);
        req.admninid=decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({message:"Invalid token"});
        console.log("Invalid token"+error);
        
    }
}

export default adminMiddleware;