import React, { useState } from "react";
import { Link } from "react-router-dom";

const ResetPassword = () => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");

    try {
      const response = await fetch("http://localhost:5500/api/v1/auth/sendResetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage("Reset link sent to your email.");
      } else {
        setMessage("Failed to send reset link.");
      }
    } catch {
      setMessage("Error sending reset link.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center w-[400px] h-auto bg-indigo-900 rounded-2xl flex-col p-6 gap-6 shadow-lg"
    >
      <div className="flex flex-col gap-5 w-full items-center">
        <input
          name="email"
          type="email"
          placeholder="Enter your registered email..."
          required
          className="w-[350px] h-[50px] text-xl font-semibold text-blue-950 bg-amber-200 rounded-xl text-center placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-cyan-400 transition"
        />
      </div>

      <button
        type="submit"
        className="w-[350px] h-[50px] bg-cyan-400 text-xl font-bold text-blue-950 rounded-xl mt-4 hover:bg-cyan-500 active:bg-gray-700 active:text-white transition"
      >
        Send Reset Link
      </button>

      {message && <p className="text-white font-bold mt-3">{message}</p>}

      <div className="text-white text-lg mt-3 font-bold text-center">
        
        <Link to="/login" className="underline text-cyan-300 hover:text-white transition"> Back to Login</Link>
      </div>
    </form>
  );
};

export default ResetPassword;
