import React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FaCheckCircle, FaHotel, FaClock, FaUser, FaChild, FaMoneyBillWave, FaUtensils } from "react-icons/fa"

const HourlyStayBookingSuccessful = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    fullName,
    roomDetails,
    guestsCount,
    childrenCount,
    totalPrice,
    checkInDate,
    checkOutDate,
    checkInTime,
    duration,
    hotelName,
    mealInfo,
  } = location.state || {}

  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <div className="container">
      <div className="min-vh-100 bg-light mt-4">
        <div style={{ backgroundColor: "#003B94" }} className="text-white py-4 rounded">
          <div className="container">
            <h1 className="h4 mb-0 text-center">Hourly Stay Booking Confirmed</h1>
          </div>
        </div>

        <div className="container py-5">
          <div className="card shadow-lg border-0 mb-4">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <FaCheckCircle className="text-success" size={48} />
                <h2 className="h4 mt-3">Thank you, {fullName}!</h2>
                <p className="text-muted">Your hourly stay booking has been confirmed.</p>
              </div>

              <div className="border-bottom pb-3 mb-3">
                <h3 style={{ color: "#003B94" }} className="h5 mb-3">
                  <FaHotel className="me-2" />
                  Hotel Details
                </h3>
                <p className="mb-1">
                  <strong>Hotel:</strong> {hotelName}
                </p>
                <p className="mb-0">
                  <strong>Room Type:</strong> {roomDetails?.name}
                </p>
              </div>

              <div className="border-bottom pb-3 mb-3">
                <h3 style={{ color: "#003B94" }} className="h5 mb-3">
                  <FaClock className="me-2" />
                  Stay Details
                </h3>
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <p className="mb-0">
                      <strong>Check-in:</strong> {formatDate(checkInDate)}
                    </p>
                  </div>
                  <div className="col-md-6 mb-2">
                    <p className="mb-0">
                      <strong>Check-out:</strong> {formatDate(checkOutDate)}
                    </p>
                  </div>
                </div>
                <p className="mb-1">
                  <strong>Check-in Time:</strong> {checkInTime}
                </p>
                <p className="mb-0">
                  <strong>Duration:</strong> {duration} hours
                </p>
              </div>

              <div className="border-bottom pb-3 mb-3">
                <h3 style={{ color: "#003B94" }} className="h5 mb-3">
                  <FaUser className="me-2" />
                  Guest Information
                </h3>
                <p className="mb-1">
                  <strong>Guest Name:</strong> {fullName}
                </p>
                <p className="mb-1">
                  <FaUser className="me-2" />
                  {guestsCount} Adults
                </p>
                <p className="mb-0">
                  <FaChild className="me-2" />
                  {childrenCount} Children
                </p>
              </div>

              <div className="border-bottom pb-3 mb-3">
                <h3 style={{ color: "#003B94" }} className="h5 mb-3">
                  <FaUtensils className="me-2" />
                  Meal Information
                </h3>
                <p className="mb-0">
                  <strong>Meal:</strong> {mealInfo}
                </p>
              </div>

              <div>
                <h3 style={{ color: "#003B94" }} className="h5 mb-3">
                  <FaMoneyBillWave className="me-2" />
                  Payment Details
                </h3>
                <p className="mb-1">
                  <strong>Total Price:</strong> ₹{totalPrice?.toFixed(2)}
                </p>
                <p className="mb-0">
                  <strong>Payment Status:</strong> <span className="text-success">Paid</span>
                </p>
              </div>
            </div>
          </div>

          <div className="card shadow-lg border-0 mb-4">
            <div className="card-body p-4">
              <h3 style={{ color: "#003B94" }} className="h5 mb-3">
                Important Information
              </h3>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">• Your room will be ready at your selected check-in time: {checkInTime}</li>
                <li className="mb-2">• Your stay duration is {duration} hours</li>
                <li className="mb-2">• Please vacate the room promptly at the end of your booked duration</li>
                <li>• Please present a valid ID at check-in</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="btn w-100 py-3 fs-5 fw-bold"
            style={{ backgroundColor: "#003B94", color: "white" }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default HourlyStayBookingSuccessful

