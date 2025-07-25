import React from 'react';
import { FaRegClock } from 'react-icons/fa';

function Saved() {
  return (
    <div className="sm:min-h-screen h-[550px] flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-red-100 p-4">
      <div className="text-center bg-white p-8 sm:p-10 rounded-3xl shadow-xl max-w-md w-full animate-fade-in">

        <div className="flex justify-center mb-4">
          <FaRegClock className="text-red-500 text-5xl animate-pulse" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Coming Soon!
        </h1>

        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          The <span className="text-red-500 font-medium">Saved</span> feature is under development and launching very soon. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}

export default Saved;

