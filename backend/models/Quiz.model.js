import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, "Question text is required"],
    trim: true,
  },
  options: {
    type: [String],
    validate: [arr => arr.length >= 2, "At least two options are required"],
  },
  correctAnswer: {
    type: String,
    required: [true, "Correct answer is required"],
  },
},); 

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Quiz title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  questions: {
    type: [questionSchema],
    validate: [arr => arr.length > 0, "Quiz must have at least one question"],
  },
  timeLimit: {
    type: Number,
    required: [true, "Time limit is required"],
    min: [30, "Time limit should be at least 30 seconds"],
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  TestGivers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "TestGiver",
  }],
}, {
  timestamps: true,
});

const Quiz = mongoose.model("Quiz", quizSchema);
export default Quiz;
