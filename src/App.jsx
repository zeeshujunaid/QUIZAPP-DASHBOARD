import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/sidebar';
import Home from './pages/home';
import Exsitingquiz from './pages/exsitingquiz';
import CreateQuiz from './pages/createquiz';
import City from './pages/City';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define route for Home where sidebar doesn't render */}
        <Route path="/" element={<Home />} />

        {/* For all other routes, render sidebar with the page */}
        <Route
          path="/*"
          element={
            <div className="flex">
              <Sidebar />
              <div className="ml-64 p-5 flex-1">
                <Routes>
                  <Route path="/create-quiz" element={<CreateQuiz />} />
                  <Route path="/Exsitingquiz" element={<Exsitingquiz />} />
                  <Route path="/city/:cityName" element={<City />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
