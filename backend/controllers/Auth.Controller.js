
import User from "../models/User.model.js";
import bcrypt, { truncates } from "bcryptjs"
import  jwt  from "jsonwebtoken";
import crypto from "crypto";

import  dotenv  from "dotenv";
import sendEmail from "../utils/nodemailer.js";
dotenv.config()

const JWT_SECRET=process.env.JWT_SECRET
const SignUp=async(req,res,next)=>{
    try {
        const {username,email,password}=req.body;

const existingUser= await User.findOne({email});
    if(existingUser){
        throw new Error("User already exists Please login");
        
    }
    const saltRounds=10
   const salt = await bcrypt.genSaltSync(saltRounds);
const hashedpassword =await bcrypt.hash(password, salt);

 const rawToken = crypto.randomBytes(32).toString("hex");
 const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    
    const data= await User.create({
      username,
      email,
      password: hashedpassword,
      verificationToken: hashedToken,
      verificationTokenExpires: Date.now() + 10 * 60 * 1000, 
    });



    //  const verifyUrl = `http://localhost:5500/api/v1/auth/verify-email/${rawToken}`; 
    const verifyUrl = `https://quizzlerfrontend.onrender.com/verify/${rawToken}`;


    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<p>Hi ${username}, please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`,
    });


   const token= jwt.sign({userId:data._id,
    role:'Creator'
   },JWT_SECRET,{expiresIn:"1d"})
  res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true only on prod (HTTPS)
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
});

     res.status(201).json({
            success:true,
            message:'user created Successfully',
            data:{
                token,
                user:data

            }
            
        })
        
    } catch (error) {
        console.log("error while sign up",error)
        
    }
    
    

}
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User does not exist, please sign up or register",
      });
    }

    if (!existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is not verified. Verify Email first",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

   const token= jwt.sign({userId:existingUser._id,
    role:'Creator'
   },JWT_SECRET,{expiresIn:"1d"})

    

    const userInfo = {
      userId: existingUser._id,
      email: existingUser.email,
      
    };
    res.cookie('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true only on prod (HTTPS)
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
});

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        
        user: userInfo,
      },
    });
  } catch (error) {
    next(error); 
  }
};

const logout = async (req, res) => {
  try {
    
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'strict',
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error during logout" });
  }
};



const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Hash token from params to match DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find user with this token & check if token expired
    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationTokenExpires: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }
     

    // Mark user as verified
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;

    await user.save();

    // Create JWT after verification
    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: {
        token: jwtToken,
        user,
      },
    });
  } catch (error) {
    console.error("Verify email error:", error);
    res.status(500).json({ success: false, message: "Verification failed", error: error.message });
  }
};
const reverifyEmail=async(req,res)=>{
    try {
        const { email } = req.body;
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            throw new Error("Email doesnt exist signup first")
        }
         if (existingUser.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. You can log in.",
      });
    }


        const rawToken = crypto.randomBytes(32).toString("hex");
        const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
        // const user = await existingUser.update({
        //     verificationToken: hashedToken,
        //     verificationTokenExpires: Date.now() + 10 * 60 * 1000,

        // })//dont use update
        existingUser.verificationToken = hashedToken;
    existingUser.verificationTokenExpires = Date.now() + 10 * 60 * 1000;
   const user= await existingUser.save();
        const verifyUrl = `https://quizzlerfrontend.onrender.com/verify/${rawToken}`;

        

        await sendEmail({
            to: email,
            subject: "Verify your email",
            html: `<p>Hi ${existingUser.username}, please verify your email by clicking <a href="${verifyUrl}">here</a>.</p>`,
        });

        res.status(201).json({
            success:true,
            message:'Re verify Email sent Successfully',
            data:{
               
                user

            }
            
        })


    } catch (error) {
        console.log(error)
        
    }

    
}

const sendResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist. Sign up first",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    // const resetPassUrl = `http://localhost:5500/api/v1/auth/resetpassword/${rawToken}`;
    // const resetPassUrl = `http://localhost:5173/reset-password/${rawToken}`; 
    const resetPassUrl = `https://quizzlerfrontend.onrender.com/reset-password/${rawToken}`;




    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `<p>Hi ${user.username}, click <a href="${resetPassUrl}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({
      success: true,
      message: "Reset password email sent",
    });
  } catch (error) {
    console.error("sendResetPassword error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};


const resetpassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSaltSync(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    const jwtToken = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "1d" });

    await sendEmail({
      to: user.email,
      subject: "Password reset successful",
      html: `<p>Hi ${user.username}, your password has been successfully reset.</p>`,
    });

    const { password: _, resetPasswordToken, resetPasswordExpires, ...safeUser } = user._doc;

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
      data: {
        token: jwtToken,
        user: safeUser,
      },
    });
  } catch (error) {
    console.error("resetpassword error:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

export {SignUp,login,verifyEmail,reverifyEmail,sendResetPassword,resetpassword,logout}