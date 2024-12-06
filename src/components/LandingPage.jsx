import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [airports, setAirports] = useState([]); 
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [nearbyAirports, setNearbyAirports] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const response = await fetch("/information/airports.json");
        if (!response.ok) throw new Error("Failed to load airport data.");
        const data = await response.json();
        setAirports(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching airport data:", error);
        setError("Failed to load airport data.");
        setLoading(false);
      }
    };

    fetchAirports();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Handle input changes and filter suggestions
  const handleInputChange = (value, type) => {
    const filterSuggestions = (inputValue) => {
      return airports.filter(
        (airport) =>
          (airport["IATA"] &&
            airport["IATA"].toLowerCase().includes(inputValue.toLowerCase())) ||
          (airport["Airport name"] &&
            airport["Airport name"]
              .toLowerCase()
              .includes(inputValue.toLowerCase())) ||
          (airport["City"] &&
            airport["City"].toLowerCase().includes(inputValue.toLowerCase()))
      );
    };

    if (type === "from") {
      setFromInput(value); // Update input
      if (value.length >= 3) {
        setFromSuggestions(filterSuggestions(value));
      } else {
        setFromSuggestions([]); // Clear suggestions if less than 3 characters
      }
    } else if (type === "to") {
      setToInput(value);
      if (value.length >= 3) {
        setToSuggestions(filterSuggestions(value));
      } else {
        setToSuggestions([]);
      }
    }
  };

  // Handle selecting an airport from suggestions
  const handleSelect = (airport, type) => {
    const displayText = `${airport["City"]} (${airport["IATA"] || "N/A"})`;
    if (type === "from") {
      setFromInput(displayText);
      setFromSuggestions([]);
    } else if (type === "to") {
      setToInput(displayText);
      setToSuggestions([]);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/search-results", {
      state: {
        from: fromInput,
        to: toInput,
        departureDate: departureDate,
        returnDate: returnDate,
        nearbyAirports: nearbyAirports,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-400 via-orange-400 to-red-400 flex flex-col items-center pb-20">
      <nav className="w-full py-4 px-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-white cursor-default">Flylow</h1>
        <button className="bg-red-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-600 transition duration-300">
          Sign In
        </button>
      </nav>

      <header className="flex flex-col items-center text-center mt-10 px-6">
        <h2 className="text-5xl font-bold italic text-white mb-6 animate-bounce transition-transform duration-500 cursor-default">
          Fly more, pay less
        </h2>
        <p className="text-xl text-white mb-8 cursor-default">
          Enter your travel requirements below and receive updates about when
          the best time to book is
        </p>
        <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white p-8 rounded-lg shadow-md">
          {/* "From" Input */}
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-lg font-semibold mb-2"
              htmlFor="fromLocation"
            >
              From
            </label>
            <input
              type="text"
              id="fromLocation"
              placeholder="Where are you flying from?"
              value={fromInput}
              onChange={(e) => handleInputChange(e.target.value, "from")}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-red-400"
            />
            {fromSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-48 overflow-y-auto">
                {fromSuggestions.map((airport) => (
                  <li
                    key={airport["IATA"]}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelect(airport, "from")}
                  >
                    {airport["City"]} ({airport["IATA"]}) - {airport["Airport name"]}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* "To" Input */}
          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-lg font-semibold mb-2"
              htmlFor="toLocation"
            >
              To
            </label>
            <input
              type="text"
              id="toLocation"
              placeholder="Where are you looking to fly to?"
              value={toInput}
              onChange={(e) => handleInputChange(e.target.value, "to")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-400"
            />
            {toSuggestions.length > 0 && (
              <ul className="absolute z-10 bg-white border border-gray-300 rounded-md w-full max-h-48 overflow-y-auto">
                {toSuggestions.map((airport) => (
                  <li
                    key={airport["IATA"]}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSelect(airport, "to")}
                  >
                    {airport["City"]} ({airport["IATA"]}) - {airport["Airport name"]}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-8">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={nearbyAirports}
                onChange={(e) => setNearbyAirports(e.target.checked)}
                className="form-checkbox text-red-500"
              />
              <span className="ml-2 text-gray-700 text-lg">
                I'm okay travelling to/from nearby airports
              </span>
            </label>
          </div>

          <div className="flex justify-between gap-4 mb-4">
            <div className="w-1/2">
              <label
                className="block text-gray-700 text-lg font-semibold mb-2"
                htmlFor="departureDate"
              >
                Departure Date
              </label>
              <input
                type="date"
                id="departureDate"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-400"
              />
            </div>
            <div className="w-1/2">
              <label
                className="block text-gray-700 text-lg font-semibold mb-2"
                htmlFor="returnDate"
              >
                Return Date (Optional)
              </label>
              <input
                type="date"
                id="returnDate"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-red-400"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition duration-300"
          >
            Search Flights
          </button>
        </form>
      </header>
    </div>
  );
};

export default LandingPage;
