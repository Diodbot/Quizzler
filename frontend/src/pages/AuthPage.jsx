
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../component/AuthCard';
import axios from 'axios';

const AuthPage = () => {
  const { login, signup, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showReverify, setShowReverify] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrorMessage('');
    setShowReverify(false);
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setShowReverify(false);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(username, email, password);
        setInfoMessage("✅ Signed up! Please check your email to verify your account.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Something went wrong";
      setErrorMessage(msg);

      // Check for "Email is not verified" message
      if (msg.toLowerCase().includes("not verified")) {
        setShowReverify(true);
      }
    }
  };

  const handleReverify = async () => {
    setErrorMessage('');
    setInfoMessage('');
    try {
      const res = await axios.post('https://quizzlerbackend.onrender.com/api/v1/auth/reverify-email', {
        email,
      });
      setInfoMessage('📧 Verification email sent again. Check your inbox.');
      setShowReverify(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to resend verification email";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <AuthCard
        title={isLogin ? 'Login to your account' : 'Create a new account'}
        footer={
          isLogin ? (
            <>
              Don’t have an account?{' '}
              <button onClick={toggleMode} className="text-blue-400 hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={toggleMode} className="text-green-400 hover:underline">
                Log in
              </button>
            </>
          )
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4 relative">
          {!isLogin && (
            <input
              className="w-full p-2 bg-gray-800 rounded text-white placeholder-gray-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          )}
          <input
            className="w-full p-2 bg-gray-800 rounded text-white placeholder-gray-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <div className="relative">
            <input
              className="w-full p-2 bg-gray-800 rounded text-white placeholder-gray-500 pr-10"
              placeholder="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white opacity-60 hover:opacity-100"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
             {showPassword ? '👁‍🗨' : '👁️'}

            </button>
          </div>

          {errorMessage && (
            <div className="bg-red-600 text-white p-2 rounded text-center font-semibold">
              {errorMessage}
            </div>
          )}

          {infoMessage && (
            <div className="bg-green-600 text-white p-2 rounded text-center font-semibold">
              {infoMessage}
            </div>
          )}

          {showReverify && (
            <div className="text-center">
              <button
                type="button"
                onClick={handleReverify}
                className="text-yellow-300 underline font-medium hover:text-yellow-400"
              >
                Resend Verification Email
              </button>
            </div>
          )}

          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 px-4 py-2 rounded font-semibold"
            type="submit"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>

          {isLogin && (
            <button
              type="button"
              onClick={() => navigate('/reset-password')}
              className="text-cyan-300 hover:text-cyan-400 mt-2 underline font-semibold w-full text-center"
            >
              Forgot Password?
            </button>
          )}
        </form>
      </AuthCard>
    </div>
  );
};

export default AuthPage;
