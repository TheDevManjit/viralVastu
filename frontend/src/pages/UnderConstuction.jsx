import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HardHat, Home } from "lucide-react";

const UnderConstruction = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 text-center px-4">
     
      {/* <img
        src="/construction.svg"
        alt="Under Construction"
        className="w-64 md:w-96 mb-6 animate-bounce-slow"
      /> */}

     
      <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-600 mb-2 flex items-center gap-2">
        <HardHat className="w-10 h-10 text-yellow-500" />
        Page Under Construction
      </h1>

    
      <p className="text-gray-700 max-w-md mb-8">
        We’re still working hard to bring you something awesome here.  
        Please check back later or return to the homepage for now.
      </p>

    
      <Button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg text-lg transition-all duration-200"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Button>

     
      <p className="mt-6 text-sm text-gray-500">
        🚧 Expected completion: Coming soon!
      </p>
    </div>
  );
};

export default UnderConstruction;
