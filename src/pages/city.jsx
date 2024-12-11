import React from 'react';
import { useParams } from 'react-router-dom';

const City = () => {
  const { cityName } = useParams();

  return (
    <div className="flex items-center justify-center h-screen ml-64">
      <h1 className="text-3xl font-bold">
        Welcome to {cityName}
      </h1>
    </div>
  );
};

export default City;
