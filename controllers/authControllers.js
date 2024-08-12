//imports
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import {sendVerificationCode} from "../config/configNodemailer.js"
import {generateCode} from "../utils/codeGenerator.js"
import { configDotenv } from "dotenv";
configDotenv()
let username,code;

const redirectUser=(req,res)=>{
    const {username,password}=req.body;
    

    User.findOne({username}).select('+password').then((user)=>{
   
        if(user){
              if(user.password==password){
            const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
              
            res.cookie("token", token, {
                maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
               
                secure: true,    // Ensures the cookie is only sent over HTTPS
                sameSite: 'None' // Allows the cookie to be sent with cross-site requests
            });
            
            res.send(user).status(200)
        }
        else{
            res.status(401).send({alertMsg:"password not matched"})
        }
        }
        else{

            res.status(401).send({alertMsg:"Account Not Found "})
        }
      
    })
}


const register=async(req,res)=>{
    const {username,password,fName,lName}=req.body;
    try{
        const user=await User.findOne({username});
        if(user){
            res.status(401).send({alertMsg:"username already exist"})
        }
        else{
            User.create({
                fName,lName,username,password
            }).then((user)=>{
                const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
                      
                res.cookie("token", token, {
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                   
                    secure: true,    // Ensures the cookie is only sent over HTTPS
                    sameSite: 'None' // Allows the cookie to be sent with cross-site requests
                });
                
                res.send(user).status(200)
            }).catch((e)=>{
                console.log(e);
                res.send("cannot create User")
            })
        }
    }
    catch(err){
    
        console.log(err)
    }
}

export {redirectUser,register}