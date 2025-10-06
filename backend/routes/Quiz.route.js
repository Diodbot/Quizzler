import { Router } from "express";
import { createQuiz,updateQuiz,deleteQuiz,getAllQuizBelongingUser } from "../controllers/Quiz.Controller.js";
import authmiddleware from "../middlewares/auth.js";
import { getTestGiversByQuiz } from "../controllers/TestGiver.Controller.js";
const quizRouter = Router();

quizRouter.post("/create", authmiddleware, createQuiz);

quizRouter.delete('/delete/:quizId', authmiddleware, deleteQuiz);

quizRouter.get("/my-quizzes", authmiddleware, getAllQuizBelongingUser);

quizRouter.put('/update/:quizId', authmiddleware, updateQuiz);
quizRouter.get('/:quizid/getTestGiversByQuiz',authmiddleware,getTestGiversByQuiz);
    
export default quizRouter;