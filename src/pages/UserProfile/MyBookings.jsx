import { useState, useEffect } from "react"
import { getFirestore, collection, getDocs, updateDoc, doc } from "firebase/firestore"
import { ChevronLeft, MapPin, Eye, List, Grid } from "lucide-react"
import CancelBookingPopup from "../../components/CancelBookingPopup"

const customRedColor = "#003B94"

const formatDate = (timestamp, format = "short") => {
  if (!timestamp || !timestamp.toDate || typeof timestamp.toDate !== "function") {
    return "N/A"
  }
  try {
    const date = timestamp.toDate()
    if (format === "short") {
      return date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, ".")
    } else {
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    }
  } catch (error) {
    console.error("Error formatting date:", error)
    return "Invalid Date"
  }
}

function BookingDetails({ booking, onBack, onCancel }) {
  const roomDetails = booking.Rooms && booking.Rooms.length > 0 ? booking.Rooms[0] : null

  return (
    <div className="min-vh-100 w-100 ">
      <div style={{ backgroundColor: customRedColor }} className="text-white p-3 w-100 ">
        <button
          onClick={onBack}
          className="btn text-white p-0 mb-2 d-flex align-items-center border-0"
          style={{ background: "transparent" }}
        >
          <ChevronLeft size={24} />
          <span className="ms-1">Back</span>
        </button>
        <h1 className="h4 mb-0">Your Booking Details</h1>
      </div>

      <div className="container px-3 py-3 w-100">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-3 p-md-4">
            <div className="mb-4">
              <h2 className="h5 mb-2" style={{ color: customRedColor }}>
                {booking["Property Name"]}
              </h2>
              {booking["Property Address"] && (
                <div className="d-flex align-items-center text-muted">
                  <MapPin size={18} className="me-2" />
                  <span>{booking["Property Address"]}</span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <h3 className="h6 mb-3">{booking["Full Name"]}</h3>
              <div className="row g-3">
                <div className="col-6">
                  <p className="text-muted small mb-1">Check In</p>
                  <p className="fw-bold" style={{ color: customRedColor }}>
                    {booking["Check-In Date"] ? formatDate(booking["Check-In Date"], "long") : "N/A"}
                  </p>
                </div>
                <div className="col-6">
                  <p className="text-muted small mb-1">Check Out</p>
                  <p className="fw-bold" style={{ color: customRedColor }}>
                    {booking["Check-Out Date"] ? formatDate(booking["Check-Out Date"], "long") : "N/A"}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-muted small mb-1">Stay Duration</p>
                <p className="fw-bold">{booking["Total Nights"]} night</p>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="h6 mb-3">Selected Rooms</h4>
              {roomDetails ? (
                <>
                  <p className="mb-2">Room Type: {roomDetails.roomType || "Standard Room"}</p>
                  <p className="mb-1">Adults: {roomDetails.guestCount || 0}</p>
                  <p className="mb-1">Children: {roomDetails.childrenCount || 0}</p>
                  <p className="mb-1">Price: ₹{booking["Total Price"].toFixed(2)}</p>
                </>
              ) : (
                <p className="text-muted">No room details available</p>
              )}
            </div>

            <div>
              <h4 className="h6 mb-3">Booking Summary</h4>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <p className="fw-bold mb-0">Total Price</p>
                <p className="fw-bold mb-0" style={{ color: customRedColor }}>
                  ₹{booking["Total Price"].toFixed(2)}
                </p>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <p className="fw-bold mb-0">Booking Status</p>
                <p className="mb-0" style={{ color: customRedColor }}>
                  {booking["Status"]}
                </p>
              </div>
            </div>
            {booking.Status === "Booked" && new Date(booking["Check-In Date"].toDate()) > new Date() && (
              <button
                onClick={() => onCancel(booking.id)}
                className="btn btn-primary mt-3"
                style={{ backgroundColor: customRedColor, borderColor: customRedColor }}
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function MyBookings({ userId }) {
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [bookings, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState(null)
  const [layout, setLayout] = useState("grid")

  useEffect(() => {
    const fetchBookings = async () => {
      const db = getFirestore()
      const bookingsRef = collection(db, "Users", userId, "Bookings")
      const bookingsSnapshot = await getDocs(bookingsRef)

      const bookingsData = bookingsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      setBookings(bookingsData)
      setFilteredBookings(bookingsData)
      setIsLoading(false)
    }

    fetchBookings()
  }, [userId])

  useEffect(() => {
    const now = new Date()
    const filtered = bookings.filter((booking) => {
      const checkOutDate =
        booking["Check-Out Date"] && booking["Check-Out Date"].toDate ? booking["Check-Out Date"].toDate() : null
      switch (filter) {
        case "booked":
          return booking["Status"] === "Booked" && checkOutDate && checkOutDate > now
        case "cancelled":
          return booking["Status"] === "Cancelled"
        case "past":
          return checkOutDate && checkOutDate < now
        default:
          return true
      }
    })
    setFilteredBookings(filtered)
  }, [filter, bookings])

  const cancelBooking = async (bookingId) => {
    setBookingToCancel(bookingId)
    setIsPopupOpen(true)
  }

  const confirmCancelBooking = async () => {
    const db = getFirestore()

    try {
      const bookingRef = doc(db, "Users", userId, "Bookings", bookingToCancel)
      await updateDoc(bookingRef, { Status: "Cancelled" })

      setBookings((prevBookings) =>
        prevBookings.map((booking) => (booking.id === bookingToCancel ? { ...booking, Status: "Cancelled" } : booking)),
      )

      alert("Booking cancelled successfully")
      setSelectedBooking(null)
    } catch (error) {
      console.error("Error cancelling booking:", error)
      alert("Failed to cancel booking. Please try again.")
    } finally {
      setIsPopupOpen(false)
      setBookingToCancel(null)
    }
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center w-100 " style={{ height: "400px" }}>
        <div className="spinner-border" role="status" style={{ color: customRedColor }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (selectedBooking) {
    return <BookingDetails booking={selectedBooking} onBack={() => setSelectedBooking(null)} onCancel={cancelBooking} />
  }

  return (
    <div className="container px-3 py-3 h-100 ">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h2 className="h4 mb-3 mb-md-0">My Bookings</h2>
        <div className="d-flex flex-column flex-md-row gap-2">
          <div className="btn-group">
            <button
              className={`btn ${filter === "all" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("all")}
              style={{
                backgroundColor: filter === "all" ? customRedColor : "transparent",
                borderColor: customRedColor,
                color: filter === "all" ? "white" : customRedColor,
              }}
            >
              All
            </button>
            <button
              className={`btn ${filter === "booked" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("booked")}
              style={{
                backgroundColor: filter === "booked" ? customRedColor : "transparent",
                borderColor: customRedColor,
                color: filter === "booked" ? "white" : customRedColor,
              }}
            >
              Booked
            </button>
            <button
              className={`btn ${filter === "cancelled" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("cancelled")}
              style={{
                backgroundColor: filter === "cancelled" ? customRedColor : "transparent",
                borderColor: customRedColor,
                color: filter === "cancelled" ? "white" : customRedColor,
              }}
            >
              Cancelled
            </button>
            <button
              className={`btn ${filter === "past" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setFilter("past")}
              style={{
                backgroundColor: filter === "past" ? customRedColor : "transparent",
                borderColor: customRedColor,
                color: filter === "past" ? "white" : customRedColor,
              }}
            >
              Past
            </button>
          </div>
          <div className="btn-group mt-2 mt-md-0 d-none d-md-flex">
            <button
              className={`btn ${layout === "list" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setLayout("list")}
              style={{
                backgroundColor: layout === "list" ? customRedColor : "transparent",
                borderColor: customRedColor,
                color: layout === "list" ? "white" : customRedColor,
              }}
            >
              <List size={18} />
            </button>
            <button
              className={`btn ${layout === "grid" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setLayout("grid")}
              style={{
                backgroundColor: layout === "grid" ? customRedColor : "transparent",
                borderColor: customRedColor,
                color: layout === "grid" ? "white" : customRedColor,
              }}
            >
              <Grid size={18} />
            </button>
          </div>
        </div>
      </div>

      {filteredBookings.length === 0 ? (
        <div className="text-center py-5">
          <h3 className="text-muted">No bookings found</h3>
        </div>
      ) : (
        <div className={`row g-4 ${layout === "grid" ? "row-cols-1 row-cols-md-2 row-cols-lg-3" : ""}`}>
          {filteredBookings.map((booking) => (
            <div key={booking.id} className={layout === "list" ? "col-12" : "col"}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body p-3 p-md-4">
                  <div className={layout === "list" ? "row" : ""}>
                    <div className={layout === "list" ? "col-md-3 mb-3 mb-md-0" : "mb-3"}>
                      {booking["Property Images"] && booking["Property Images"].length > 0 ? (
                        <img
                          src={booking["Property Images"][0] || "/placeholder.svg"}
                          alt="Property"
                          className="img-fluid rounded w-100 h-100 object-fit-cover"
                          style={{ maxHeight: layout === "list" ? "200px" : "150px" }}
                        />
                      ) : (
                        <div
                          className="bg-secondary rounded w-100 h-100 d-flex justify-content-center align-items-center"
                          style={{ maxHeight: layout === "list" ? "200px" : "150px" }}
                        >
                          <span className="text-white">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className={layout === "list" ? "col-md-9" : ""}>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h2 className="h5" style={{ color: customRedColor }}>
                          {booking["Property Name"]}
                        </h2>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setSelectedBooking(booking)}
                          style={{ borderColor: customRedColor, color: customRedColor }}
                        >
                          <Eye size={18} />
                          <span className="ms-1 d-none d-sm-inline">Details</span>
                        </button>
                      </div>
                      <div className="d-flex flex-wrap gap-3 mb-3">
                        <div>
                          <p className="text-muted small mb-1">Check In</p>
                          <p className="fw-bold mb-0">{formatDate(booking["Check-In Date"])}</p>
                        </div>
                        <div>
                          <p className="text-muted small mb-1">Check Out</p>
                          <p className="fw-bold mb-0">{formatDate(booking["Check-Out Date"])}</p>
                        </div>
                        <div>
                          <p className="text-muted small mb-1">Status</p>
                          <p className="fw-bold mb-0" style={{ color: customRedColor }}>
                            {booking["Status"]}
                          </p>
                        </div>
                      </div>
                      {booking.Rooms && booking.Rooms.length > 0 && (
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <span className="badge bg-light text-dark">Room Type: {booking.Rooms[0].roomType}</span>
                          <span className="badge bg-light text-dark">Adults: {booking.Rooms[0].guestCount}</span>
                          <span className="badge bg-light text-dark">Children: {booking.Rooms[0].childrenCount}</span>
                          <span className="badge bg-light text-dark">₹{booking["Total Price"].toFixed(2)}</span>
                        </div>
                      )}
                      {booking.Status === "Booked" && new Date(booking["Check-In Date"].toDate()) > new Date() && (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="btn btn-sm btn-primary mt-2"
                          style={{ backgroundColor: customRedColor, borderColor: customRedColor }}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <CancelBookingPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} onConfirm={confirmCancelBooking} />
    </div>
  )
}

export default MyBookings

