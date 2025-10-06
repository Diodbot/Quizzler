import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useQuiz } from '../context/QuizContext';
import QuizCreation from '../component/QuizCreation';

const EditQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { quizzes, updateQuiz } = useQuiz();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const found = quizzes.find((q) => q._id === quizId);
    if (found) {
      // Convert backend data to QuizCreation format with timeLimit in minutes
      const transformed = {
        ...found,
        timeLimit: found.timeLimit ? Math.floor(found.timeLimit / 60) : 30, // seconds to minutes
        questions: found.questions.map((q) => ({
          text: q.question,
          options: q.options,
          correctOption: q.options.findIndex(opt => opt === q.correctAnswer),
        })),
      };
      setQuiz(transformed);
    }
  }, [quizzes, quizId]);

 const handleUpdate = async (data) => {
  console.log('handleUpdate received data:', data);

  if (!Array.isArray(data.questions)) {
    alert('Questions must be an array.');
    return;
  }

  // Validate and transform questions (backend format)
  const validQuestions = data.questions.filter((q, idx) => {
    if (
      !q.question ||
      typeof q.question !== 'string' ||
      q.question.trim() === ''
    ) {
      console.warn(`Question ${idx} is missing 'question' text or invalid.`);
      return false;
    }
    if (!Array.isArray(q.options) || q.options.length < 2) {
      console.warn(`Question ${idx} does not have at least two options.`);
      return false;
    }
    if (
      !q.correctAnswer ||
      typeof q.correctAnswer !== 'string' ||
      !q.options.includes(q.correctAnswer)
    ) {
      console.warn(`Question ${idx} has invalid correctAnswer.`);
      return false;
    }
    // All good
    return true;
  });

  if (validQuestions.length === 0) {
    alert('You must provide at least one valid question with at least two options.');
    return;
  }

  // Make sure to trim question text and options
  const cleanedQuestions = validQuestions.map(q => ({
    question: q.question.trim(),
    options: q.options.map(opt => opt.trim()),
    correctAnswer: q.correctAnswer.trim(),
  }));

  // Validate title
  const title = data.title?.trim();
  if (!title) {
    alert('Title is required.');
    return;
  }

  // Validate timeLimit (seconds)
  let timeLimit = Number(data.timeLimit);
  if (isNaN(timeLimit) || timeLimit < 30) {
    timeLimit = 30;
  }

  const transformedData = {
    title,
    description: data.description ? data.description.trim() : '',
    timeLimit,
    questions: cleanedQuestions,
  };

  console.log('Sending update data:', transformedData);

  try {
    await updateQuiz(quizId, transformedData);
    navigate('/');
  } catch (err) {
    alert('Failed to update quiz: ' + (err.message || 'Unknown error'));
    console.error(err);
  }
};


  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl mb-4">Edit Quiz</h1>
      {quiz ? (
        <QuizCreation onSubmit={handleUpdate} initialData={quiz} />
      ) : (
        <p>Loading quiz...</p>
      )}
    </div>
  );
};

export default EditQuiz;
