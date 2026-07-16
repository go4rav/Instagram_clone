import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const ErrorPage = () =>{

    const navigate  = useNavigate();


    return (
    <div className="bg-black w-full h-screen flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-white text-2xl font-semibold">
        Sorry, this page isn't available.
      </h1>
    
      <p className="text-gray-400 mt-3 max-w-md">
        The link you followed may be broken, or the profile may have been removed.
      </p>
    
      <button
        onClick={() => navigate("/")}
        className="mt-8 bg-[#0095F6] hover:bg-[#1877F2] text-white font-semibold px-6 py-2 rounded-lg"
      >
        Go to Home
      </button>
    </div> );
}

export default ErrorPage;