import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100 text-center px-4">
      <img
        src="/404.svg"
        alt="404 Not Found"
        className="w-64 md:w-96 mb-6"
      />
      <h1 className="text-6xl md:text-8xl font-extrabold text-blue-600 mb-2">
        404
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
        Oops! Page not found
      </h2>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      <Button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg transition-all duration-200"
      >
        <Home className="w-5 h-5" />
        Go Home
      </Button>

      <p className="mt-6 text-sm text-gray-500">
        Or check the URL and try again.
      </p>
    </div>
  );
};

export default NotFound;
