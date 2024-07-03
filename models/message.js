
import mongoose from "mongoose";


const messageSchema=new mongoose.Schema({


    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Chat'
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    message:'string',

} ,{ timestamps: true })

const Message=mongoose.model("Message",messageSchema)

export {Message}
