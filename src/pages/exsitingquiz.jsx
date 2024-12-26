import React, { useState } from "react";
import { collection, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ExistingQuiz() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [quizData, setQuizData] = useState(null);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswers, setNewAnswers] = useState({ a: "", b: "", c: "", d: "" });
  const [newCorrectAnswer, setNewCorrectAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    "Web Development",
    "App Development",
    "uiux Development",
    "Flutter Development",
    "Digital Development ",
  ];

  const notify = (message, type = "info") => {
    toast[type](message, { position: "top-right" , outerWidth:400, });
};

const handleSearchQuiz = async () => {
  if (!selectedCategory || !inputCode) {
    notify("Please select a category and enter a quiz code.", "error");
    return;
  }

  setIsLoading(true);

  try {
    const collectionName = selectedCategory.replace(/\s+/g, "").toLowerCase() + "Quizzes";
    const quizDocRef = doc(db, collectionName, inputCode);

    const quizSnapshot = await getDoc(quizDocRef);

    if (quizSnapshot.exists()) {
      setQuizData(quizSnapshot.data());
      notify("Quiz found! You can now view or update it.", "success");
    } else {
      notify("Quiz not found. Please check the code and category.", "error");
    }
  } catch (error) {
    console.error("Error fetching quiz:", error);
    notify("An error occurred while searching for the quiz.", "error");
  } finally {
    setIsLoading(false);
  }
};

const handleAddQuestion = async () => {
  if (!newQuestion || !newAnswers.a || !newAnswers.b || !newAnswers.c || !newAnswers.d || !newCorrectAnswer) {
    notify("Please fill in all fields for the new question.", "error");
    return;
  }

  const newQuestionData = {
    question: newQuestion,
    answers: newAnswers,
    correctAnswer: newCorrectAnswer,
  };

  try {
    const collectionName = selectedCategory.replace(/\s+/g, "").toLowerCase() + "Quizzes";
    const quizDocRef = doc(db, collectionName, inputCode);

    await updateDoc(quizDocRef, {
      questions: arrayUnion(newQuestionData),
    });

    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestionData],
    }));

    setNewQuestion("");
    setNewAnswers({ a: "", b: "", c: "", d: "" });
    setNewCorrectAnswer("");
    notify("New question added successfully!", "success");
  } catch (error) {
    console.error("Error adding question:", error);
    notify("An error occurred while adding the question.", "error");
  }
};

const handleDeleteQuestion = async (questionToDelete) => {
  try {
    const collectionName = selectedCategory.replace(/\s+/g, "").toLowerCase() + "Quizzes";
    const quizDocRef = doc(db, collectionName, inputCode);

    await updateDoc(quizDocRef, {
      questions: arrayRemove(questionToDelete),
    });

    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q !== questionToDelete),
    }));

    notify("Question deleted successfully!", "success");
  } catch (error) {
    console.error("Error deleting question:", error);
    notify("An error occurred while deleting the question.", "error");
  }
};


  return (
    <div className="container p-6 mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-blue-600">
        Search and Update Existing Quiz
      </h1>

      {/* Category Selector */}
      <div className="mb-4">
        <label className="block text-lg font-medium text-gray-700">
          Select Category:
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a Category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Quiz Code Input */}
      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700">
          Enter Quiz Code:
        </label>
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Enter quiz code"
        />
        <button
          onClick={handleSearchQuiz}
          className="px-6 py-3 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700"
        >
          {isLoading ? "Searching..." : "Search Quiz"}
        </button>
      </div>

      {/* Display Quiz Data */}
      {quizData && (
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-bold text-gray-800">Quiz Questions:</h2>
          <ul className="space-y-4">
            {quizData.questions.map((q, index) => (
              <li key={index} className="p-4 bg-white border rounded-md shadow-sm">
                <p><strong>Q{index + 1}:</strong> {q.question}</p>
                <ul className="ml-4 list-disc">
                  <li>A: {q.answers.a}</li>
                  <li>B: {q.answers.b}</li>
                  <li>C: {q.answers.c}</li>
                  <li>D: {q.answers.d}</li>
                </ul>
                <p className="font-semibold mt-2">Correct Answer: {q.correctAnswer}</p>
                <button
                  onClick={() => handleDeleteQuestion(q)}
                  className="px-4 py-2 mt-4 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                  Delete Question
                </button>
              </li>
            ))}
          </ul>

          {/* Add New Question */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-800">Add a New Question:</h2>
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              className="w-full p-3 mb-4 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter question text"
            />
            <div className="grid grid-cols-2 gap-4">
              {["a", "b", "c", "d"].map((option) => (
                <input
                  key={option}
                  type="text"
                  value={newAnswers[option]}
                  onChange={(e) =>
                    setNewAnswers((prev) => ({ ...prev, [option]: e.target.value }))
                  }
                  className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder={`Answer ${option.toUpperCase()}`}
                />
              ))}
            </div>
            <input
              type="text"
              value={newCorrectAnswer}
              onChange={(e) => setNewCorrectAnswer(e.target.value)}
              className="w-full p-3 mt-4 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter correct answer (e.g., a, b, c, d)"
            />
            <button
              onClick={handleAddQuestion}
              className="px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
