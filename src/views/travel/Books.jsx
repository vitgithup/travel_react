import React, { useState, useEffect } from 'react';
import axiosClient from '../../axios';
import BookDetail from '../../components/book/BookDetail';

const Books = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBooking, setEditedBooking] = useState(null);

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking);
    setIsEditing(false);
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null);
    setIsEditing(false);
    setEditedBooking(null);
  };

  const handleEditBooking = () => {
    setIsEditing(true);
    setEditedBooking({ ...selectedBooking });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axiosClient.put(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/${editedBooking.id}`, editedBooking);
      const updatedBooking = response.data.data;
      setBookings(bookings.map(booking => booking.id === updatedBooking.id ? updatedBooking : booking));
      setFilteredBookings(filteredBookings.map(booking => booking.id === updatedBooking.id ? updatedBooking : booking));
      setSelectedBooking(updatedBooking);
      setIsEditing(false);
      setEditedBooking(null);
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('An error occurred while updating the booking. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBooking(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axiosClient.get(`${import.meta.env.VITE_API_BASE_URL}/api/bookings`);
      setBookings(response.data.data);
      setFilteredBookings(response.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('An error occurred while fetching bookings. Please try again.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const filtered = bookings.filter(booking =>
      (booking.passenger_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.passenger_email.toLowerCase().includes(searchTerm.toLowerCase())
      ) &&
      (!filterDate || new Date(booking.flight.departure_time).toDateString() === new Date(filterDate).toDateString())
    );
    setFilteredBookings(filtered);
  }, [searchTerm, filterDate, bookings]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-600">{error}</div>;

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:space-x-4">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 md:mb-0"
        />
        <input
          type="date"
          value={filterDate}
          onChange={handleDateFilterChange}
          className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filteredBookings.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Passenger</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Departure</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seats</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.passenger_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.passenger_email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.flight.departure_airport}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.flight.arrival_airport}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(booking.flight.departure_time).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{booking.number_seats}</td>
                  <td className="px-6 py-4 whitespace-nowrap">${booking.total_cost}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleViewDetails(booking)}
                      className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                    >
                      🔍
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600">No bookings found</p>
      )}

      {selectedBooking && (
        <BookDetail editedBooking={editedBooking} selectedBooking= {selectedBooking} isEditing = {isEditing}  handleCloseDetails = {handleCloseDetails}  
        handleSaveEdit={handleSaveEdit} handleEditBooking={handleEditBooking} handleInputChange={handleInputChange}/>

      )}
    </div>
  );
};

export default Books;
