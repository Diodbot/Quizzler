import TestGiver from "../models/TestGiver.model.js"; // adjust path
import Quiz from "../models/Quiz.model.js";

// const quiz = testGiver.quiz; // populated with questions
// const testGiver = await TestGiver.findById(testGiverId).populate({
//   path: 'quiz',
//   select: 'questions'
// });

export const createTestGiver = async (req, res) => {
  try {
    const { quizId, firstName, lastName, email } = req.body;

    if (!quizId || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Optional: Check if quiz exists
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const newTestGiver = new TestGiver({
      quiz: quizId,
      firstName,
      lastName,
      email,
      answers: [],
      score: 0,
    });

    await newTestGiver.save();

    res.status(201).json({
      success: true,
      message: "TestGiver created, quiz attempt started",
      testGiver: newTestGiver,
    });
  } catch (error) {
    console.error("Error creating TestGiver:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const submitTestGiverAnswers = async (req, res) => {
  try {
    const { testGiverId } = req.params;
    const { answers } = req.body; // expected: [{ questionId, selectedOption }]

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers array is required",
      });
    }

    // Find test giver record
    const testGiver = await TestGiver.findById(testGiverId).populate('quiz');
    if (!testGiver) {
      return res.status(404).json({
        success: false,
        message: "TestGiver not found",
      });
    }

    const quiz = await Quiz.findById(testGiver.quiz).lean();
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Associated quiz not found",
      });
    }

    // Calculate score
    let score = 0;
    const updatedAnswers = answers.map((ans) => {
      const question = quiz.questions.find(q => q._id.toString() === ans.questionId);
      const isCorrect = question ? question.correctAnswer === ans.selectedOption : false;
      if (isCorrect) score++;
      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        isCorrect,
      };
    });

    // Update testGiver document
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
      message: "Internal Server Error",
    });
  }
};
export const getTestGiverById = async (req, res) => {
  try {
    const { testGiverId } = req.params;

    const testGiver = await TestGiver.findById(testGiverId).populate('quiz', 'title description');
    if (!testGiver) {
      return res.status(404).json({
        success: false,
        message: "TestGiver not found",
      });
    }

    res.status(200).json({
      success: true,
      testGiver,
    });
  } catch (error) {
    console.error("Error fetching TestGiver:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const getTestGiversByQuiz = async (req, res) => {
  try {
    const { quizid } = req.params;  // Make sure this matches your route param exactly

    // Find all test givers who attempted the quiz
    const testGivers = await TestGiver.find({ quiz: quizid });

    res.status(200).json({
      success: true,
      testGivers,
    });
  } catch (error) {
    console.error("Error fetching test givers:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




export const getQuizForTestGiver = async (req, res) => {
  try {
    const { testGiverId } = req.params;

    const testGiver = await TestGiver.findById(testGiverId).populate('quiz');
    if (!testGiver) {
      return res.status(404).json({
        success: false,
        message: "TestGiver not found",
      });
    }

    const quiz = testGiver.quiz.toObject(); // convert mongoose doc to plain object

    if (!quiz || !quiz.questions) {
      return res.status(404).json({
        success: false,
        message: "Quiz or questions not found",
      });
    }

    const questionsWithoutAnswers = quiz.questions.map(({ _id, question, options }) => ({
      _id,
      question,
      options,
    }));

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        timeLimit: quiz.timeLimit,
        questions: questionsWithoutAnswers,
      },
    });
  } catch (error) {
    console.error("Error fetching quiz for test giver:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
// GET /api/quizzes/:quizId

// export const getQuizById = async (req, res) => {
//   try {
//     const { quizId } = req.params;

//     const quiz = await Quiz.findById(quizId).lean(); // .lean() for plain JS object
//     if (!quiz) {
//       return res.status(404).json({
//         success: false,
//         message: "Quiz not found",
//       });
//     }

//     // 🔐 Remove correctAnswer from each question
//     const sanitizedQuestions = quiz.questions.map(q => ({
//       _id: q._id,
//       questionText: q.questionText,
//       options: q.options,
//     }));

//     res.status(200).json({
//       success: true,
//       quiz: {
//         _id: quiz._id,
//         title: quiz.title,
//         description: quiz.description,
//         timeLimit: quiz.timeLimit,
//         questions: sanitizedQuestions,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching quiz:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };
