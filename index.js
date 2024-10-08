//imports
import express from "express";
import { createServer } from "http";
import { configDotenv } from "dotenv";
import authroutes from "./routes/authroutes.js"
import { connectDb } from "./config/connectMongo.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import userroutes from "./routes/userroutes.js"
import {Server} from "socket.io";
import { User } from "./models/user.js";
import { handleMsg } from "./controllers/userControllers.js";
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors'
configDotenv();



// creating app  

const app=express();

const server =createServer(app);

app.use(cors({ origin:`${process.env.FRONTEND_URI}`, credentials: true  }));


const io = new Server(server, {
  cors: {
    origin: `${process.env.FRONTEND_URI}`, // Replace with your React app URL
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true // Allow credentials (cookies, authorization headers)
  }
});




io.on("connection",(socket)=>{
    console.log(socket.id,"connected to react ")
    const socketid=socket.id;
    socket.on("login",({userid})=>{
        User.findByIdAndUpdate(userid,{
            socketid
        }).then(()=>{
            console.log("socketId updated:::",socketid)
        }).catch((e)=>console.log(e));
    })
    socket.on('privateMsg',({data})=>{
        handleMsg(data,socket);
    })

    socket.on('disconnect', () => {

        console.log('A user disconnected:', socketid);
        User.findOne({socketid}).then((user)=>{
            console.log(user.socketid,"varkhar ko ma hai")
            console.log(user)
            user.socketid=null;
            return user.save();
            
        }).then(()=>console.log("socketId cleared"))
        .catch((e)=>console.log(e));
    })    


})
export {io}


// connecting database 
connectDb();

//setting view engine 
app.set("view engine","ejs")

// using  public for static 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));



app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/",authroutes)
app.use("/",userroutes)




//listening to the server 
server.listen(process.env.PORT,()=>{
    
    console.log("server running on Port:",process.env.PORT)
})


