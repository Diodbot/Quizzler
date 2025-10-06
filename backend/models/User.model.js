import mongoose, { Types } from "mongoose";

const userSchema= new mongoose.Schema({
  
    username:{
        type:String,
        required:[true,"username is required"],
        trim:true,
        minLength:2,
        maxLength:50,
    },
     email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        trim:true,
        lowercase:true,
        minLength:6,
        maxLength:30,
        match:[/\S+@\S+\.\S+/,"Please fill a valid email address"]

    },
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:8,
        

    },
    isVerified: {
  type: Boolean,
  default: false,
},
verificationToken: {
  type: String,
},
verificationTokenExpires: {
  type: Date,
},
resetPasswordToken: {
  type: String,
},
resetPasswordExpires: {
  type: Date,
},
quizzes: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Quiz'
}]





},{timestamps:true}
   
)


const User= mongoose.model("User",userSchema)
export default User