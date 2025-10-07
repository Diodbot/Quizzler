import { Router } from "express";
import { SignUp,login,logout,verifyEmail,reverifyEmail,sendResetPassword,resetpassword } from "../controllers/Auth.Controller.js";
import authmiddleware from "../middlewares/auth.js";
const authRouter=Router();
authRouter.post("/signup", SignUp);
authRouter.post("/login", login);
authRouter.post("/logout",authmiddleware,logout);
authRouter.get("/verify-email/:token", verifyEmail);
authRouter.post("/reverify-email", reverifyEmail);
authRouter.post("/forgot-password", sendResetPassword);
authRouter.post("/reset-password/:token", resetpassword);

export default  authRouter


