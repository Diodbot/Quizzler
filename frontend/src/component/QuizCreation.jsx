import { useState } from 'react';

const QuizCreation = ({ onSubmit, initialData = {} }) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [timeLimit, setTimeLimit] = useState(initialData.timeLimit || 30); // minutes here
  const [questions, setQuestions] = useState(initialData.questions || []);

  const addQuestion = () => {
    setQuestions([...questions, {
      text: '',
      options: ['', '', '', ''],
      correctOption: 0
    }]);
  };

  const updateQuestion = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex] = value;
    setQuestions(updated);
  };

  const setCorrectOption = (qIndex, correctIdx) => {
    const updated = [...questions];
    updated[qIndex].correctOption = correctIdx;
    setQuestions(updated);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  if (questions.length < 1) {
    alert('Please add at least one question to create a quiz.');
    return;
  }

  for (const q of questions) {
    if (!q.text.trim()) {
      alert('All questions must have text.');
      return;
    }
    for (const opt of q.options) {
      if (!opt.trim()) {
        alert('All options must be filled in.');
        return;
      }
    }
  }

  // ✅ Transform questions to match backend model
  const formattedQuestions = questions.map((q) => ({
    question: q.text,
    options: q.options,
    correctAnswer: q.options[q.correctOption],
  }));

  onSubmit({
    title,
    description,
    timeLimit: timeLimit * 60, // Convert to seconds if backend expects seconds
    questions: formattedQuestions,
  });
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-white">
      <input
        type="text"
        placeholder="Quiz Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 bg-gray-800 rounded"
        required
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 bg-gray-800 rounded"
      />

      <label className="block">
        <span className="text-sm mb-1 inline-block">Time Limit (minutes)</span>
        <input
          type="number"
          placeholder="Time Limit"
          value={timeLimit}
          onChange={(e) => setTimeLimit(Number(e.target.value))}
          className="w-full p-2 bg-gray-800 rounded"
          min={1}
          required
        />
      </label>

      {questions.map((q, i) => (
        <div key={i} className="p-4 bg-gray-900 rounded">
          <input
            type="text"
            placeholder="Question"
            value={q.text}
            onChange={(e) => updateQuestion(i, 'text', e.target.value)}
            className="w-full mb-2 p-2 bg-gray-800 rounded"
            required
          />
          {q.options.map((opt, j) => (
            <div key={j} className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(i, j, e.target.value)}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />
              <input
                type="radio"
                name={`correctOption-${i}`}
                checked={q.correctOption === j}
                onChange={() => setCorrectOption(i, j)}
              />
              <span className="text-sm">Correct</span>
            </div>
          ))}
          <button
            type="button"
            onClick={() => removeQuestion(i)}
            className="text-red-400 text-sm mt-2"
          >
            Remove Question
          </button>
        </div>
      ))}

      <button type="button" onClick={addQuestion} className="bg-blue-600 p-2 rounded">
        Add Question
      </button>

      <button type="submit" className="bg-green-600 p-2 rounded ml-2">
        Save Quiz
      </button>
    </form>
  );
};

export default QuizCreation;
