import Router from "express";
import {
  startQuizForTestGiver,
  submitTestGiverAnswers,
  getTestGiverResult,
} from "../controllers/NewTestGiver.Controller.js";

const tester=Router();
tester.post("/quizzes/:quizId/start", startQuizForTestGiver);

// 2. Submit answers for the test giver
// POST /api/testgivers/:testGiverId/submit
tester.post("/testgivers/:testGiverId/submit", submitTestGiverAnswers);

// 3. Get results for the test giver (quiz + score + answers, no correct answers in questions)
// GET /api/testgivers/:testGiverId/result
tester.get("/testgivers/:testGiverId/result", getTestGiverResult);

export default tester;