import { Router } from "express";
import { SignUp,login,logout } from "../controllers/Auth.Controller.js";
import authmiddleware from "../middlewares/auth.js";
const authRouter=Router();
authRouter.post("/signup", SignUp);
authRouter.post("/login", login);
authRouter.post("/logout",authmiddleware,logout);

export default  authRouter


// router.get("/verify-email/:token", verifyEmail);
// router.post("/reverify-email", reverifyEmail);
// router.post("/forgot-password", sendResetPassword);
// router.post("/reset-password/:token", resetpassword);