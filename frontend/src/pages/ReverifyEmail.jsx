import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ReverifyEmail = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReverify = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('https://quizzler-f2k8.onrender.com/api/v1/auth/reverify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Verification email resent.');
      } else {
        setMessage(data.message || 'Failed to resend verification email.');
      }
    } catch (err) {
      setMessage('Error sending request.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 p-6">
      <form onSubmit={handleReverify} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-white text-2xl mb-4">Resend Verification Email</h2>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your registered email"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full p-2 bg-cyan-500 text-black rounded hover:bg-cyan-600 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Resend Email'}
        </button>
        {message && <p className="mt-4 text-white">{message}</p>}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-cyan-300 underline hover:text-white">Back to Login</Link>
        </div>
      </form>
    </div>
  );
};

export default ReverifyEmail;
