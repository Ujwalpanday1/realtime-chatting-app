import jwt from "jsonwebtoken"
import { configDotenv } from "dotenv"
configDotenv()
const isAuthenticated=(req,res,next)=>{

    const {token}=req.cookies
    if(token){
        const user=jwt.verify(token,process.env.JWT_SECRET)
        req.user=user;
        next();
    }

    else{
        res.redirect("/login")
    }
    
}

export {isAuthenticated}