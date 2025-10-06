import Quiz from "../models/Quiz.model.js";
import User from "../models/User.model.js";

const createQuiz=async(req,res)=>{
    try {

        
        const {title,description,questions,timeLimit} = req.body;
        const {userId}=req.user;
        
        if(!title || !timeLimit ||!userId ){
           return res.status(400).json({
            success:false,
            message:"All fields are required"
           });
        }
        if(!Array.isArray(questions) ||questions.length === 0){
            return res.status(400).json({
            success:false,
            message:"Questions are required"
           });
        }
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
            success:false,
            message:"User not found"
           });
        }
       const newQuiz= await Quiz.create({title,timeLimit,questions,description,creator:userId});
        console.log("Quiz created successfully");
        user.quizzes.push(newQuiz?._id);
        await user.save();
        return res.status(200).json({
            success:true,
            message:"Quiz created successfully",
             QuizId: newQuiz?._id
           });

        
        
    } catch (error) {
        console.log("Error while creating the quiz",error);
       return res.status(500).json({
        success:false,
        message:"INTERNAL ERROR :creating of Quiz"
       })
    }
}

// const deleteQuiz=async(req,res)=>{
//     try {
//         const {userId}=req.user;
//         const {QuizId}=req.body;
//         if(!QuizId || !userId){
//              return res.status(400).json({
//             success:false,
//             message:"All fields are required"
//            });
//         }
//         const user=await User.findById(userId);
//         if(!user){
//              return res.status(404).json({
//             success:false,
//             message:"user not found"
//            });
//         }
//         const quizDetails=await Quiz.findById(QuizId);
//         if(quizDetails.creator.toString()!==userId.toString()){
//             return res.status(400).json({
//             success:false,
//             message:"this quiz does not belong to this user"
//            });
//         }
//         await Quiz.findByIdAndDelete(QuizId);
 

//        user.quizzes.pull(QuizId);
//         await user.save();
//          return res.status(200).json({
//             success:true,
//             message:"Quiz deleted successfully"
//            });

        
//     } catch (error) {
//   console.error("Error while deleting the quiz:", error);
//   return res.status(500).json({
//     success: false,
//     message: "INTERNAL ERROR: Deletion of Quiz",
//   });
//     }
// }
const deleteQuiz = async (req, res) => {
  try {
    const { userId } = req.user;
    const { quizId } = req.params; 

    if (!quizId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID and user ID are required"
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const quizDetails = await Quiz.findById(quizId);
    if (!quizDetails) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found"
      });
    }

    if (quizDetails.creator.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "This quiz does not belong to this user"
      });
    }

    await Quiz.findByIdAndDelete(quizId);

    user.quizzes.pull(quizId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully"
    });

  } catch (error) {
    console.error("Error while deleting the quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during quiz deletion"
    });
  }
};


const getAllQuizBelongingUser=async(req,res)=>{
    try {
        
        const {userId}=req.user;
        if(!userId){
       return res.status(400).json({
        success:false,
        message:"user id invalid"
       })
        }
        const quizzesDetails=await Quiz.find({creator:userId});
        if(!Array.isArray(quizzesDetails) || quizzesDetails.length===0){
             return res.status(404).json({
        success:false,
        message:"No Quizzes found"
       })
        }
         return res.status(200).json({
        success:true,
        message:"All quiz found successfully",
       quizzesDetails

       })
    } catch (error) {
        console.log("Error while getting all the quizes",error);
       return res.status(500).json({
        success:false,
        message:"INTERNAL ERROR :Getting All Quiz"
       })
    }
}


// const updateQuiz=async(req,res)=>{
//     try {
//         const {quizId,title,description,questions,timeLimit}=req.body;
//         const {userId}=req.user;
//         if(!quizId || !title || !timeLimit ||!userId){
//             return res.status(400).json({
//                 success: false,
//                 message: "All fields are required"
//             });
//         }
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "user not found"
//             });
//         }
//         const quizDetails = await Quiz.findById(quizId);
//           if(quizDetails.creator.toString()!==userId.toString()){
//             return res.status(400).json({
//             success:false,
//             message:"this quiz does not belong to this user"
//            });
//         }
//         quizDetails.title = title;
//     quizDetails.description = description;
//     quizDetails.timeLimit = timeLimit;
//     if (questions && questions.length > 0) {
//       quizDetails.questions = questions;
//     }
//         await quizDetails.save();
//         return res.status(200).json({
//             success:true,
//             message:"Quiz updated successfully"
//            });

//     } catch (error) {
//           console.log("Error while updating the quiz",error);
//        return res.status(500).json({
//         success:false,
//         message:"INTERNAL ERROR :Updating  Quiz"
//        })
//     }
// }
const updateQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;  
    const { title, description = '', questions, timeLimit } = req.body;
    const { userId } = req.user;

    // Validate required fields
    if (!quizId || !title || !timeLimit || !userId) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID, title, timeLimit, and user ID are required",
      });
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find quiz
    const quizDetails = await Quiz.findById(quizId);
    if (!quizDetails) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check ownership
    if (quizDetails.creator.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "This quiz does not belong to this user",
      });
    }

    // Validate questions array if provided
    if (questions && questions.length > 0) {
      for (const q of questions) {
        if (
          !q.question ||
          !Array.isArray(q.options) ||
          q.options.length < 2 ||
          !q.correctAnswer ||
          !q.options.includes(q.correctAnswer)
        ) {
          return res.status(400).json({
            success: false,
            message: "Invalid question format in questions array",
          });
        }
      }
      quizDetails.questions = questions;
    }

    // Update other fields
    quizDetails.title = title;
    quizDetails.description = description;
    quizDetails.timeLimit = timeLimit; // make sure timeLimit is in seconds or as per your business logic

    // Save updated quiz
    await quizDetails.save();

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz: quizDetails,
    });
  } catch (error) {
    console.error("Error while updating the quiz:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while updating quiz",
    });
  }
};


// const getParticularQuiz=async(req,res)=>{
//     try {
        
//     } catch (error) {
//           console.log("Error while getting particular quiz",error);
//        return res.status(500).json({
//         success:false,
//         message:"INTERNAL ERROR :Getting Particular Quiz"
//        })
//     }
// }

export {createQuiz,updateQuiz,deleteQuiz,getAllQuizBelongingUser}