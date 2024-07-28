import mongoose, { Types } from "mongoose";
import { types } from "util";

const chatSchema=new mongoose.Schema({
    userOne:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    userTwo:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    fUserOne:"string",
    lUserOne:"string",
    fuserTwo:"string",
    luserTwo:"string"

})
const Chat=mongoose.model("Chat",chatSchema);
export {Chat}