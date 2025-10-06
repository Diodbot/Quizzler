// src/component/AnimatedButton.jsx

import React from 'react';

const AnimatedButton = ({ onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded font-semibold ${className}`}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
