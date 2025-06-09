import React, { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import { FaCheckCircle, FaHotel, FaCalendarAlt, FaUser, FaChild, FaMoneyBillWave } from "react-icons/fa"
import { doc, getDoc } from "firebase/firestore"
import { db, auth } from "../../firebase/config"

const BookingSuccessful = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { bookingId } = useParams()
  const [bookingData, setBookingData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const bookingRef = doc(db, "Users", auth.currentUser.uid, "Bookings", bookingId)
        const bookingSnap = await getDoc(bookingRef)

        if (bookingSnap.exists()) {
          setBookingData(bookingSnap.data())
        } else {
          setError("Booking not found")
        }
      } catch (err) {
        console.error("Error fetching booking data:", err)
        setError("Failed to fetch booking data")
      } finally {
        setLoading(false)
      }
    }

    fetchBookingData()
  }, [bookingId])

  const formatDate = (dateString) => {
    const options = { weekday: "short", month: "short", day: "numeric", year: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!bookingData) return <div>No booking data found</div>

  const {
    "Full Name": fullName,
    Rooms: roomDetails,
    "Total Adults": guestsCount,
    "Total Children": childrenCount,
    "Total Price": totalPrice,
    "Check-In Date": checkInDate,
    "Check-Out Date": checkOutDate,
    "Property Name": propertyName,
    "Property Address": propertyAddress,
  } = bookingData

  return (
    <div className="">
      <div className="min-vh-100 bg-light">
        <div className="container py-5">
          <div className="row">
            <div className="col-lg-8">
              <div className="card shadow-lg border-0 mb-4">
                <div className="card-header p-4" style={{ backgroundColor: "#038A5E" }}>
                  <h2 className="h4 mb-0 text-center text-white">Booking Confirmed</h2>
                </div>
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <FaCheckCircle className="text-success" size={48} />
                    <h2 className="h4 mt-3">Thank you, {fullName}!</h2>
                    <p className="text-muted">Your booking has been confirmed.</p>
                  </div>

                  <div className="border-bottom pb-3 mb-3">
                    <h3 style={{ color: "#038A5E" }} className="h5 mb-3">
                      <FaHotel className="me-2" />
                      Hotel Details
                    </h3>
                    <p className="mb-1">
                      <strong>Hotel:</strong> {propertyName}
                    </p>
                    <p className="mb-0">
                      <strong>Address:</strong> {propertyAddress}
                    </p>
                  </div>

                  <div className="border-bottom pb-3 mb-3">
                    <h3 style={{ color: "#038A5E" }} className="h5 mb-3">
                      <FaCalendarAlt className="me-2" />
                      Stay Details
                    </h3>
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <p className="mb-0">
                          <strong>Check-in:</strong> {formatDate(checkInDate.toDate())}
                        </p>
                      </div>
                      <div className="col-md-6 mb-2">
                        <p className="mb-0">
                          <strong>Check-out:</strong> {formatDate(checkOutDate.toDate())}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card shadow-lg border-0 mb-4">
                <div className="card-body p-4">
                  <h3 style={{ color: "#038A5E" }} className="h5 mb-3">
                    Room Details
                  </h3>
                  {roomDetails.map((room, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <h4 className="h6" style={{ color: "#038A5E" }}>
                          {room.roomType}
                        </h4>
                        <p className="mb-1">
                          <FaUser className="me-2" />
                          Adults: {room.guestCount - room.childrenCount}, Children: {room.childrenCount}
                        </p>
                        <p className="mb-1">
                          <FaMoneyBillWave className="me-2" />
                          Price: ₹{room.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div className="mt-3">
                    <h3 style={{ color: "#038A5E" }} className="h5 mb-3">
                      <FaMoneyBillWave className="me-2" />
                      Payment Details
                    </h3>
                    <p className="mb-1">
                      <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}
                    </p>
                    <p className="mb-0">
                      <strong>Booking Status:</strong> <span className="text-success">Booked</span>
                    </p>
                  </div>
                </div>
              </div>

              <button
                style={{ backgroundColor: "#038A5E" }}
                onClick={() => navigate("/")}
                className="btn w-100 py-3 text-white fs-5 fw-bold"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingSuccessful

