import TestGiver from "../models/TestGiver.model.js";
import Quiz from "../models/Quiz.model.js";

// Start quiz for TestGiver
export const startQuizForTestGiver = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { firstName, lastName, email } = req.body;

    // Validate required fields
    if (!quizId || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "Quiz ID and all personal details are required",
      });
    }

    // Check quiz existence
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }

    // Check if this email already took this quiz (case-insensitive)
    let testGiver = await TestGiver.findOne({
      quiz: quizId,
      email: email.toLowerCase(),
    });

    if (testGiver) {
      // Already took quiz - block reattempt
      return res.status(400).json({
        success: false,
        message: "You have already taken this quiz",
        testGiverId: testGiver._id,
      });
    }

    // Create new TestGiver
    testGiver = new TestGiver({
      quiz: quizId,
      firstName,
      lastName,
      email: email.toLowerCase(),
      answers: [],
      score: 0,
      submittedAt: null, // explicitly mark as not submitted
    });
    await testGiver.save();

    // Prepare quiz without correct answers
    const quizObj = quiz.toObject();
    const questionsWithoutAnswers = quizObj.questions.map(({ _id, question, options }) => ({
      _id,
      question,
      options,
    }));

    // Respond with TestGiver ID and quiz data
    res.status(201).json({
      success: true,
      message: "Quiz started",
      testGiverId: testGiver._id,
      quiz: {
        _id: quizObj._id,
        title: quizObj.title,
        description: quizObj.description,
        timeLimit: quizObj.timeLimit,
        questions: questionsWithoutAnswers,
      },
    });
  } catch (error) {
    console.error("Error starting quiz:", error);
    if (error.code === 11000) {
      // Duplicate key error for unique index (email + quiz)
      return res.status(400).json({
        success: false,
        message: "You have already taken this quiz",
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Submit TestGiver answers and calculate score
export const submitTestGiverAnswers = async (req, res) => {
  try {
    const { testGiverId } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers are required",
      });
    }

    const testGiver = await TestGiver.findById(testGiverId).populate("quiz");
    if (!testGiver) {
      return res.status(404).json({
        success: false,
        message: "TestGiver not found",
      });
    }

    if (testGiver.submittedAt) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted this quiz",
        score: testGiver.score,
      });
    }

    const quiz = testGiver.quiz;
    let score = 0;

    // Calculate score by checking correctAnswer for each question
    const updatedAnswers = answers.map((ans) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === ans.questionId
      );
      const isCorrect = question
        ? question.correctAnswer === ans.selectedOption
        : false;
      if (isCorrect) score++;
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      };
    });

    // Save answers and score, mark submission time
    testGiver.answers = updatedAnswers;
    testGiver.score = score;
    testGiver.submittedAt = new Date();

    await testGiver.save();

    res.status(200).json({
      success: true,
      message: "Answers submitted successfully",
      score,
      answers: updatedAnswers,
    });
  } catch (error) {
    console.error("Error submitting answers:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get testGiver quiz results (without correct answers in questions)
export const getTestGiverResult = async (req, res) => {
  try {
    const { testGiverId } = req.params;

    const testGiver = await TestGiver.findById(testGiverId).populate("quiz");
    if (!testGiver) {
      return res.status(404).json({
        success: false,
        message: "TestGiver not found",
      });
    }

    const quiz = testGiver.quiz.toObject();
    const questionsWithoutAnswers = quiz.questions.map(({ _id, question, options }) => ({
      _id,
      question,
      options,
    }));

    res.status(200).json({
      success: true,
      testGiver: {
        _id: testGiver._id,
        firstName: testGiver.firstName,
        lastName: testGiver.lastName,
        email: testGiver.email,
        score: testGiver.score,
        submittedAt: testGiver.submittedAt,
        answers: testGiver.answers,
      },
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questions: questionsWithoutAnswers,
      },
    });
  } catch (error) {
    console.error("Error fetching test giver results:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
