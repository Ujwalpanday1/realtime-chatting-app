import nodemailer from "nodemailer"
import { configDotenv } from "dotenv"

configDotenv()
const sendVerificationCode=(username,code)=>{
const transporter=nodemailer.createTransport({
    service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASS
            
        }
})

    const mailOption={
        from:process.env.USER,
        to:username,
        subject:"Verification Code",
        text:`Your verification code is : ${code}`
        
}
    transporter.sendMail(mailOption,(error,info)=>{
        if(error){
            console.log("error sending code")
        }
        else{
            console.log("code sent ")
        }
    })
}
export {sendVerificationCode}

