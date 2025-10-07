import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://quizzler-f2k8.onrender.com/api/v1/auth/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || 'Password reset successfully. Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      setError('Error during reset.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 p-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl mb-4">Set New Password</h2>
        <div className="mb-4 relative">
          <input
            type={showPwd ? 'text' : 'password'}
            required
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <span
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-3 cursor-pointer text-white"
          >
            {showPwd ? '🙈' : '👁️'}
          </span>
        </div>
        <div className="mb-4 relative">
          <input
            type={showConfirmPwd ? 'text' : 'password'}
            required
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />
          <span
            onClick={() => setShowConfirmPwd(!showConfirmPwd)}
            className="absolute right-3 top-3 cursor-pointer text-white"
          >
            {showConfirmPwd ? '🙈' : '👁️'}
          </span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-cyan-500 text-black rounded hover:bg-cyan-600 disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
        {error && <p className="mt-4 text-red-400">{error}</p>}
        {success && <p className="mt-4 text-green-400">{success}</p>}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-cyan-300 underline hover:text-white">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
