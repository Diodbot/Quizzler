
import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api'; // Axios instance with withCredentials: true

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true); // true on initial load
  const [error, setError] = useState(null);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get('/quiz/my-quizzes');
      console.log('✅ Quizzes fetched:', res.data);
      setQuizzes(res.data.quizzesDetails || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 404) {
        // Treat 404 as no quizzes
        setQuizzes([]);
        setError(null);
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to fetch quizzes');
      }
    } finally {
      setLoading(false);
    }
  };

  const createQuiz = async (quizData) => {
    setLoading(true);
    try {
      await api.post('/quiz/create', quizData);
      await fetchQuizzes();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId) => {
    setLoading(true);
    try {
      await api.delete(`/quiz/delete/${quizId}`);
      await fetchQuizzes();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (quizId, quizData) => {
    setLoading(true);
    try {
      console.log('🔄 Updating quiz:', quizId, quizData);
      await api.put(`/quiz/update/${quizId}`, quizData);
      await fetchQuizzes();
      setError(null);
    } catch (err) {
      console.error('❌ Update quiz failed:', err.response?.data || err.message);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch quizzes on provider mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        loading,
        error,
        createQuiz,
        deleteQuiz,
        updateQuiz,
        fetchQuizzes,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => useContext(QuizContext);
