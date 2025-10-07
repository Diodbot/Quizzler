import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../component/AuthCard';

const AuthPage = () => {
  const { login, signup, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log("isAuthenticated",isAuthenticated);
    console.log("loading",loading);

    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  const toggleMode = () => setIsLogin(!isLogin);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(username, email, password);
    }
    // Remove navigate here
  } catch (err) {
    alert("Auth failed: " + err.message);
  }
};

// useEffect redirects automatically when authentication status changes
useEffect(() => {
  if (!loading && isAuthenticated) {
    navigate('/');
  }
}, [isAuthenticated, loading, navigate]);


  if (loading) return <div className="text-white p-6">Checking Authentication...</div>;

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
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              className="w-full p-2 bg-gray-800 rounded text-white placeholder-gray-500"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            className="w-full p-2 bg-gray-800 rounded text-white placeholder-gray-500"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full p-2 bg-gray-800 rounded text-white placeholder-gray-500"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors duration-300 px-4 py-2 rounded font-semibold"
            type="submit"
          >
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </AuthCard>
    </div>
  );
};

export default AuthPage;
