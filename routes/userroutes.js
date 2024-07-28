import { Router } from "express";
import {loadIndex,findUser,searchSuggestion,loadChat} from "../controllers/userControllers.js"
import {isAuthenticated} from "../middlewares/authentication.js"
const router=Router();
router.get("/",isAuthenticated,loadIndex)
router.get("/findSuggestions/:name",isAuthenticated,findUser,searchSuggestion);
router.get("/select/:userid",isAuthenticated,loadChat);



export default router