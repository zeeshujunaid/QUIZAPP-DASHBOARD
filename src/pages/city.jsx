import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebaseconfig'; // Import the Firebase db
import { collection, getDocs } from 'firebase/firestore';

const City = () => {
  const { cityName } = useParams(); // Get the city name from the URL
  const [cityData, setCityData] = useState([]); // State to store city data
  const [loading, setLoading] = useState(false); // State for loading indicator

  // Fetch data for the selected city
  useEffect(() => {
    const fetchCityData = async () => {
      setLoading(true); // Set loading to true when starting the data fetch
      try {
        // Query Firestore for the city-specific collection
        const querySnapshot = await getDocs(collection(db, cityName));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id, // Add the document ID to the data
          ...doc.data(),
        }));
        console.log('Fetched data:', data); // Log the fetched data for debugging
        setCityData(data); // Update state with the fetched data
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched or if there's an error
      }
    };

    fetchCityData(); // Fetch city data when the component is mounted or cityName changes
  }, [cityName]); // Effect runs when cityName changes

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 pt-10">
      {loading ? (
        <h2 className="text-xl font-semibold text-gray-600">Loading data...</h2> // Loading state
      ) : (
        <>
          <h1 className="text-4xl font-bold text-blue-700 mb-5 pt-20">Welcome to {cityName} Quiz Result</h1>

          {/* If data is available, render it */}
          {cityData.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-10">
              {/* Mapping over the city data */}
              {cityData.map((item) => (
                <div key={item.id} className="bg-white shadow-lg rounded-lg p-5">
                  <div className="mb-2">
                    <strong className="text-gray-700">Name:</strong>
                    <span>{item.name || 'Not Available'}</span> {/* Show 'Not Available' if the field is empty */}
                  </div>
                  <div className="mb-2">
                    <strong className="text-gray-700">ID:</strong>
                    <span>{item.cardnum !== undefined ? item.cardnum : 'Not Available'}</span> {/* Show 'Not Available' if score is missing */}
                  </div>
                  <div className="mb-2">
                    <strong className="text-gray-700">Score:</strong>
                    <span>{item.score !== undefined ? item.score : 'Not Available'}</span> {/* Show 'Not Available' if score is missing */}
                  </div>
                  <div className="mb-2">
                    <strong className="text-gray-700">Course:</strong>
                    <span>{item.course !== undefined ? item.course : 'Not Available'}</span> {/* Show 'Not Available' if score is missing */}
                  </div>
                  <div className="mb-2">
                    <strong className="text-gray-700">Sirname:</strong>
                    <span>{item.sirname || 'Not Available'}</span> {/* Show 'Not Available' if the field is empty */}
                  </div>
                  <div className="mb-2">
                    <strong className="text-gray-700">Date:</strong>
                    <span>{item.date !== undefined ? item.date : 'Not Available'}</span> {/* Show 'Not Available' if score is missing */}
                  </div>
                  <div className="mb-2">
                    <strong className="text-gray-700">City:</strong>
                    <span>{item.cityName || 'Not Available'}</span> {/* Show 'Not Available' if the field is empty */}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>No data available for this city.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default City;
