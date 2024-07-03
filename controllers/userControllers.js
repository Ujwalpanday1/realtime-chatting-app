import { User } from "../models/user.js"
import {Chat} from "../models/chat.js"
import { Message } from "../models/message.js"


let handleMsg=(data,socket)=>{

    User.findById(data.receiver).then((receiver)=>{
        console.log(receiver.socketid)
        socket.to(receiver.socketid).emit("receivePrivateMsg",{message:data.message})
    })

Chat.findOne({userOne:data.sender,UserTwo:data.receiver}).then((chat)=>{
    if(chat){
        Message.create({
            message:data.message,sender:data.sender,receiver:data.receiver,chatId:chat._id
        })
    }
    else{
        Chat.findOne({userOne:data.receiver,UserTwo:data.sender}).then((chat)=>{
            if(chat){
                Message.create({
                    message:data.message,sender:data.sender,receiver:data.receiver,chatId:chat._id
                })
            }
            else{
                User.findById(data.sender)
                Chat.create({
                    userOne:data.sender,UserTwo:data.receiver,
                }).then((chat)=>{

                    User.findByIdAndUpdate(data.sender,{
                       $push:{chat:chat._id} 
                    },{new: true}).then(()=>{console.log("chat id added to sender")})
                    .catch((e)=>{console.log(e)})
                    User.findByIdAndUpdate(data.receiver,{
                        $push:{chat:chat._id} 
                    },{new: true}).then(()=>{console.log("chat id added to receiver")})
                    .catch((e)=>{console.log(e)})
                    Message.create({
                        message:data.message,sender:data.sender,receiver:data.receiver,chatId:chat._id
                    })
                })
    
            }
        }).catch((e)=>console.log(e))

    }
}).catch((e)=>console.log(e))

}



const loadIndex=(req,res)=>{
    User.findOne({_id:req.user._id}).then((user)=>{
        Chat.find({userOne:user._id}).then((chatArray)=>{
            if(chatArray)
             res.render("index",{user:user,chatArray:chatArray})
            else{
                Chat.find({userTwo:user._id}).then((chatArray)=>{

                     res.render("index",{user:user,chatArray:chatArray})
                })
            }

        }).catch((e)=>console.log(e))
        
    }).catch((e)=>{
        res.redirect("/")
    })
   
}

const findUser=(req,res)=>{
    const {name}=req.params
    const [fName,lName]=name.split(" ")
   
    User.find({
        fName: { $regex: new RegExp(fName, 'i') },
        lName: { $regex: new RegExp(lName, 'i') }
    }).then((userArray)=>{
        res.render("searchResult",{userArray:userArray})

    }).catch((e)=>console.log(e))
}

const loadChat=(req,res)=>{
    const {userid}=req.params
    User.findById(userid).then((user)=>{
        Chat.findOne({userOne:req.user._id, UserTwo:userid}).then((chat)=>{
            if(chat){
                Message.find({chatId:chat._id}).then((messageArray)=>{

                    res.render("chatBox",{receiver:user,messageArray:messageArray,sender:req.user})
                })
            }
            else{
                Chat.findOne({userOne:userid, UserTwo:req.user._id}).then((chat)=>{
                    if(chat){
                        Message.find({chatId:chat._id}).then((messageArray)=>{
        
                            res.render("chatBox",{receiver:user,messageArray:messageArray,sender:req.user})
                        })
                    }
                    else{

                        res.render("chatBox",{receiver:user,messageArray:["No messages"],sender:req.user})
                    }
                }).catch((e)=>console.log(e))
            }
            
        }).catch((e)=>console.log(e))
        
    })
    .catch((e)=>{
        console.log(e)
    
    })
}



export {loadIndex,findUser,loadChat,handleMsg}