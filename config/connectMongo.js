import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const connectDb=()=>{
    mongoose.connect(process.env.MONGOOSE_URI,{
        dbName:"chatApp"
    }).then(()=>{
        console.log("database connected")
    }).catch((e)=>console.log("error:",e))
}

export {connectDb}