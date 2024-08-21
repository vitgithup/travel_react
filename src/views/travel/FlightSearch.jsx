import React, { useState } from 'react';
import axios from 'axios';
import FlightBooking from './FlightBooking';

const FlightSearch = () => {
  const [searchParams, setSearchParams] = useState({
    departure_airport: '',
    arrival_airport: '',
    departure_date: '',
  });
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    if (name === 'departure_airport' || name === 'arrival_airport') {
      updatedValue = value.toUpperCase().slice(0, 3);
    }
    
    setSearchParams(prevParams => ({
      ...prevParams,
      [name]: updatedValue
    }));
  };


  const search = async (e) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/flights`, { params: searchParams });
      setFlights(response.data);
    } catch (error) {
      console.error('Error fetching flights:', error);
      setError('An error occurred while fetching flights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const response = await search();
  };

  const handleBooking = (flight) => {
    setSelectedFlight(flight);
  };

  const handleBookingComplete = () => {
    setSelectedFlight(null);
    search()
    
  };

  const handleBack = () => {
    setSelectedFlight(null);
    
  };

  return (
    <div className="pt-4">
      {!selectedFlight ? (
        <>
          <form onSubmit={handleSearch} className="mb-8 space-y-4">
            <div className="grid grid-cols-1  gap-4">
              <input
                type="text"
                name="departure_airport"
                value={searchParams.departure_airport}
                onChange={handleInputChange}
                placeholder="Departure Airport (3 letters [A-D])"
                maxLength={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
              <input
                type="text"
                name="arrival_airport"
                value={searchParams.arrival_airport}
                onChange={handleInputChange}
                placeholder="Arrival Airport (3 letters [A-D])"
                maxLength={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              />
              <input
                type="date"
                name="departure_date"
                value={searchParams.departure_date}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search Flights'}
            </button>
          </form>

          {error && (
            <p className="text-red-600 mb-4">{error}</p>
          )}

          {flights.length > 0 ? (
            <ul className="space-y-4">
              {flights.map(flight => (
                <li key={flight.id} className="bg-white p-4 rounded-md shadow flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {flight.departure_airport} to {flight.arrival_airport}
                    </p>
                    <p className="text-gray-600">
                      Departure: {new Date(flight.departure_time).toLocaleString()}
                    </p>
                    <p className="text-gray-600">
                      Available Seats: {flight.available_seats}
                    </p>
                    <p className="text-gray-600">
                      Price: ${flight.price}
                    </p>
                  </div>
                  <button
                    onClick={() => handleBooking(flight)}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Book
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600 text-center">No flights found</p>
          )}
        </>
      ) : (
        <FlightBooking
          selectedFlight={selectedFlight}
          onBookingComplete={handleBookingComplete}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default FlightSearch;
