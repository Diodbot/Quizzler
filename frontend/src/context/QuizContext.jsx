import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api'; // import as 'api' to match usage below

const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   const fetchQuizzes = async () => {
//   setLoading(true);
//   try {
//     const res = await api.get('/quiz/my-quizzes');
//     console.log('Quizzes fetched:', res.data);
//     setQuizzes(res.data.quizzesDetails || []); // <-- fix here
//     setError(null);
//   } catch (err) {
//     setError(err.response?.data?.message || err.message || 'Failed to fetch quizzes');
//   } finally {
//     setLoading(false);
//   }
// };
const fetchQuizzes = async () => {
  setLoading(true);
  try {
    const res = await api.get('/quiz/my-quizzes');
    console.log('Quizzes fetched:', res.data);
    setQuizzes(res.data.quizzesDetails || []); // keep your existing key here
    setError(null);
  } catch (err) {
    // If 404, treat as no quizzes (empty array, no error)
    if (err.response && err.response.status === 404) {
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
    try {
      setLoading(true);
      await api.post('/quiz/create', quizData); // use api here
      await fetchQuizzes();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteQuiz = async (quizId) => {
    try {
      setLoading(true);
      await api.delete(`/quiz/delete/${quizId}`); // use api here
      await fetchQuizzes();
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateQuiz = async (quizId, quizData) => {
  try {
    setLoading(true);
    console.log('Updating quiz with data:', quizId, quizData);  // <--- add this
    await api.put(`/quiz/update/${quizId}`, quizData);
    await fetchQuizzes();
    setError(null);
  } catch (err) {
    console.error('Update quiz failed:', err.response?.data || err.message);
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};



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
