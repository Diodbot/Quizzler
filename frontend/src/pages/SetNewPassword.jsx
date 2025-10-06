import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SetNewPassword = () => {
    const { token } = useParams();
  const navigate = useNavigate(); // ✅ for redirect
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setSuccess("");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5500/api/v1/auth/resetpassword/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setSuccess("✅ Password reset successful! Redirecting...");
        setError("");

        // ⏳ Delay to show message, then redirect
        setTimeout(() => {
          navigate("/login"); // ✅ redirect to login
        }, 2000);
      } else {
        setError("❌ Reset failed. Invalid or expired token.");
        setSuccess("");
      }
    } catch {
      setError("❌ Error resetting password.");
      setSuccess("");
    }
}

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center justify-center w-[400px] h-auto bg-indigo-900 rounded-2xl flex-col p-6 gap-6 shadow-lg"
    >
      <div className="flex flex-col gap-5 w-full items-center">
        <div className="relative w-[350px]">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="New Password..."
            required
            className="w-full h-[50px] text-xl font-semibold text-blue-950 bg-amber-200 rounded-xl text-center placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-cyan-400 transition"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-3 cursor-pointer text-blue-900 text-xl"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="relative w-[350px]">
          <input
            name="confirmPassword"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password..."
            required
            className="w-full h-[50px] text-xl font-semibold text-blue-950 bg-amber-200 rounded-xl text-center placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-cyan-400 transition"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-3 cursor-pointer text-blue-900 text-xl"
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>
      </div>

      <button
        type="submit"
        className="w-[350px] h-[50px] bg-cyan-400 text-xl font-bold text-blue-950 rounded-xl mt-4 hover:bg-cyan-500 active:bg-gray-700 active:text-white transition"
      >
        Reset Password
      </button>

      {error && <p className="text-red-400 font-bold mt-2">{error}</p>}
      {success && <p className="text-green-400 font-bold mt-2">{success}</p>}

      <div className="text-white text-lg mt-3 font-bold text-center">
        <Link to="/login" className="underline text-cyan-300 hover:text-white transition">
          Back to Login
        </Link>
      </div>
    </form>
  );
};

export default SetNewPassword;
