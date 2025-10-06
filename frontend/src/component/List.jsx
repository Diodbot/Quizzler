import { useEffect } from 'react';
import { useQuiz } from '../context/QuizContext';
import { Link, useNavigate } from 'react-router-dom';

const List = () => {
  const { quizzes, deleteQuiz, fetchQuizzes, loading, error } = useQuiz();
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleShare = (quizId) => {
    const frontendUrl = `https://quizzlerfrontend.onrender.com/take-quiz/${quizId}`;
    navigator.clipboard.writeText(frontendUrl)
      .then(() => alert('Quiz link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  };

  if (loading) return <p className="text-white">Loading...</p>;

  if (error) return <p className="text-red-500">Error: {error}</p>;
if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-white flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4 text-xl">You have no quizzes yet. Create one!</p>
        <button
          onClick={() => navigate('/create')} // adjust the route to your quiz creation page
          className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          Create New Quiz
        </button>
      </div>
    );
  }


   return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {quizzes.map((quiz) => (
        <div key={quiz._id} className="bg-gray-900 p-6 rounded-lg shadow-lg flex flex-col justify-between">
          <h3 className="text-xl font-semibold mb-4">{quiz.title}</h3>

          <div className="space-x-3 mt-auto">
            <Link to={`/edit/${quiz._id}`} className="text-blue-400 hover:underline">
              Edit
            </Link>

            <button onClick={() => deleteQuiz(quiz._id)} className="text-red-400 hover:underline">
              Delete
            </button>

            <button onClick={() => handleShare(quiz._id)} className="text-green-400 hover:underline">
              Share
            </button>

            <button
              onClick={() => navigate(`/quiz/${quiz._id}/test-givers`)}
              className="text-yellow-400 hover:underline"
            >
              View Test Givers
            </button>
          </div>
        </div>
      ))}
    </div>
  );

};

export default List;
