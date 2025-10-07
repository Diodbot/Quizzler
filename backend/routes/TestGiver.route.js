import { Router } from "express";
import { createTestGiver,submitTestGiverAnswers,getTestGiverById,getTestGiversByQuiz,getQuizForTestGiver   } from "../controllers/TestGiver.Controller.js";

const testGiverRouter = Router();
testGiverRouter.post("/start", createTestGiver);

testGiverRouter.post("/submit/:testGiverId", submitTestGiverAnswers);

testGiverRouter.get("/:testGiverId", getTestGiverById);

testGiverRouter.get("/by-quiz/:quizId", getTestGiversByQuiz);

testGiverRouter.get("/:testGiverId/quiz", getQuizForTestGiver);

export default testGiverRouter;
