//imports
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";
import {sendVerificationCode} from "../config/configNodemailer.js"
import {generateCode} from "../utils/codeGenerator.js"
import { configDotenv } from "dotenv";
configDotenv()
let username,code;



const loadLogin=(req,res)=>{
    res.clearCookie("token")
    res.render("login",{alertMsg:""})
}
const redirectUser=(req,res)=>{

    const {username,password}=req.body;
    User.findOne({username}).select('+password').then((user)=>{

        if(user){
              if(user.password==password){
            const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
              
            res.cookie("token",token,{
                maxAge:30 * 24 * 60 * 60 * 1000,
                httponly:true
            })

            res.redirect("/")
        }
        else{
            res.render("login",{alertMsg:"password not matched"})
        }
        }
        else{
            res.render("login",{alertMsg:"Username not found"})
        }
      
    })
}

const clearToken=(req,res)=>{
    res.clearCookie("token")
    res.redirect("/login")
}

const loadSignup=(req,res)=>{
    res.clearCookie("token")
    res.render("signup",{alertMsg:""})
}

const redirectVerify=(req,res)=>{
    username=req.body.username;
    User.findOne({username}).then((user)=>{
        if(user){
        res.render("signup",{alertMsg:"username already taken"})
        }
    else
    {
    code=generateCode();
    sendVerificationCode(username,code)
    res.redirect("/verify")
}
    
    }).catch((e)=>console.log(e))
}

 

const loadVerify=(req,res)=>{
    res.render("verify",{alertMsg:""})
}

const usernameVerified=(req,res)=>{
    const usercode=req.body.code;
    if(code==usercode){

        res.redirect("/details")
    }
    else{
        res.render("verify",{alertMsg:"code not matched"})
    }
}

const loadDetails=(req,res)=>{
    res.render('details')
}

const putDetails=(req,res)=>{
    const {fName,lName,password}=req.body
    User.create({
        fName,lName,username,password
    }).then((user)=>{
        const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
              
            res.cookie("token",token,{
                maxAge:30 * 24 * 60 * 60 * 1000,
                httponly:true
            })
        res.redirect("/")
    })
}



export {loadLogin,redirectUser,clearToken,loadSignup,redirectVerify,loadVerify,usernameVerified,loadDetails,putDetails}