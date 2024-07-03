//imports
import { Router } from "express";
import {loadLogin,redirectUser,clearToken,loadSignup,redirectVerify,loadVerify,usernameVerified,loadDetails,putDetails} from "../controllers/authControllers.js"


const router=Router();

router.get("/login",loadLogin);
router.post("/login",redirectUser);
router.get("/logout",clearToken);
router.get("/signup",loadSignup);
router.post("/signup",redirectVerify);
router.get("/verify",loadVerify);
router.post("/verify",usernameVerified);
router.get("/details",loadDetails)
router.post("/details",putDetails)




export default router;