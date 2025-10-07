import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditQuiz from './pages/EditQuiz';
import AuthPage from './pages/AuthPage';
import Navbar from './component/Navbar';
import { useAuth } from './context/AuthContext';
import TakeQuiz from './pages/TakeQuiz';
import QuizTestGivers from './pages/QuizTestGivers';
import QuizzlerLanding from './pages/LandingPage';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return token ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="text-white p-6">Loading...</div>;
  }

  return !token ? children : <Navigate to="/dashboard" />;
};

// Layout component with conditional Navbar
const Layout = ({ children }) => {
  const location = useLocation();

  // Hide Navbar only on landing page
  const hideNavbar = location.pathname === '/landing' || location.pathname === '/take-quiz/:quizId' ;

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/landing" />} />

          <Route path="/landing" element={<QuizzlerLanding />} />

          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* Dashboard (protected, only for logged-in users) */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          {/* Edit quiz page (protected) */}
          <Route
            path="/edit/:quizId"
            element={
              <PrivateRoute>
                <EditQuiz />
              </PrivateRoute>
            }
          />

          {/* Quiz test givers page */}
          <Route path="/quiz/:quizId/test-givers" element={<QuizTestGivers />} />

          {/* Take quiz page */}
          <Route path="/take-quiz/:quizId" element={<TakeQuiz />} />
          
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
