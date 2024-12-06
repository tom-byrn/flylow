import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const location = useLocation();
  const { from, to } = location.state || { from: "Unknown", to: "Unknown" };
  const { departureDate, returnDate } = location.state || { departureDate: "Unknown", returnDate: "Unknown" };
  const { nearbyAirports } = location.state || { nearbyAirports: false };

  // State for API results
  const [flightResults, setFlightResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightData = async () => {
      try {
        // Get API key from environment variables
        const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
        const apiUrl = `https://api.rapidapi.com/v1/flights?from=${from}&to=${to}&departure_date=${departureDate}&return_date=${returnDate}&nearby=${nearbyAirports}`;
        
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': 'api.rapidapi.com',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch flight data.');
        }

        const data = await response.json();
        setFlightResults(data.flights); // Assuming the API response contains a "flights" array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching flight data:', error);
        setError('Failed to load flight data. Please try again later.');
        setLoading(false);
      }
    };

    if (from !== "Unknown" && to !== "Unknown" && departureDate !== "Unknown") {
      fetchFlightData();
    }
  }, [from, to, departureDate, returnDate, nearbyAirports]);

  {/* Relaying information provided */}
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold">Search Results</h1>
      <p className="mt-4 text-lg">From: {from}</p>
      <p className="mt-2 text-lg">To: {to}</p>
      <p className="mt-4 text-lg">Departure Date: {departureDate}</p>
      <p className="mt-2 text-lg">Return Date: {returnDate}</p>
      <p className="mt-2 text-lg">Nearby Airports Allowed: {nearbyAirports ? "Yes" : "No"}</p>

      {/* Flight Results Section */}
      <div className="mt-10 w-full max-w-4xl p-4 bg-white rounded-lg shadow-md">
        {loading ? (
          <p>Loading flight data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">Available Flights</h2>
            {flightResults.length > 0 ? (
              <ul>
                {flightResults.map((flight, index) => (
                  <li key={index} className="mb-4 p-4 border rounded-md">
                    <p><strong>Airline:</strong> {flight.airline}</p>
                    <p><strong>Price:</strong> ${flight.price}</p>
                    <p><strong>Duration:</strong> {flight.duration}</p>
                    <p><strong>Departure Time:</strong> {flight.departure_time}</p>
                    <p><strong>Arrival Time:</strong> {flight.arrival_time}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No flights available for the selected criteria.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
