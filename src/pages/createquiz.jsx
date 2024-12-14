import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig"; // Firebase configuration import karo

const CreateQuiz = () => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState({ a: "", b: "", c: "", d: "" });
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [addedQuestions, setAddedQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const handleAddQuestion = () => {
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
    if (addedQuestions.length === 0) {
      alert("Please add at least one question before submitting.");
      return;
    }

    setIsLoading(true); // Start loading

    try {
      const quizCollectionRef = collection(db, "quizzes"); // Firestore 'quizzes' collection reference

      for (const addedQuestion of addedQuestions) {
        await addDoc(quizCollectionRef, addedQuestion); // Har question Firestore mein add karega
      }

      setTimeout(() => {
        alert("Quiz questions saved to Firestore!"); // Delay alert after submission
      }, 1000); // 1 second delay
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Error saving quiz to Firestore. Please try again.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="container p-6 mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-blue-600">Create a Quiz</h1>
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
            className="px-6 py-3 text-white transition duration-300 bg-blue-600 rounded-lg shadow-md hover:bg-blue-700"
          >
            Add Question
          </button>
        </div>

        {addedQuestions.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-gray-800">Added Questions:</h3>
            <ul className="mt-4 space-y-4">
              {addedQuestions.map((q, index) => (
                <li key={index} className="p-4 bg-white border rounded-lg shadow-md">
                  <p className="text-lg font-semibold text-gray-700">
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

        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 text-white transition duration-300 bg-green-600 rounded-lg shadow-md hover:bg-green-700"
          >
            {isLoading ? (
              <span className="loader"></span> // Replace this with an actual loader component
            ) : (
              "Submit Quiz"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
