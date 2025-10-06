import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // Your axios instance

const QuizTestGivers = () => {
  const { quizId } = useParams();
  const [testGivers, setTestGivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestGivers = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/quiz/${quizId}/getTestGiversByQuiz`);
        console.log("res",res.data.testGivers)
        setTestGivers(res.data.testGivers || []);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTestGivers();
  }, [quizId]);

  if (loading) return <p className="text-white">Loading test givers...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
 const formatDate = (dateString) => {
    if (!dateString) return "Not submitted";
    const date = new Date(dateString);
    return date.toLocaleString(); // e.g. "10/5/2025, 10:37:31 AM"
  };

  if (loading) return <p className="text-white">Loading test givers...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-white">Users who attempted this quiz</h2>
      {testGivers.length === 0 ? (
        <p className="text-white">No one has attempted this quiz yet.</p>
      ) : (
        <ul className="space-y-4">
          {testGivers.map(({ _id, firstName, lastName, email, score, submittedAt }) => (
            <li key={_id} className="bg-gray-800 p-4 rounded shadow text-white">
              <p><strong>Name:</strong> {firstName} {lastName}</p>
              <p><strong>Email:</strong> {email}</p>
              <p><strong>Score:</strong> {score}</p>
              <p><strong>Submitted At:</strong> {formatDate(submittedAt)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QuizTestGivers;
