import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EditQuiz from './pages/EditQuiz';
import AuthPage from './pages/AuthPage';
import Navbar from './component/Navbar';
import { useAuth } from './context/AuthContext';
// import useAuth
import TakeQuiz from './pages/TakeQuiz';
import QuizTestGivers from './pages/QuizTestGivers';
import QuizzlerLanding from './pages/LandingPage';
import VerifyEmail from './pages/VerfiyEmail';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-white p-6">Loading...</div>;

  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const Layout = ({ children }) => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === '/landing' ||
    location.pathname.startsWith('/take-quiz/');

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

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/edit/:quizId"
            element={
              <PrivateRoute>
                <EditQuiz />
              </PrivateRoute>
            }
          />
            <Route path="/verify/:token" element={<VerifyEmail />} />
            <Route path="/reverify-email" element={<ReverifyEmail />} />
          <Route path="/reset-password" element={<SendResetPassword />} />
          <Route path="/reset-password/:token" element={<SetNewPassword />} />

          <Route path="/quiz/:quizId/test-givers" element={<QuizTestGivers />} />
          <Route path="/take-quiz/:quizId" element={<TakeQuiz />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
