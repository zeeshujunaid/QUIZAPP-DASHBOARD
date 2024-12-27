import React, { useState } from "react";
import { collection, doc, getDoc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/firebaseconfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateQuiz = () => {
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState({ a: "", b: "", c: "", d: "" });
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [addedQuestions, setAddedQuestions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [liveQuizCode, setLiveQuizCode] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [isCodeVerified, setIsCodeVerified] = useState(false);

  const categories = [
    "Web Development",
    "App Development",
    "UIUX Development",
    "Flutter Development",
    "Digital development",
    "Software development",
  ];

  // Generate a unique live quiz code
const handleGenerateCode = () => {
  const code = Math.round(Math.random() * 8999 + 1000); // 4-digit random code
  setLiveQuizCode(code);
  setIsCodeVerified(false);
  toast.info(`Live quiz code generated: ${code}`);
};

// Verify the entered live quiz code
const handleVerifyCode = () => {
  if (inputCode === String(liveQuizCode)) {
    toast.success("Code verified successfully!");
    setIsCodeVerified(true);
  } else {
    toast.error("Invalid code. Please try again.");
  }
};

// Add a question to the list
const handleAddQuestion = () => {
  if (!isCodeVerified) {
    toast.error("Please verify the quiz code before adding questions.");
    return;
  }
  if (!question || !answers.a || !answers.b || !answers.c || !answers.d || !correctAnswer) {
    toast.error("Please fill in all fields and select the correct answer.");
    return;
  }

  const newQuestion = {
    question,
    answers,
    correctAnswer,
  };

  setAddedQuestions((prev) => [...prev, newQuestion]);
  setQuestion("");
  setAnswers({ a: "", b: "", c: "", d: "" });
  setCorrectAnswer("");
};

// Submit the quiz to Firebase
const handleSubmit = async () => {
  if (!selectedCategory) {
    toast.error("Please select a category.");
    return;
  }
  if (addedQuestions.length === 0) {
    toast.error("Please add at least one question.");
    return;
  }
  if (!liveQuizCode) {
    toast.error("Live quiz code is required.");
    return;
  }

  setIsLoading(true);

  try {
    const collectionName = selectedCategory.replace(/\s+/g, "").toLowerCase() + "Quizzes";
    // Fix: Use the correct Firestore document reference format
    const quizDocRef = doc(db, collectionName, String(liveQuizCode));

    const existingQuiz = await getDoc(quizDocRef);

    if (existingQuiz.exists()) {
      await updateDoc(quizDocRef, {
        questions: arrayUnion(...addedQuestions),
      });
      toast.success("Questions added to the existing quiz successfully!");
    } else {
      await setDoc(quizDocRef, {
        liveQuizCode,
        category: selectedCategory,
        questions: addedQuestions,
      });
      toast.success("Quiz created successfully!");
    }

    // Reset fields
    setAddedQuestions([]);
    setSelectedCategory("");
    setLiveQuizCode(null);
    setIsCodeVerified(false);
  } catch (error) {
    console.error("Error saving quiz:", error);
    toast.error("An error occurred while saving the quiz. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="container p-6 mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h1 className="mb-6 text-3xl font-bold text-center text-blue-600">
        Create a Quiz
      </h1>

      <div className="space-y-4">
        {/* Category Selector */}
        <div>
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

        {/* Generate Quiz Code */}
        <div className="text-center">
          <button
            onClick={handleGenerateCode}
            className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
          >
            Generate Live Quiz Code
          </button>
          {liveQuizCode && (
            <p className="mt-4 text-lg font-semibold text-purple-600">
              Generated Code: {liveQuizCode}
            </p>
          )}
        </div>

        {/* Verify Code Section */}
        {liveQuizCode && (
          <div className="mt-4">
            <label className="block text-lg font-medium text-gray-700">
              Enter Generated Code to Verify:
            </label>
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              placeholder="Enter generated code"
            />
            <button
              onClick={handleVerifyCode}
              className="px-6 py-3 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Verify Code
            </button>
          </div>
        )}

        {/* Question Inputs */}
        {isCodeVerified && (
          <>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Question:
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your question"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {["a", "b", "c", "d"].map((letter) => (
                <div key={letter}>
                  <label className="block text-lg font-medium text-gray-700">
                    Answer {letter.toUpperCase()}:
                  </label>
                  <input
                    type="text"
                    name={letter}
                    value={answers[letter]}
                    onChange={(e) =>
                      setAnswers({ ...answers, [e.target.name]: e.target.value })
                    }
                    className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder={`Answer ${letter.toUpperCase()}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">
                Correct Answer:
              </label>
              <select
                value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)}
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Correct Answer</option>
                {["a", "b", "c", "d"].map((letter) => (
                  <option key={letter} value={letter}>
                    Answer {letter.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-center">
              <button
                onClick={handleAddQuestion}
                className="px-6 py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Add Question
              </button>
            </div>

            {/* Display Added Questions */}
            <div className="mt-6">
              <h2 className="text-xl font-bold text-gray-800">
                Added Questions:
              </h2>
              <ul className="mt-4 space-y-2">
                {addedQuestions.map((q, index) => (
                  <li
                    key={index}
                    className="p-4 bg-white border rounded-md shadow-sm"
                  >
                    <p>
                      <strong>Q{index + 1}:</strong> {q.question}
                    </p>
                    <ul className="ml-4 list-disc">
                      {Object.entries(q.answers).map(([key, value]) => (
                        <li key={key}>
                          <strong>{key.toUpperCase()}:</strong> {value}
                        </li>
                      ))}
                    </ul>
                    <p>
                      <strong>Correct Answer:</strong>{" "}
                      {q.correctAnswer.toUpperCase()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleSubmit}
                className="px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
              >
                {isLoading ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateQuiz;
