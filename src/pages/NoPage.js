import React from 'react';
import { useNavigate } from 'react-router-dom';

const NoPage = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-600">404</h1>
        <p className="text-2xl font-semibold text-gray-800 mb-4">
          Oops! Page not found.
        </p>
        <p className="text-lg text-gray-600 mb-8">
          The page you’re looking for doesn’t exist.
        </p>
        <button
          onClick={goHome}
          className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition duration-300"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default NoPage;
