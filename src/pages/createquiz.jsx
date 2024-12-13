import React, { useState } from "react";
import axios from "axios";

const CreateQuiz = () => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState({ a: "", b: "", c: "", d: "" });
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [addedQuestions, setAddedQuestions] = useState([]);

  const handleAddQuestion = () => {
    // Log current inputs for debugging
    console.log("Adding question:", { question, answers, correctAnswer });

    if (!question || !answers.a || !answers.b || !answers.c || !answers.d || !correctAnswer) {
      alert("Please fill all fields and select a correct answer.");
      return;
    }

    const newQuestion = {
      question,
      answers,
      correctAnswer,
    };

    setAddedQuestions([...addedQuestions, newQuestion]);
    setQuestion("");
    setAnswers({ a: "", b: "", c: "", d: "" });
    setCorrectAnswer("");
  };

  const handleSubmit = async () => {
    // Log addedQuestions to ensure there are questions before submission
    console.log("Submitting quiz with questions:", addedQuestions);

    if (addedQuestions.length === 0) {
      alert("Please add at least one question before submitting.");
      return;
    }

    try {
      for (const addedQuestion of addedQuestions) {
        const { question, answers, correctAnswer } = addedQuestion;

        const requestPayload = {
          question,
          answers: [answers.a, answers.b, answers.c, answers.d],
          correctAnswer: ["a", "b", "c", "d"].indexOf(correctAnswer), // Convert to index
        };

        console.log("Sending payload to backend:", requestPayload); // Log payload for debugging

        await axios.post("http://localhost:5000/api/quizzes", requestPayload);
      }

      alert("Quiz questions created successfully!");
    } catch (error) {
      console.error("Error creating quiz:", error); // Log error details
      alert(`Error creating quiz: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Create a Quiz</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-gray-700">Question:</label>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question"
            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {["a", "b", "c", "d"].map((letter) => (
            <div key={letter}>
              <label className="block text-lg font-medium text-gray-700">Answer {letter.toUpperCase()}:</label>
              <input
                type="text"
                name={letter}
                value={answers[letter]}
                onChange={(e) => setAnswers({ ...answers, [e.target.name]: e.target.value })}
                placeholder={`Answer ${letter.toUpperCase()}`}
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-lg font-medium text-gray-700">Correct Answer:</label>
          <select
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Correct Answer</option>
            <option value="a">Answer A</option>
            <option value="b">Answer B</option>
            <option value="c">Answer C</option>
            <option value="d">Answer D</option>
          </select>
        </div>

        <div className="text-center">
          <button
            onClick={handleAddQuestion}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          >
            Add Question
          </button>
        </div>

        {addedQuestions.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">Added Questions:</h3>
            <ul className="space-y-4 mt-4">
              {addedQuestions.map((q, index) => (
                <li key={index} className="p-4 border rounded-lg shadow-md bg-white">
                  <p className="font-semibold text-lg text-gray-700">
                    <strong>Q{index + 1}:</strong> {q.question}
                  </p>
                  <p className="text-gray-600">A: {q.answers.a}</p>
                  <p className="text-gray-600">B: {q.answers.b}</p>
                  <p className="text-gray-600">C: {q.answers.c}</p>
                  <p className="text-gray-600">D: {q.answers.d}</p>
                  <p className="text-gray-600">Correct Answer: {q.correctAnswer}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
