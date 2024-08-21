import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlightBooking = ({ selectedFlight, onBookingComplete, onBack }) => {
  const [bookingStep, setBookingStep] = useState('details'); // 'details', 'confirmation'
  const [passengerDetails, setPassengerDetails] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    numSeats: 1,
  });
  const [bookingConfirmation, setBookingConfirmation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalPrice, setTotalPrice] = useState(selectedFlight.price);

  useEffect(() => {
    setTotalPrice(selectedFlight.price * passengerDetails.numSeats);
  }, [passengerDetails.numSeats, selectedFlight.price]);

  const handlePassengerDetailsChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;
    let error = null;

    if (name === 'numSeats') {
      const numSeats = parseInt(value);
      if (numSeats > selectedFlight.available_seats) {
        error = `Maximum available seats: ${selectedFlight.available_seats}`;
        return;
      }
    } else if (name === 'cardNumber') {
      formattedValue = value.replace(/\D/g, '').slice(0, 16);
      if (formattedValue.length < 16) {
        error = 'Card number must be 16 digits';
      }
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
      if (formattedValue.length === 2) formattedValue += '/';
      if (formattedValue.length < 5) {
        error = 'Expiry date must be in MM/YY format';
      }
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 3);
      if (formattedValue.length < 3) {
        error = 'CVV must be 3 digits';
      }
    }

    setError(error);
    setPassengerDetails(prevDetails => ({
      ...prevDetails,
      [name]: name === 'numSeats' ? parseInt(formattedValue) : formattedValue
    }));
  };
 console.log(passengerDetails)
  const handlePassengerDetailsSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/flights/book`, {
        flight_id: selectedFlight.id,
        passenger_name: passengerDetails.name,
        passenger_email: passengerDetails.email,
        credit_card_number: passengerDetails.cardNumber,
        credit_card_expiry_date: passengerDetails.expiryDate,
        credit_card_cvv: passengerDetails.cvv,
        number_seats:passengerDetails.numSeats,
      });
      setBookingConfirmation(response.data);
      setBookingStep('confirmation');
    } catch (error) {
      console.error('Error booking flight:', error);
      setError('An error occurred while booking the flight. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>

      {bookingStep === 'details' && (
        <>
          <div className="mb-8 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded-md">
            <h2 className="text-xl font-semibold mb-2">Selected Flight Details</h2>
            <p><strong>From:</strong> {selectedFlight.departure_airport}</p>
            <p><strong>To:</strong> {selectedFlight.arrival_airport}</p>
            <p><strong>Departure:</strong> {new Date(selectedFlight.departure_time).toLocaleString()}</p>
            <p><strong>Price per seat:</strong> ${selectedFlight.price}</p>
            <p><strong>Available Seats:</strong> {selectedFlight.available_seats}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Passenger Details</h2>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back to Search
            </button>
          </div>
          <form onSubmit={handlePassengerDetailsSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={passengerDetails.name}
              onChange={handlePassengerDetailsChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={passengerDetails.email}
              onChange={handlePassengerDetailsChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
            <input
              type="text"
              id="cardNumber"
              name="cardNumber"
              value={passengerDetails.cardNumber || ''}
              onChange={handlePassengerDetailsChange}
              placeholder="1234 5678 9012 3456"
              required
              maxLength="16"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {error && error.includes('Card number') && <p className="text-red-600 mt-1">{error}</p>}
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={passengerDetails.expiryDate || ''}
                onChange={handlePassengerDetailsChange}
                placeholder="MM/YY"
                required
                maxLength="5"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {error && error.includes('Expiry date') && <p className="text-red-600 mt-1">{error}</p>}
            </div>
            <div className="flex-1">
              <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
              <input
                type="text"
                id="cvv"
                name="cvv"
                value={passengerDetails.cvv || ''}
                onChange={handlePassengerDetailsChange}
                placeholder="123"
                required
                maxLength="3"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              {error && error.includes('CVV') && <p className="text-red-600 mt-1">{error}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="numSeats" className="block text-sm font-medium text-gray-700">Number of Seats</label>
            <input
              type="number"
              id="numSeats"
              name="numSeats"
              value={passengerDetails.numSeats}
              onChange={handlePassengerDetailsChange}
              min="1"
              max={selectedFlight.available_seats}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {error && <p className="text-red-600 mt-1">{error}</p>}
          </div>
          <div>
            <p className="text-lg font-semibold">Total Price: ${totalPrice}</p>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </form>
        </>
      )}

      {bookingStep === 'confirmation' && bookingConfirmation && (
        <div className="mt-8 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Booking Confirmed!</h2>
          <p>Your booking for the flight from {selectedFlight.departure_airport} to {selectedFlight.arrival_airport} has been confirmed.</p>
          <p>Number of seats: {passengerDetails.numSeats}</p>
          <p>Total price: ${totalPrice}</p>
          <p>Booking reference: {bookingConfirmation.reference}</p>
          <button
            onClick={onBookingComplete}
            className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Back to Search
          </button>
        </div>
      )}

      {error && (
        <p className="text-red-600 mt-4">{error}</p>
      )}
    </div>
  );
};

export default FlightBooking;
