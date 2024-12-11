import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Home from './pages/Home';
import CreateQuiz from './pages/CreateQuiz';
import City from './pages/City';

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="ml-64 p-5 flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-quiz" element={<CreateQuiz />} />
            <Route path="/city/:cityName" element={<City />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
