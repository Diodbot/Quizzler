import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Helper to parse query params
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };

  const query = useQuery();

  useEffect(() => {
    const emailFromQuery = query.get("email");
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    }
  }, [query]);

  const handleResend = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5500/api/v1/auth/reverifyEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Verification email resent. Please check your inbox.");
      } else {
        setMessage(result.message || "Failed to resend verification email.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-[400px] h-auto bg-indigo-900 rounded-2xl p-6 gap-6 shadow-lg text-white text-center">
      <h2 className="text-2xl font-bold">Please Verify Your Email</h2>
      <p>
        We sent you an email with a verification link. Please check your inbox and
        click on the link to activate your account.
      </p>

      {email && (
        <>
          <p className="mt-4">Didn't receive the email?</p>
          <button
            onClick={handleResend}
            disabled={loading}
            className="mt-2 px-6 py-2 bg-cyan-400 rounded-xl font-semibold text-blue-950 hover:bg-cyan-500 transition"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
          {message && <p className="mt-2">{message}</p>}
        </>
      )}

      <a
        href="/login"
        className="mt-6 px-6 py-2 bg-cyan-400 rounded-xl font-semibold text-blue-950 hover:bg-cyan-500 transition"
      >
        Back to Login
      </a>
    </div>
  );
};

export default VerifyEmail;
