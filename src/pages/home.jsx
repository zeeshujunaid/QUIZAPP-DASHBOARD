import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import { ToastContainer, toast } from 'react-toastify'; // For alerts (optional)
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  // Predefined email and password
  const correctEmail = 'saylani12@gmai.com'; // Replace with your actual email
  const correctPassword = 'saylanidashboard123'; // Replace with your actual password

  const handleLogin = (e) => {
    e.preventDefault();

    // Check if the entered email and password match the predefined values
    if (email === correctEmail && password === correctPassword) {
      // If credentials match, navigate to the dashboard or another page
      navigate('/createquiz'); // Adjust the route accordingly
    } else {
      // If credentials don't match, show an alert
      toast.error('Invalid email or password!');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-6">Saylani Quiz App Dashboard</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-gray-900"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md text-gray-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Login
          </button>
        </form>

        {/* Toast Container for Alerts */}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
