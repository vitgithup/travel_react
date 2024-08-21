import React from 'react'
import ViewHistory from './ViewHistory'

function BookDetail({editedBooking, selectedBooking, isEditing  ,handleCloseDetails , handleSaveEdit ,handleEditBooking,handleInputChange
}) {


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={handleCloseDetails}>
    <div className="relative top-20 mx-auto p-2 border w-[350px] shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
      <div className="mt-3 text-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Booking Details</h3>
        <div className="mt-2 px-3 py-3">
          {isEditing ? (
            <>
              <label >Passenger Name</label>
              <input
                type="text"
                name="passenger_name"
                value={editedBooking.passenger_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <label >Passenger Email</label>
              <input
                type="email"
                name="passenger_email"
                value={editedBooking.passenger_email}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <label >Number Seats</label>
              <input
                type="number"
                name="number_seats"
                value={editedBooking.number_seats}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Passenger: {selectedBooking.passenger_name}
              </p>
              <p className="text-sm text-gray-500">
                Email: {selectedBooking.passenger_email}
              </p>
              <p className="text-sm text-gray-500">
                From: {selectedBooking.flight.departure_airport}
              </p>
              <p className="text-sm text-gray-500">
                To: {selectedBooking.flight.arrival_airport}
              </p>
              <p className="text-sm text-gray-500">
                Departure: {new Date(selectedBooking.flight.departure_time).toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">
                Seats: {selectedBooking.number_seats}
              </p>
              <p className="text-sm text-gray-500">
                Total Cost: ${selectedBooking.total_cost}
              </p>
              {selectedBooking.credit_information && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700">Credit Information:</p>
                  <p className="text-sm text-gray-500">
                    Card Number: **** **** **** {selectedBooking.credit_information.credit_card_number.slice(-4)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expiry Date: {selectedBooking.credit_information.credit_card_expiry_date.slice(0, 2)}/{selectedBooking.credit_information.credit_card_expiry_date.slice(2, 4)}
                  </p>
                </div>
              )}

              {selectedBooking.log && (<ViewHistory logs={selectedBooking.log} />)}
            </>
          )}
        </div>
        <div className="items-center px-4 py-3">
          {isEditing ? (
            <button
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 mb-2"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={handleEditBooking}
              className="px-4 py-2 bg-yellow-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-300 mb-2"
            >
              Edit Booking
            </button>
          )}
          <button
            onClick={handleCloseDetails}
            className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Close
          </button>
        </div>
      </div>

    </div>
  </div>
  )
}

export default BookDetail