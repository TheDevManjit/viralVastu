import React from "react";
import { Link, useNavigate } from "react-router-dom";

const VerifyEmailSend = () => {
  const navigate = useNavigate()
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-sky-100 to-sky-200">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-3xl font-semibold text-sky-600 mb-4">
          Check Your Email 📩
        </h1>
        <p className="text-gray-600 text-lg">
          We've sent an email to reset your password.
        </p>
        <p className="text-gray-600 mt-2">
          Please check your inbox and Change password.
          This Link valid only for 10 Minutes
        </p>

        <div className="mt-6">
          <button
            onClick={() => navigate("/login")}
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg shadow-md transition"
          >
           <Link to={'/login'}/> Go to Log in page
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailSend;
