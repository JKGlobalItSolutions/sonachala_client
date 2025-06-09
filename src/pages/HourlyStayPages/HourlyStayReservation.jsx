import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import {
  FaWifi,
  FaDumbbell,
  FaUtensils,
  FaBed,
  FaArrowLeft,
  FaCar,
  FaPlane,
  FaHotel,
  FaMapMarkerAlt,
  FaRegCalendarAlt,
  FaUser,
  FaSearch,
  FaCheck,
  FaShareAlt,
  FaClock,
  FaUserFriends,
  FaChild,
  FaIdCard,
  FaAirFreshener,
  FaTv,
  FaParking,
  FaCoffee,
  FaPhone,
} from "react-icons/fa"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"
import Preloader from "./Preloader"

const HotelDetails = ({ hotel }) => {
  return (
    <>
      <div className="card mb-4">
       
        <div className="card-body">
          <h3 className="h5 mb-3">{hotel.name}</h3>
          <p>
            <FaMapMarkerAlt className="me-2" />
            {hotel.location}
          </p>
          <div className="d-flex align-items-center mb-3">
            <div className="text-white px-2 py-1 rounded me-2" style={{ backgroundColor: "#003B94" }}>
              {hotel.rating}
            </div>
            <div>{hotel.reviews} reviews</div>
          </div>
          <p>{hotel.description}</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h5 mb-3">Hotel Amenities</h3>
          <div className="row">
            {hotel.facilities.map((facility, index) => (
              <div key={index} className="col-6 mb-2">
                <div className="d-flex align-items-center">
                  {facility === "Wi-Fi" && <FaWifi className="me-2" />}
                  {facility === "AC" && <FaAirFreshener className="me-2" />}
                  {facility === "TV" && <FaTv className="me-2" />}
                  {facility === "Room Service" && <FaUtensils className="me-2" />}
                  {facility === "Parking" && <FaParking className="me-2" />}
                  {facility === "Restaurant" && <FaCoffee className="me-2" />}
                  {facility}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h3 className="h5 mb-3">Hotel Policies</h3>
          <p>
            <strong>Child Policy:</strong> {hotel.childPolicy}
          </p>
          <p>
            <strong>Extra Bed Policy:</strong> {hotel.extraBedPolicy}
          </p>
          <p>
            <strong>ID Policy:</strong> {hotel.idPolicy}
          </p>
        </div>
      </div>
    </>
  )
}

const BookingSummary = ({
  checkInTime,
  selectedDuration,
  adults,
  children,
  rooms,
  getMealInfo,
  calculateTotalPrice,
}) => {
  return (
    <div className="card sticky-top" style={{ top: "20px" }}>
      <div className="card-body">
        <h3 className="h5 mb-3">Booking Summary</h3>
        <div className="d-flex justify-content-between mb-2">
          <span>Check-in Time:</span>
          <span>{checkInTime}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Duration:</span>
          <span>{selectedDuration} hours</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Guests:</span>
          <span>
            {adults} Adults, {children} Children
          </span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Rooms:</span>
          <span>{rooms}</span>
        </div>
        <div className="d-flex justify-content-between mb-2">
          <span>Meal:</span>
          <span>{getMealInfo()}</span>
        </div>
        <hr />
        <div className="d-flex justify-content-between align-items-center">
          <span className="h5">Total Price:</span>
          <span className="h5" style={{ color: "#003B94" }}>
            ₹{calculateTotalPrice()}
          </span>
        </div>
      </div>
    </div>
  )
}

const ReservationForm = ({
  checkInTime,
  setCheckInTime,
  adults,
  children,
  rooms,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  email,
  setEmail,
  phone,
  setPhone,
  handleSubmit,
  timePickerRef,
}) => {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <h2 className="h4 mb-4" style={{ color: "#003B94" }}>
          Reservation Details
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="checkInTime" className="form-label fw-bold">
              Check-in Time
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FaClock />
              </span>
              <input
                type="text"
                className="form-control"
                id="checkInTime"
                ref={timePickerRef}
                placeholder="Select check-in time"
                value={checkInTime}
                required
              />
            </div>
          </div>
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <FaUserFriends className="fs-1 mb-2" style={{ color: "#003B94" }} />
                  <h5 className="card-title">Adults</h5>
                  <p className="card-text fs-4">{adults}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <FaChild className="fs-1 mb-2" style={{ color: "#003B94" }} />
                  <h5 className="card-title">Children</h5>
                  <p className="card-text fs-4">{children}</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-body text-center">
                  <FaBed className="fs-1 mb-2" style={{ color: "#003B94" }} />
                  <h5 className="card-title">Rooms</h5>
                  <p className="card-text fs-4">{rooms}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label fw-bold">
              First Name
            </label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label fw-bold">
              Last Name
            </label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-bold">
              Email
            </label>
            <div className="input-group">
              <span className="input-group-text">@</span>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="phone" className="form-label fw-bold">
              Phone
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <FaPhone />
              </span>
              <input
                type="tel"
                className="form-control"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-lg" style={{ backgroundColor: "#003B94", color: "white" }}>
              <FaCheck className="me-2" />
              Confirm Reservation
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const HourlyStayReservation = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [checkInTime, setCheckInTime] = useState(location.state?.checkInTime || "14:00")
  const [adults, setAdults] = useState(location.state?.adults || 1)
  const [children, setChildren] = useState(location.state?.children || 0)
  const [rooms, setRooms] = useState(location.state?.rooms || 1)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const timePickerRef = useRef(null)

  const { selectedDuration, hourlyPrice } = location.state || { selectedDuration: "4", hourlyPrice: 1200 }

  const hotel = {
    id: id,
    name: "FabHotel Memories Inn",
    location: "9, Kudlu Road, Union Bank of India ATM, Kudlu, 560068 Chennai, India",
    rating: 4.5,
    reviews: 128,
    basePrice: hourlyPrice,
    image: "/placeholder.svg?height=400&width=600",
    facilities: ["Wi-Fi", "AC", "TV", "Room Service", "Parking", "Restaurant"],
    description:
      "Located within 4.5 miles of The Forum, Koramangala and 7.2 miles of Brigade Road, FabHotel Memories Inn provides rooms in Chennai. This 3-star hotel offers room service, a 24-hour front desk and free WiFi. The hotel features family rooms.",
    roomType: "1 Room",
    maxOccupancy: "Flexible",
    childPolicy: "Stay of 1 child up to 5 years of age is complementary without the use of extra mattress.",
    extraBedPolicy: "Extra mattress is provided for additional guests.",
    idPolicy:
      "It is mandatory for guests to present valid photo identification at the time of check-in. According to government regulations, a valid Photo ID has to be carried by every person above the age of 18 staying at the hotel. The identification proofs accepted are Aadhaar Card, Driving License, Voter ID Card, and Passport (Pan is not accepted as valid ID). Without Original copy of valid ID the guest will not be allowed to check-in.",
  }

  useEffect(() => {
    const fp = flatpickr(timePickerRef.current, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
      minTime: "09:00",
      maxTime: "21:00",
      defaultDate: checkInTime,
      onChange: (selectedDates, dateStr) => {
        setCheckInTime(dateStr)
      },
    })

    return () => {
      fp.destroy()
    }
  }, [checkInTime])

  const calculateTotalPrice = () => {
    const basePrice = hotel.basePrice
    const totalPrice = basePrice * rooms

    const checkInHour = Number.parseInt(checkInTime.split(":")[0])
    let mealCharge = 0
    if (checkInHour >= 7 && checkInHour < 10) {
      mealCharge = 200
    } else if (checkInHour >= 12 && checkInHour < 15) {
      mealCharge = 300
    } else if (checkInHour >= 19 && checkInHour < 22) {
      mealCharge = 300
    }

    const totalMealCharge = mealCharge * (adults + children)

    return totalPrice + totalMealCharge
  }

  const getMealInfo = () => {
    if (!checkInTime) return "Select check-in time to see meal options"
    const checkInHour = Number.parseInt(checkInTime.split(":")[0])
    if (checkInHour >= 7 && checkInHour < 10) {
      return "Breakfast included"
    } else if (checkInHour >= 12 && checkInHour < 15) {
      return "Lunch included"
    } else if (checkInHour >= 19 && checkInHour < 22) {
      return "Dinner included"
    }
    return "No meal included"
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      const bookingDetails = {
        fullName: `${firstName} ${lastName}`,
        roomDetails: { name: hotel.roomType },
        guestsCount: adults,
        childrenCount: children,
        totalPrice: calculateTotalPrice(),
        checkInDate: new Date().toISOString(),
        checkOutDate: new Date(new Date().getTime() + selectedDuration * 60 * 60 * 1000).toISOString(),
        checkInTime,
        duration: selectedDuration,
        hotelName: hotel.name,
        mealInfo: getMealInfo(),
      }
      navigate("/hourly-successful", { state: bookingDetails })
    }, 2000)
  }

  if (isLoading) {
    return <Preloader />
  }

  return (
    <div className="bg-light min-vh-100">
      <div className="container mt-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/" style={{ color: "#003B94" }} className="text-decoration-none">
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/hourly-stay" style={{ color: "#003B94" }} className="text-decoration-none">
                Hourly Stays
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/hourly-stay" style={{ color: "#003B94" }} className="text-decoration-none">
                Chennai
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/hourly-stay/${id}`} style={{ color: "#003B94" }} className="text-decoration-none">
                {hotel.name}
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Reservation
            </li>
          </ol>
        </nav>
      </div>

      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <HotelDetails hotel={hotel} />
            <ReservationForm
              checkInTime={checkInTime}
              setCheckInTime={setCheckInTime}
              adults={adults}
              children={children}
              rooms={rooms}
              firstName={firstName}
              setFirstName={setFirstName}
              lastName={lastName}
              setLastName={setLastName}
              email={email}
              setEmail={setEmail}
              phone={phone}
              setPhone={setPhone}
              handleSubmit={handleSubmit}
              timePickerRef={timePickerRef}
            />
          </div>
          <div className="col-12 col-lg-4">
            <BookingSummary
              checkInTime={checkInTime}
              selectedDuration={selectedDuration}
              adults={adults}
              children={children}
              rooms={rooms}
              getMealInfo={getMealInfo}
              calculateTotalPrice={calculateTotalPrice}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HourlyStayReservation

