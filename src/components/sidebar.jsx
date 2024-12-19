import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-200 p-5 fixed">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>
      <ul className="space-y-4">
        {/* <li><Link to="/" className="text-gray-700 hover:text-blue-500">Home</Link></li> */}
        <li><Link to="/create-quiz" className="text-gray-700 hover:text-blue-500">Create Quiz</Link></li>
        <li><Link to="/exsitingquiz" className="text-gray-700 hover:text-blue-500">Edit Exsiting Quiz</Link></li>
        <li><Link to="/city/islamabad" className="text-gray-700 hover:text-blue-500">Islamabad</Link></li>
        <li><Link to="/city/lahore" className="text-gray-700 hover:text-blue-500">Lahore</Link></li>
        <li><Link to="/city/quetta" className="text-gray-700 hover:text-blue-500">Quetta</Link></li>
        <li><Link to="/city/peshawar" className="text-gray-700 hover:text-blue-500">Peshawar</Link></li>
        <li><Link to="/city/karachi" className="text-gray-700 hover:text-blue-500">Karachi</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
