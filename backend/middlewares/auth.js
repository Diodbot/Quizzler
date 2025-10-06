import  jwt  from "jsonwebtoken";
import dotenv from "dotenv";


dotenv.config();
// const authmiddleware=async(req,res,next)=>{
//     try {
//         const token=req.cookie.token;
//         if(!token){
//             return res.status(404).json({
//                 success:false,
//                 message:"token not found "
//             });
//         }
//         const decoded =  jwt.verify(token,process.env.JWT_SECRET)
//         if(!decoded){
//    return res.status(400).json({
//                 success:false,
//                 message:"Token is invalid please login or signup"
//             });

//         }
//         const role=decoded;
//         if(role!=='creator'){
//              return res.status(400).json({
//                 success:false,
//                 message:"Unauthorized user"
//             });

//         }
//          req.user = decoded.userId;
//         next();
//     } catch (error) {
//         console.log("Error while verifying the token");
//         return res.status(500).json({
//             success:false,
//             message:"INTERNAL ERROR : Token"
//         })
//     }
// }


const authmiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid, please login or signup",
      });
    }

    const { userId, role } = decoded;

    if (role.toLowerCase() !== 'creator') {
      return res.status(403).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    req.user = { userId, role };

    next();
  } catch (error) {
    console.error("Error while verifying the token:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error: token verification failed",
    });
  }
};


export default authmiddleware;
