import { Router } from "express";
import {loadIndex,findUser,loadChat} from "../controllers/userControllers.js"
import {isAuthenticated} from "../middlewares/authentication.js"
const router=Router();
router.get("/",isAuthenticated,loadIndex)
router.get("/find/:name",isAuthenticated,findUser)
router.get("/select/:userid",isAuthenticated,loadChat);



export default router