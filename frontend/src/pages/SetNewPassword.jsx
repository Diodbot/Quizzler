import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SendResetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('https://quizzler-f2k8.onrender.com/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Reset link sent to your email.');
      } else {
        setMessage(data.message || 'Failed to send reset link.');
      }
    } catch (error) {
      setMessage('Error sending request.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 p-6">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl mb-4">Reset Password</h2>
        <input
          type="email"
          required
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-cyan-500 text-black rounded hover:bg-cyan-600 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {message && <p className="mt-4 text-white">{message}</p>}
        <div className="mt-4 text-center">
          <Link to="/auth" className="text-cyan-300 underline hover:text-white">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default SendResetPassword;
