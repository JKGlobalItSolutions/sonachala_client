import { useState, useEffect } from "react"
import { useLocation, useNavigate, useParams } from "react-router-dom"
import {
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaArrowRight,
  FaCalendarAlt,
  FaBed,
  FaUsers,
  FaExclamationTriangle,
  FaLock,
} from "react-icons/fa"
import "bootstrap/dist/css/bootstrap.min.css"
import Preloader from "./Preloader"
import ReservationIcon from "../../Images/Reservation/hotel-building-icon.png"
import { collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore"
import { auth, db } from "../../firebase/config"
import { toast } from "react-toastify"
import { signInWithEmailAndPassword } from "firebase/auth"

const HotelDetailsProvider = {
  async getHotelDetails(propertyId, collectionName) {
    try {
      const docRef = doc(db, collectionName, propertyId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data()
      } else {
        return null
      }
    } catch (e) {
      console.error("Error fetching hotel details:", e)
      return null
    }
  },
}

const GuestDetailsService = {
  async saveGuestDetails(guestDetails, propertyId, roomId, collectionName) {
    try {
      const bookingId = doc(collection(db, collectionName)).id
      const guestDetailsRef = doc(db, collectionName, propertyId, "Guest Details", bookingId)
      guestDetails.bookingId = bookingId
      await setDoc(guestDetailsRef, guestDetails)
      await setDoc(doc(db, "Users", auth.currentUser.uid, "Bookings", bookingId), guestDetails)
      return bookingId
    } catch (e) {
      console.error("Error:", e)
      throw new Error("Failed to save guest details: " + e.message)
    }
  },
}

const Reservation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { hotelId } = useParams()
  const [showPreloader, setShowPreloader] = useState(false)
  const [hotelDetails, setHotelDetails] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  const { roomDetails, totalPrice, checkInDate, checkOutDate } = location.state || {}

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
  })

  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    const fetchHotelDetails = async () => {
      const collections = ["Homestays", "Hotels"]
      let hotelData = null
      let collectionName = ""

      for (const collection of collections) {
        hotelData = await HotelDetailsProvider.getHotelDetails(hotelId, collection)
        if (hotelData) {
          collectionName = collection
          break
        }
      }

      if (hotelData) {
        setHotelDetails({ ...hotelData, collectionName })
      } else {
        console.error("Hotel not found")
      }
    }

    fetchHotelDetails()
  }, [hotelId])

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user)
    })
    return () => unsubscribe()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const isValidEmail = (email) => {
    const emailRegExp = /^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[a-zA-Z]+/
    return emailRegExp.test(email)
  }

  const isValidMobileNumber = (mobileNumber) => {
    const mobileRegExp = /^[0-9]{10}$/
    return mobileRegExp.test(mobileNumber)
  }

  const validateForm = () => {
    const errors = {}
    if (!formData.fullName.trim()) {
      errors.fullName = "Full Name is required"
    }
    if (!formData.email.trim()) {
      errors.email = "Email is required"
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = "Mobile Number is required"
    } else if (!isValidMobileNumber(formData.mobileNumber)) {
      errors.mobileNumber = "Please enter a valid 10-digit mobile number"
    }
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleReservation = async () => {
    if (!isLoggedIn) {
      setShowLoginForm(true)
      return
    }

    if (validateForm()) {
      setShowPreloader(true)
      try {
        const roomDetailsFormatted = roomDetails.map((room) => ({
          roomId: room.id,
          roomType: room.roomType,
          guestCount: room.adults + room.children,
          childrenCount: room.children,
          price: room.totalPrice,
          roomsCount: 1,
        }))

        const guestDetails = {
          "Full Name": formData.fullName,
          "Email Address": formData.email,
          "Phone Number": formData.mobileNumber,
          Rooms: roomDetailsFormatted,
          propertyId: hotelId,
          "Check-In Date": new Date(checkInDate),
          "Check-Out Date": new Date(checkOutDate),
          "Total Price": totalPrice,
          "Total Nights": roomDetails[0].nights,
          "Total Adults": roomDetails.reduce((sum, room) => sum + room.adults, 0),
          "Total Children": roomDetails.reduce((sum, room) => sum + room.children, 0),
          Status: "Booked",
          "Payment Method": "Check-In Pay",
          "Payment Status": "Pending",
          "Property Name": hotelDetails["Property Name"],
          "Property Address": hotelDetails["Property Address"],
          "Property Images": hotelDetails["Property Images"],
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        }

        const bookingId = await GuestDetailsService.saveGuestDetails(
          guestDetails,
          hotelId,
          roomDetails[0].id,
          hotelDetails.collectionName,
        )

        toast.success("Reservation created successfully!")
        navigate(`/Your-booking/${bookingId}`)
      } catch (error) {
        console.error("Error creating reservation:", error)
        toast.error("Failed to create reservation. Please try again.")
      } finally {
        setShowPreloader(false)
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setShowPreloader(true)
    try {
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword)
      toast.success("Logged in successfully!")
      setIsLoggedIn(true)
      setShowLoginForm(false)
    } catch (error) {
      console.error("Error signing in:", error)
      toast.error("Failed to login. Please check your credentials.")
    } finally {
      setShowPreloader(false)
    }
  }

  if (showPreloader) {
    return <Preloader />
  }

  const totalGuests = roomDetails?.reduce((sum, room) => sum + room.adults + room.children, 0) || 0
  const totalRooms = roomDetails?.length || 0
  const guestsAndRooms = `${totalGuests} Guests | ${totalRooms} Room${totalRooms > 1 ? "s" : ""}`

  return (
    <div className="min-vh-100 bg-light px-lg-5">
      <div className="container py-4 py-lg-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="card shadow-sm mb-3">
              <div className="card-body p-4">
                <div className="d-flex align-items-center ">
                  <FaMapMarkerAlt style={{ color: "#038A5E" }} className="me-2" />
                  <h3 className="h5 mb-0">{hotelDetails?.["Property Name"] || "Hotel Name"}</h3>
                </div>
                <p className="text-muted">{hotelDetails?.["Property Address"] || "Hotel Address"}</p>
              </div>
              <hr className="my-0" />
              <div className="card-body p-4">
                <h2 className="h4 mb-3" style={{ color: "#038A5E" }}>
                  Reservation Details
                </h2>
                <div className="row mb-3">
                  <div className="col-sm-6">
                    <p className="mb-1">
                      <FaCalendarAlt className="me-2" style={{ color: "#038A5E" }} />
                      <strong>Check-in:</strong> {checkInDate}
                    </p>
                  </div>
                  <div className="col-sm-6">
                    <p className="mb-1">
                      <FaCalendarAlt className="me-2" style={{ color: "#038A5E" }} />
                      <strong>Check-out:</strong> {checkOutDate}
                    </p>
                  </div>
                </div>
                <p className="mb-3">
                  <FaUsers className="me-2" style={{ color: "#038A5E" }} />
                  <strong>{guestsAndRooms}</strong>
                </p>
                <h3 className="h5 mb-2" style={{ color: "#038A5E" }}>
                  Selected Rooms
                </h3>
                {roomDetails?.map((room, index) => (
                  <div key={index} className="card mb-3">
                    <div className="card-body p-4">
                      <h4 className="h6" style={{ color: "#038A5E" }}>
                        {room.roomType}
                      </h4>
                      <p className="mb-1">
                        <FaUsers className="me-2" />
                        Adults: {room.adults}, Children: {room.children}
                      </p>
                      <p className="mb-1">
                        <FaBed className="me-2" />
                        Price: ₹{room.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {showLoginForm && !isLoggedIn ? (
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                  <h2 className="h4 mb-3" style={{ color: "#038A5E" }}>
                    Login to Make a Reservation
                  </h2>
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="loginEmail" className="form-label">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <input
                          type="email"
                          id="loginEmail"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="loginPassword" className="form-label">
                        Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <input
                          type="password"
                          id="loginPassword"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="form-control"
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Login
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="card shadow-sm mb-4">
                <div className="card-body p-4">
                  <h2 className="h4 mb-3" style={{ color: "#038A5E" }}>
                    Personal Details
                  </h2>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="fullName" className="form-label">
                        Full Name
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className={`form-control ${formErrors.fullName ? "is-invalid" : ""}`}
                          required
                        />
                      </div>
                      {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                          required
                        />
                      </div>
                      {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                    </div>
                    <div className="mb-3">
                      <label htmlFor="mobileNumber" className="form-label">
                        Mobile Number
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaPhone />
                        </span>
                        <input
                          type="tel"
                          id="mobileNumber"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleInputChange}
                          className={`form-control ${formErrors.mobileNumber ? "is-invalid" : ""}`}
                          required
                        />
                      </div>
                      {formErrors.mobileNumber && <div className="invalid-feedback">{formErrors.mobileNumber}</div>}
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm mb-4 sticky-top" style={{ top: "20px" }}>
              <div className="card-body p-4">
                <h2 className="h4 mb-3" style={{ color: "#038A5E" }}>
                  Total Cost Overview
                </h2>
                <div className="d-flex justify-content-between mb-2">
                  <span>Room Charge</span>
                  <span>₹{(totalPrice * 0.9).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Taxes & Fees</span>
                  <span>₹{(totalPrice * 0.1).toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-2 fw-bold">
                  <span>Total</span>
                  <span>₹{totalPrice.toFixed(2)}</span>
                </div>
                <div className="alert alert-warning mt-3" role="alert">
                  <FaExclamationTriangle className="me-2" />
                  <span className="fw-bold" style={{ fontSize: "1.1em" }}>
                    Best Price Guarantee! Book now to secure your reservation.
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="h5 mb-2">Payment Method</h3>
                  <div
                    className="d-flex align-items-center justify-content-between p-3 border rounded cursor-pointer"
                    onClick={handleReservation}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={ReservationIcon || "/placeholder.svg"}
                        alt="Reservation"
                        className="rounded-circle"
                        style={{ width: "40px", height: "40px" }}
                      />
                      <div className="ms-3">
                        <h4 className="h6 mb-1">Reservation</h4>
                        <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                          Pay when you check-in
                        </p>
                      </div>
                    </div>
                    <FaArrowRight />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Reservation

