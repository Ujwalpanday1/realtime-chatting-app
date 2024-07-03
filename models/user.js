
import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    fName:{
        type:"string",
        required:true,
        
    },
    lName:{
        type:"string",
        required:true,
        
    },
    username:{
        type:"string",
        required:true,
        uniqe:true
    },
    password:{
        type:"string",
        required:true,
        select:false
    },
    socketid:{
        type:"string"
    },
    chat:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    }]
})

const User=mongoose.model("User",userSchema);
export {User}