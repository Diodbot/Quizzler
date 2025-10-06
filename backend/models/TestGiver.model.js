import mongoose from "mongoose";


const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Quiz.questions",
  },
  selectedOption: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
}, { _id: false }); 


const TestGiverSchema = new mongoose.Schema({
     quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
    firstName:{
        type:String,
        required:[true,"first Name is required"],
       trim:true,
        minLength:2,
        maxLength:50,
    },
    lastName:{
         type:String,
        required:[true,"first Name is required"],
       trim:true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type:String,
        required:[true,'email is required for attempting the quiz'],
        trim:true,
         lowercase:true,
        minLength:6,
        maxLength:30,
        match:[/\S+@\S+\.\S+/,"Please fill a valid email address"]

    },
     answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    selectedOption: String,
    isCorrect: Boolean,
  }],
  score: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },

})

const TestGiver= mongoose.model("TestGiver",TestGiverSchema)
export default TestGiver
