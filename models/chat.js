import mongoose, { Types } from "mongoose";
import { types } from "util";

const chatSchema=new mongoose.Schema({
    userOne:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    UserTwo:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    fUserOne:"string",
    lUserOne:"string",
    fUserTwo:"string",
    lUserTwo:"string"

})
const Chat=mongoose.model("Chat",chatSchema);
export {Chat}