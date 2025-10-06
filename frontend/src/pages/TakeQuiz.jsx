// src/pages/TakeQuiz.jsx

import { useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // your axios instance
import QuestionCard from '../component/QuestionCard';
import AnimatedButton from '../component/AnimatedButton';

const TakeQuiz = () => {
  const { quizId } = useParams();

  const [step, setStep] = useState(0); // 0 = user info form, 1+ = questions
  const [userInfo, setUserInfo] = useState({ firstName: '', lastName: '', email: '' });
  const [questions, setQuestions] = useState([]); // question objects from backend
  const [testGiverId, setTestGiverId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({}); // mapping question index → selected option index
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startQuiz = async () => {
    setError('');
    // basic validation
    if (!userInfo.firstName || !userInfo.lastName || !userInfo.email) {
      setError('All fields are required to start.');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
      };
      // call backend start route
      const res = await api.post(`/tests/quizzes/${quizId}/start`, payload);
      console.log('startQuiz response:', res.data);
      if (!res.data.success) {
        setError(res.data.message || 'Failed to start quiz');
        return;
      }
      setTestGiverId(res.data.testGiverId);
      // backend returns quiz object with questions inside `quiz`
      const quizObj = res.data.quiz;
      setQuestions(quizObj.questions || []);
      setStep(1);
    } catch (err) {
      console.error('Error in startQuiz:', err);
      setError(err.response?.data?.message || err.message || 'Failed to start quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (qIndex, optIndex) => {
    setSelectedOptions((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  const handleSubmit = async () => {
    if (!testGiverId) {
      setError('No quiz session active.');
      return;
    }
    try {
      setLoading(true);
      // prepare answers
      const answers = questions.map((q, idx) => ({
        questionId: q._id,
        selectedOption: q.options[selectedOptions[idx]],
      }));
      // submit answers
      await api.post(`/tests/testgivers/${testGiverId}/submit`, { answers });

      // fetch result
      const res2 = await api.get(`/tests/testgivers/${testGiverId}/result`);
      console.log('result response:', res2.data);
      if (!res2.data.success) {
        setError(res2.data.message || 'Failed to get result');
        return;
      }
      setResult(res2.data);
    } catch (err) {
      console.error('Error in submit:', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit quiz');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  if (error && step === 0) {
    // Show error on the info form screen
    // (you could also show on others, but this is simple placement)
  }

  // If we have a result, show result screen
  if (result) {
    const { score, testGiver, quiz } = result;
    // The backend may return result differently; adjust accordingly
    return (
      <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Your Result</h2>
        <p className="mb-6">Score: {testGiver.score} / {testGiver.answers.length}</p>
        <div className="space-y-4 w-full max-w-xl">
          {testGiver.answers.map((ans, idx) => (
            <div key={idx} className="p-4 bg-gray-800 rounded-lg">
              <h4 className="font-semibold">{quiz.questions[idx]?.question}</h4>
              <p>Your Answer: <span className="text-blue-400">{ans.selectedOption}</span></p>
              <p>Correct Answer: <span className="text-green-400">{ans.isCorrect ? ans.selectedOption : quiz.questions[idx]?.options.find(opt => opt !== ans.selectedOption)}</span></p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-8">
      {step === 0 ? (
        <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md space-y-4">
          <h2 className="text-2xl font-bold text-center mb-4">Enter your details to start</h2>
          <input
            type="text"
            placeholder="First Name"
            value={userInfo.firstName}
            onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
            className="w-full p-2 bg-gray-800 rounded"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={userInfo.lastName}
            onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
            className="w-full p-2 bg-gray-800 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={userInfo.email}
            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
            className="w-full p-2 bg-gray-800 rounded"
          />
          {error && <p className="text-red-400">{error}</p>}
          <AnimatedButton onClick={startQuiz} className="w-full mt-4">Start Quiz</AnimatedButton>
        </div>
      ) : (
        <div className="w-full max-w-xl space-y-6">
          {Array.isArray(questions) && questions.length > 0 ? (
            <QuestionCard
              question={questions[step - 1]}
              selected={selectedOptions[step - 1]}
              onSelect={(optIdx) => handleOptionSelect(step - 1, optIdx)}
            />
          ) : (
            <p className="text-center text-gray-400">No questions to display.</p>
          )}
          <div className="flex justify-between">
            {step > 1 && (
              <AnimatedButton onClick={() => setStep(step - 1)}>Previous</AnimatedButton>
            )}
            {Array.isArray(questions) && step < questions.length ? (
              <AnimatedButton onClick={() => setStep(step + 1)}>Next</AnimatedButton>
            ) : (
              <AnimatedButton onClick={handleSubmit}>Submit Quiz</AnimatedButton>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeQuiz;
