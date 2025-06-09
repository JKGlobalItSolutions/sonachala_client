import React, { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, useLocation, Link } from "react-router-dom"
import {
  FaHeart,
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
} from "react-icons/fa"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

const HourlyStayRoomDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [isFavorite, setIsFavorite] = useState(false)
  const [checkInTime, setCheckInTime] = useState(location.state?.checkInTime || "14:00")
  const [adults, setAdults] = useState(location.state?.adults || 1)
  const [children, setChildren] = useState(location.state?.children || 0)
  const [rooms, setRooms] = useState(location.state?.rooms || 1)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const timePickerRef = useRef(null)
  const guestsDropdownRef = useRef(null)

  const { selectedDuration, hourlyPrice } = location.state || { selectedDuration: "4", hourlyPrice: 1200 }

  const hotel = {
    id: id,
    name: "FabHotel Memories Inn",
    location: "9, Kudlu Road, Union Bank of India ATM, Kudlu, 560068 Chennai, India",
    rating: 4.5,
    reviews: 128,
    basePrice: hourlyPrice,
    image: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
    facilities: ["Wi-Fi", "AC", "TV", "Room Service", "Parking", "Restaurant"],
    description:
      "Located within 4.5 miles of The Forum, Koramangala and 7.2 miles of Brigade Road, FabHotel Memories Inn provides rooms in Chennai. This 3-star hotel offers room service, a 24-hour front desk and free WiFi. The hotel features family rooms.",
    highlights: [
      "Perfect for a short stay!",
      "Top Location: Highly rated by recent guests (4.5)",
      "4-hour stay option available",
      "Accommodates multiple adults and children",
    ],
    roomType: "1 Room",
    maxOccupancy: "Flexible",
    childPolicy: "Stay of 1 child up to 5 years of age is complementary without the use of extra mattress.",
    extraBedPolicy: "Extra mattress is provided for additional guests.",
    idPolicy:
      "It is mandatory for guests to present valid photo identification at the time of check-in. According to government regulations, a valid Photo ID has to be carried by every person above the age of 18 staying at the hotel. The identification proofs accepted are Aadhaar Card, Driving License, Voter ID Card, and Passport (Pan is not accepted as valid ID). Without Original copy of valid ID the guest will not be allowed to check-in.",
    additionalImages: [
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg",
      "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg",
      "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg",
    ],
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

    const handleClickOutside = (event) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target)) {
        setShowGuestsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      fp.destroy()
    }
  }, [checkInTime])

  const handleGuestsClick = () => {
    setShowGuestsDropdown(!showGuestsDropdown)
  }

  const incrementAdults = () => {
    setAdults((prev) => Math.max(prev + 1, rooms))
  }

  const decrementAdults = () => {
    if (adults > rooms) {
      setAdults((prev) => prev - 1)
    }
  }

  const addChild = () => {
    setChildren((prev) => prev + 1)
  }

  const removeChild = () => {
    if (children > 0) {
      setChildren((prev) => prev - 1)
    }
  }

  const incrementRooms = () => {
    setRooms((prev) => {
      const newRooms = prev + 1
      if (adults < newRooms) {
        setAdults(newRooms)
      }
      return newRooms
    })
  }

  const decrementRooms = () => {
    if (rooms > 1) {
      setRooms((prev) => prev - 1)
    }
  }

  const updateGuests = () => {
    return `${adults} Adults, ${children} Children, ${rooms} Rooms`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Booking submitted:", { checkInTime, adults, children, rooms, selectedDuration })
  }

  const handleBack = () => {
    navigate(-1)
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
  }

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
            <li className="breadcrumb-item active" aria-current="page">
              {hotel.name}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container mt-4">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <div className="mb-2">
                  <span className="badge" style={{ backgroundColor: "#003B94", color: "white" }}>
                    Hourly Stay
                  </span>
                </div>
                <h1 className="h3 mb-1">{hotel.name}</h1>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="text-warning">
                    {"★".repeat(Math.floor(hotel.rating))}
                    {"☆".repeat(5 - Math.floor(hotel.rating))}
                  </div>
                  <span className="badge bg-secondary">{hotel.rating.toFixed(1)}</span>
                </div>
                <p className="text-muted">
                  <FaMapMarkerAlt className="me-1" />
                  {hotel.location} –{" "}
                  <a href="#" style={{ color: "#003B94" }} className="">
                    Show map
                  </a>
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-primary" style={{ borderColor: "#003B94" }} onClick={toggleFavorite}>
                  <FaHeart className={isFavorite ? "text-primary" : ""} style={{ color: "#003B94" }} />
                </button>
                <button className="btn btn-outline-primary" style={{ borderColor: "#003B94" }}>
                  <FaShareAlt style={{ color: "#003B94" }} />
                </button>
              </div>
            </div>

            <div className="row g-2 mb-4">
              <div className="col-12 col-md-6">
                <img
                  src={hotel.image || "/placeholder.svg"}
                  alt="Main hotel room view"
                  className="img-fluid rounded w-100 h-100 object-fit-cover"
                  style={{ height: "300px" }}
                />
              </div>
              <div className="col-12 col-md-6">
                <div className="row g-2">
                  {hotel.additionalImages.map((image, index) => (
                    <div key={index} className="col-6">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Room view ${index + 1}`}
                        className="img-fluid rounded w-100 object-fit-cover"
                        style={{ height: "145px" }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h2 className="h4 mb-4">Hourly Stay in Chennai</h2>
                <p className="mb-4">{hotel.description}</p>
                <hr className="my-4" />
                <h3 className="h5 mb-3">Most Popular Facilities</h3>
                <div className="d-flex flex-wrap gap-3">
                  {hotel.facilities.map((facility, index) => (
                    <div key={index} className="d-flex align-items-center gap-2">
                      <FaWifi style={{ color: "#003B94" }} className="" />
                      <span>{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h5 mb-3">Child Policy</h3>
                <p>{hotel.childPolicy}</p>
                <p>{hotel.extraBedPolicy}</p>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h5 mb-3">Identification Policy</h3>
                <p>
                  <FaIdCard className="me-2" />
                  {hotel.idPolicy}
                </p>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <h3 className="h6 mb-1">Exceptional</h3>
                    <small className="text-muted">{hotel.reviews} reviews</small>
                  </div>
                  <span style={{ backgroundColor: "#003B94" }} className="badge fs-5">
                    {hotel.rating}
                  </span>
                </div>

                <h3 className="h5 mb-3">Property Highlights</h3>
                <ul className="list-unstyled mb-4">
                  {hotel.highlights.map((highlight, index) => (
                    <li key={index} className="d-flex mb-2">
                      <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>

                <hr className="my-4" />

                <div className="mb-3">
                  <h4 className="h6 mb-2">Room Type</h4>
                  <p>{hotel.roomType}</p>
                  <h4 className="h6 mb-2">Max Occupancy</h4>
                  <p>{hotel.maxOccupancy}</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="checkInTime" className="form-label">
                      Check-in Time
                    </label>
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
                  <div className="mb-3">
                    <label className="form-label">Guests & Rooms</label>
                    <div ref={guestsDropdownRef}>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Guests & Rooms"
                        value={updateGuests()}
                        onClick={handleGuestsClick}
                        readOnly
                      />
                      {showGuestsDropdown && (
                        <div className="dropdown-menu show p-3" style={{ position: "absolute", zIndex: 1000 }}>
                          <div className="mb-3">
                            <label>Adults</label>
                            <div className="input-group">
                              <button type="button" className="btn btn-outline-secondary" onClick={decrementAdults}>
                                -
                              </button>
                              <input type="text" className="form-control text-center" value={adults} readOnly />
                              <button type="button" className="btn btn-outline-secondary" onClick={incrementAdults}>
                                +
                              </button>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label>Children</label>
                            <div className="input-group">
                              <button type="button" className="btn btn-outline-secondary" onClick={removeChild}>
                                -
                              </button>
                              <input type="text" className="form-control text-center" value={children} readOnly />
                              <button type="button" className="btn btn-outline-secondary" onClick={addChild}>
                                +
                              </button>
                            </div>
                          </div>
                          <div>
                            <label>Rooms</label>
                            <div className="input-group">
                              <button type="button" className="btn btn-outline-secondary" onClick={decrementRooms}>
                                -
                              </button>
                              <input type="text" className="form-control text-center" value={rooms} readOnly />
                              <button type="button" className="btn btn-outline-secondary" onClick={incrementRooms}>
                                +
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <p className="mb-1">Meal Info:</p>
                    <p className="text-muted">{getMealInfo()}</p>
                  </div>
                  <div className="text-end mb-4">
                    <div style={{ color: "#003B94" }} className="h3 mb-0">
                      ₹{calculateTotalPrice()}
                    </div>
                    <strong className="text-primary" style={{ color: "#003B94" }}>
                      for {selectedDuration}-hour stay
                    </strong>
                    <div className="mt-2">
                      <small className="text-muted">
                        {adults} Adults, {children} Children, {rooms} Rooms
                      </small>
                    </div>
                    <div className="mt-1">
                      <small className="text-muted">{getMealInfo()}</small>
                    </div>
                  </div>
                  <div className="d-grid">
                    <Link to="/hourly-reservation">
                      {" "}
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ backgroundColor: "#003B94", borderColor: "#003B94" }}
                      >
                        Reserve Now
                      </button>
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HourlyStayRoomDetails

