//imports
import { Router } from "express";
import {redirectUser,register} from "../controllers/authControllers.js"


const router=Router();

router.post("/login",redirectUser);
router.post("/register",register)




export default router;