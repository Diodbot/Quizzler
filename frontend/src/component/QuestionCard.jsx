// src/component/QuestionCard.jsx

import React from 'react';

const QuestionCard = ({ question, selected, onSelect }) => {
  if (!question) {
    return <div>Question not found</div>;
  }
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      <div className="space-y-2">
        {question.options.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name={`option-${question._id}`}
              checked={selected === idx}
              onChange={() => onSelect(idx)}
              className="cursor-pointer"
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
