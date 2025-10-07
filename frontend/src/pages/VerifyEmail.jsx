import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await fetch(`https://quizzler.onrender.com/api/v1/auth/verify-email/${token}`, {
          method: "GET",
        });

        if (res.ok) {
          setMessage("✅ Email verified successfully! Redirecting to login...");
          setError(false);
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          const data = await res.json();
          setMessage(data.message || "❌ Verification failed or token expired.");
          setError(true);
        }
      } catch {
        setMessage("❌ Network error during verification.");
        setError(true);
      }
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 p-6">
      <div className={`p-8 rounded-2xl shadow-lg max-w-md text-center ${error ? "bg-red-700 text-white" : "bg-green-700 text-white"}`}>
        <h1 className="text-2xl font-bold mb-4">{error ? "Verification Error" : "Verification Successful"}</h1>
        <p className="mb-6">{message}</p>
        {error && (
          <>
            <Link to="/login" className="underline text-cyan-300 hover:text-white">
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
