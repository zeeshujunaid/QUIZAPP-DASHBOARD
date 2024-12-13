import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebaseconfig'; // Import the Firebase db
import { collection, getDocs } from 'firebase/firestore';

const City = () => {
  const { cityName } = useParams(); // Get the city name from the URL
  const [cityData, setCityData] = useState([]); // State to store city data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

  // Fetch data for the selected city
  useEffect(() => {
    const fetchCityData = async () => {
      try {
        // Query Firestore for the city-specific collection
        const querySnapshot = await getDocs(collection(db, cityName));
        const data = querySnapshot.docs.map(doc => doc.data()); // Extract data from each document
        setCityData(data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };

    fetchCityData(); // Fetch city data when the component is mounted or cityName changes

    // Reset the search query whenever cityName changes
    setSearchQuery('');
  }, [cityName]); // Effect runs when cityName changes

  // Filter data based on the search query
  const filteredData = cityData.filter(item =>
    item.name && item.name.toLowerCase().includes(searchQuery.toLowerCase()) // Check if item.name exists
  );

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {loading ? (
        <h2 className="text-xl font-semibold text-gray-600">Loading data...</h2> // Loading state
      ) : (
        <>
          <h1 className="text-4xl font-bold text-blue-700 mb-5">Welcome to {cityName}</h1>

          {/* Search Input */}
          <input
            type="text"
            className="border-2 p-2 mb-5 rounded-lg"
            placeholder="Search for a student..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
          />

          {/* If data is available */}
          {filteredData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-10">
              {/* Mapping over the filtered city data */}
              {filteredData.map((item, index) => (
                <div key={index} className="bg-white shadow-lg rounded-lg p-5">
                  {/* Displaying student name */}
                  <h2 className="text-xl font-semibold text-blue-600 mb-3">Student: {item.name}</h2>
                  {/* Displaying center name */}
                  <p className="text-lg text-gray-700 mb-2">Center: {item.center}</p>
                  {/* Displaying sir name */}
                  <p className="text-lg text-gray-700 mb-2">Sir: {item.sir}</p>
                  {/* Displaying score */}
                  <p className="text-lg text-gray-700">Score: {item.score}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>No matching data for "{searchQuery}"</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default City;
