import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../firebase/firebaseconfig'; // Assuming firebase.js exports db

import { collection, getDocs } from 'firebase/firestore';

const City = () => {
  const { cityName } = useParams();
  const [cityData, setCityData] = useState([]); // State to store the data
  const [loading, setLoading] = useState(true); // State for loading indicator

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        // Check if the cityName is 'karachi' and fetch data from the karachi collection
        if (cityName === "karachi") {
          const querySnapshot = await getDocs(collection(db, "karachi"));
          const data = querySnapshot.docs.map(doc => doc.data()); // Extract data from each doc
          setCityData(data); // Store the data in state
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false); // Set loading to false when the data is fetched
      }
    };

    fetchCityData();
  }, [cityName]); // Run the effect when cityName changes

  return (
    <div className="flex items-center justify-center h-screen ml-64">
      {loading ? (
        <h2>Loading...</h2> // Show a loading message until data is fetched
      ) : (
        <>
          <h1 className="text-3xl font-bold">Welcome to {cityName}</h1>
          <div className="mt-5">
            <h2 className="text-xl">City Data:</h2>
            <ul>
              {cityData.length > 0 ? (
                cityData.map((item, index) => (
                  <li key={index}>{JSON.stringify(item)}</li> // Display each item as a string (adjust as needed)
                ))
              ) : (
                <li>No data available for {cityName}</li>
              )}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default City;
