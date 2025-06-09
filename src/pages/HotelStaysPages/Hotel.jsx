"use client"

import React, { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import "bootstrap/dist/css/bootstrap.min.css"
import "@fortawesome/fontawesome-free/css/all.min.css"

function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [bookingLocation, setBookingLocation] = useState("Tiruvannamalai")
  const [dates, setDates] = useState("")
  const [guests, setGuests] = useState("")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const datePickerRef = useRef(null)
  const guestsDropdownRef = useRef(null)
  const flatpickrInstance = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const urlLocation = params.get("location")
    const urlCheckIn = params.get("checkIn")
    const urlCheckOut = params.get("checkOut")
    const urlAdults = params.get("adults")
    const urlChildren = params.get("children")
    const urlRooms = params.get("rooms")

    setBookingLocation(urlLocation || localStorage.getItem("location") || "Tiruvannamalai")
    setAdults(Number.parseInt(urlAdults) || Number.parseInt(localStorage.getItem("adults")) || 1)
    setChildren(Number.parseInt(urlChildren) || Number.parseInt(localStorage.getItem("children")) || 0)
    setRooms(Number.parseInt(urlRooms) || Number.parseInt(localStorage.getItem("rooms")) || 1)

    flatpickrInstance.current = flatpickr(datePickerRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      maxDate: new Date().fp_incr(420),
      defaultDate: [
        urlCheckIn || localStorage.getItem("checkIn") || new Date(),
        urlCheckOut || localStorage.getItem("checkOut") || new Date(new Date().setDate(new Date().getDate() + 1)),
      ],
      onChange: (selectedDates, dateStr) => {
        if (selectedDates.length === 2) {
          const [checkin, checkout] = selectedDates.map((date) => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const day = String(date.getDate()).padStart(2, "0")
            return `${year}-${month}-${day}`
          })

          setDates(`${checkin} - ${checkout}`)
          localStorage.setItem("checkIn", checkin)
          localStorage.setItem("checkOut", checkout)
        }
      },
      onClose: (selectedDates, dateStr) => {
        if (selectedDates.length === 2) {
          const [checkin, checkout] = selectedDates.map((date) => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2, "0")
            const day = String(date.getDate()).padStart(2, "0")
            return `${year}-${month}-${day}`
          })
          setDates(`${checkin} - ${checkout}`)
        }
      },
    })

    const storedCheckin = urlCheckIn || localStorage.getItem("checkIn")
    const storedCheckout = urlCheckOut || localStorage.getItem("checkOut")
    if (storedCheckin && storedCheckout) {
      setDates(`${storedCheckin} - ${storedCheckout}`)
    } else {
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const formatDate = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      }
      const formattedToday = formatDate(today)
      const formattedTomorrow = formatDate(tomorrow)
      setDates(`${formattedToday} - ${formattedTomorrow}`)
    }

    updateGuests(
      Number.parseInt(urlAdults) || Number.parseInt(localStorage.getItem("adults")) || 1,
      Number.parseInt(urlChildren) || Number.parseInt(localStorage.getItem("children")) || 0,
      Number.parseInt(urlRooms) || Number.parseInt(localStorage.getItem("rooms")) || 1,
    )

    localStorage.setItem("location", urlLocation || localStorage.getItem("location") || "Tiruvannamalai")
    localStorage.setItem("adults", urlAdults || localStorage.getItem("adults") || "1")
    localStorage.setItem("children", urlChildren || localStorage.getItem("children") || "0")
    localStorage.setItem("rooms", urlRooms || localStorage.getItem("rooms") || "1")

    const handleClickOutside = (event) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target)) {
        setShowGuestsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      if (flatpickrInstance.current) {
        flatpickrInstance.current.destroy()
      }
    }
  }, [location.search])

  const updateGuests = (a, c, r) => {
    setGuests(`Guests: ${a + c}, Rooms: ${r}`)
  }

  const handleGuestsClick = () => {
    setShowGuestsDropdown(!showGuestsDropdown)
  }

  const incrementValue = (setter, value, maxValue) => {
    if (value < maxValue) {
      setter(value + 1)
    }
  }

  const decrementValue = (setter, value, minValue) => {
    if (value > minValue) {
      setter(value - 1)
    }
  }

  const handleDone = () => {
    setShowGuestsDropdown(false)
    updateGuests(adults, children, rooms)
    localStorage.setItem("adults", adults.toString())
    localStorage.setItem("children", children.toString())
    localStorage.setItem("rooms", rooms.toString())
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("location", bookingLocation)

    const selectedDates = flatpickrInstance.current.selectedDates
    let checkIn, checkOut

    if (selectedDates && selectedDates.length === 2) {
      ;[checkIn, checkOut] = selectedDates.map((date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `${year}-${month}-${day}`
      })
    } else {
      ;[checkIn, checkOut] = dates.split(" - ")
    }

    localStorage.setItem("checkIn", checkIn)
    localStorage.setItem("checkOut", checkOut)

    const params = new URLSearchParams()
    params.append("location", bookingLocation)
    params.append("checkIn", checkIn)
    params.append("checkOut", checkOut)
    params.append("adults", adults.toString())
    params.append("children", children.toString())
    params.append("rooms", rooms.toString())

    navigate(`/HotelList?${params.toString()}`)
  }

  const getTotalNights = () => {
    const [checkIn, checkOut] = dates.split(" - ")
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.round((end - start) / (1000 * 60 * 60 * 24))
  }

  return (
    <div style={{ fontFamily: "Urbanist, sans-serif" }}>
      <main>
        {/* Hero Section */}
        <div
          className="p-5 mb-4 bg-body-tertiary"
          style={{
            backgroundImage: "url(/assets/img/Rectangle\\ 377.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundColor: "#038A5E",
          }}
        >
          <div className="container py-5">
            <h1 className="display-5 fw-bold text-light">Pack the whole toybox</h1>
            <p className="col-md-8 fs-4 text-light">Unwind and stretch out in a vacation home</p>
            <button style={{ backgroundColor: "#038A5E" }} type="button" className="btn text-light">
              Discover Vacation Rentals
            </button>
          </div>
        </div>

        {/* Search Form Section */}
        <div
          className="container custom-container rounded"
          id="move2"
          style={{ marginTop: "-85px", backgroundColor: "#038A5E" }}
        >
          <div className="container py-3">
            <form id="bookingForm" onSubmit={handleSubmit}>
              <div className="row g-2 align-items-center">
                <div className="col-lg">
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    placeholder="Enter destination"
                    required
                    value={bookingLocation}
                    onChange={(e) => setBookingLocation(e.target.value)}
                    style={{ height: "50px" }}
                  />
                </div>
                <div className="col-lg">
                  <input
                    type="text"
                    className="form-control"
                    id="dates"
                    name="dates"
                    placeholder="Check-in - Check-out"
                    required
                    value={dates}
                    ref={datePickerRef}
                    style={{ height: "50px" }}
                  />
                </div>
                <div className="col-lg">
                  <div ref={guestsDropdownRef}>
                    <input
                      type="text"
                      className="form-control"
                      id="guests"
                      name="guests"
                      placeholder="Guests & Rooms"
                      required
                      value={guests}
                      onClick={handleGuestsClick}
                      readOnly
                      style={{ height: "50px" }}
                    />
                    {showGuestsDropdown && (
                      <div className="dropdown-menu show p-3" id="guestsDropdown">
                        <div className="form-group">
                          <label htmlFor="adults">Adults</label>
                          <div className="input-group">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => decrementValue(setAdults, adults, Math.max(1, rooms))}
                              style={{
                                backgroundColor: adults > Math.max(1, rooms) ? "#038A5E" : "gray",
                                color: "white",
                              }}
                              disabled={adults <= Math.max(1, rooms)}
                            >
                              -
                            </button>
                            <input type="number" className="form-control" id="adults" value={adults} readOnly />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => incrementValue(setAdults, adults, 30)}
                              style={{ backgroundColor: adults < 30 ? "#038A5E" : "gray", color: "white" }}
                              disabled={adults >= 30}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="children">Children</label>
                          <div className="input-group">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => decrementValue(setChildren, children, 0)}
                              style={{ backgroundColor: children > 0 ? "#038A5E" : "gray", color: "white" }}
                              disabled={children <= 0}
                            >
                              -
                            </button>
                            <input type="number" className="form-control" id="children" value={children} readOnly />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => incrementValue(setChildren, children, 10)}
                              style={{ backgroundColor: children < 10 ? "#038A5E" : "gray", color: "white" }}
                              disabled={children >= 10}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <div className="form-group">
                          <label htmlFor="rooms">Rooms</label>
                          <div className="input-group">
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => {
                                if (rooms > 1) {
                                  setRooms(rooms - 1)
                                  if (adults === rooms) {
                                    setAdults(adults - 1)
                                  }
                                }
                              }}
                              style={{ backgroundColor: rooms > 1 ? "#038A5E" : "gray", color: "white" }}
                              disabled={rooms <= 1}
                            >
                              -
                            </button>
                            <input type="number" className="form-control" id="rooms" value={rooms} readOnly />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => {
                                if (rooms < 30) {
                                  setRooms(rooms + 1)
                                  if (adults < rooms + 1) {
                                    setAdults(rooms + 1)
                                  }
                                }
                              }}
                              style={{ backgroundColor: rooms < 30 ? "#038A5E" : "gray", color: "white" }}
                              disabled={rooms >= 30}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          style={{ backgroundColor: "#038A5E" }}
                          className="btn text-light mt-3"
                          onClick={handleDone}
                        >
                          Done
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-lg-auto">
                  <button
                    type="submit"
                    className="btn text-light w-100"
                    id="search"
                    style={{ backgroundColor: "#000000", height: "50px" }}
                    disabled={getTotalNights() > 30}
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Recent Searches Section */}
        <div className="container mt-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-dark">Your recent searches</h3>
            <a href="/hotels" className="text-decoration-none" style={{ color: "#038A5E" }}>
              View All
            </a>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-4">
                    <img
                      src="/assets/index/1.png"
                      className="img-fluid rounded-start h-100 object-fit-cover"
                      alt="Sparsa Resort"
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1">Sparsa Resort</h5>
                        <span className="badge" style={{ backgroundColor: "#038A5E" }}>
                          4.7
                        </span>
                      </div>
                      <p className="card-text text-muted mb-1">21 Feb - 23 Feb, 2 people</p>
                      <p className="card-text">
                        <strong>₹4,672</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-4">
                    <img
                      src="/assets/index/2.png"
                      className="img-fluid rounded-start h-100 object-fit-cover"
                      alt="Arudra Residency"
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1">Arudra Residency</h5>
                        <span className="badge" style={{ backgroundColor: "#038A5E" }}>
                          4.5
                        </span>
                      </div>
                      <p className="card-text text-muted mb-1">16 Feb - 17 Feb, 2 people</p>
                      <p className="card-text">
                        <strong>₹6,579</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-4">
                    <img
                      src="/assets/index/3.png"
                      className="img-fluid rounded-start h-100 object-fit-cover"
                      alt="Athena Hotel"
                    />
                  </div>
                  <div className="col-8">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1">Athena Hotel</h5>
                        <span className="badge" style={{ backgroundColor: "#038A5E" }}>
                          4.4
                        </span>
                      </div>
                      <p className="card-text text-muted mb-1">21 Jan - 23 Jan, 4 people</p>
                      <p className="card-text">
                        <strong>₹7,254</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Offers Section */}
        <div className="container mt-5">
          <h3 className="text-dark">Offers</h3>
          <p className="text-muted">Grab the best deals before they're gone!</p>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm">
                <div className="row g-0">
                  <div className="col-md-3">
                    <img
                      src="/assets/index/offer1.png"
                      className="img-fluid rounded-start h-100 object-fit-cover"
                      alt="3 Days & 2 Nights Stay"
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="card-title">3 Days & 2 Nights Accordable Stay Price</h5>
                      <p className="card-text mb-3">CS Arunachala</p>
                      <button className="btn text-light" style={{ backgroundColor: "#038A5E" }}>
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card shadow-sm ">
                <div className="row g-0">
                  <div className="col-md-3">
                    <img
                      src="/assets/index/offer2.png"
                      className="img-fluid rounded-start h-100 object-fit-cover"
                      alt="Premium Stay Offer"
                    />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="card-title">20% OFF On Premium Stays</h5>
                      <p className="card-text mb-3">Flat ₹500 OFF on First Booking</p>
                      <button className="btn text-light" style={{ backgroundColor: "#038A5E" }}>
                        Claim Offer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      {/* Trending Destinations Section */}
      <div className="container mt-5">
        <h3 className="text-dark">Trending destinations</h3>
        <p className="text-dark">Travelers searching for India also booked these</p>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="position-relative rounded overflow-hidden" style={{ height: "300px" }}>
              <img
                src="/assets/index/trending designations 1.png"
                alt="Kodaikanal"
                className="w-100 h-100 object-fit-cover"
              />
              <div className="position-absolute bottom-0 w-100 p-3" style={{ background: "#038A5E" }}>
                <h5 className="text-white m-0">Near Arunachaleswarar Temple Stays</h5>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="position-relative rounded overflow-hidden" style={{ height: "300px" }}>
              <img
                src="/assets/index/trending designations 2.png"
                alt="Coimbatore"
                className="w-100 h-100 object-fit-cover"
              />
              <div className="position-absolute bottom-0 w-100 p-3" style={{ background: "#038A5E" }}>
                <h5 className="text-white m-0">Budget Stays in Tiruvannamalai</h5>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="position-relative rounded overflow-hidden" style={{ height: "300px" }}>
              <img
                src="/assets/index/trending designations 3.png"
                alt="Bangalore"
                className="w-100 h-100 object-fit-cover"
              />
              <div className="position-absolute bottom-0 w-100 p-3" style={{ background: "#038A5E" }}>
                <h5 className="text-white m-0">Luxury Heritage Hotels</h5>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="position-relative rounded overflow-hidden" style={{ height: "300px" }}>
              <img
                src="/assets/index/trending designations 4.jpg"
                alt="Kerala"
                className="w-100 h-100 object-fit-cover"
              />
              <div className="position-absolute bottom-0 w-100 p-3" style={{ background: "#038A5E" }}>
                <h5 className="text-white m-0">Hill View Stays</h5>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Tiruvannamalai Section */}
      <div className=" my-5">
        <div className="container">
          <h3 className="text-dark pt-3">Explore Tiruvannamalai </h3>
          <div className="container card-container-wrapper">
            <div className="container my-3">
              <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                <div className="col p-3">
                  <div className="card" style={{ border: "none" }}>
                    <img src="/assets/index/expore 1.png" className="card-img-top" alt="Apartments" />
                    <h5 className="card-title text-center p-1">Sri Ramana Ashram</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{ border: "none" }}>
                    <img src="/assets/index/expore 2.png" className="card-img-top" alt="Hotels" />
                    <h5 className="card-title text-center p-1">Sri Seshadri Swamigal Ashram</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{ border: "none" }}>
                    <img src="/assets/index/expore 3.png" className="card-img-top" alt="Villas" />
                    <h5 className="card-title text-center p-1">Yogi Ram Surath Kumar Ashram</h5>
                  </div>
                </div>
                <div className="col p-3">
                  <div className="card" style={{ border: "none" }}>
                    <img src="/assets/index/expore 4.png" className="card-img-top" alt="Resorts" />
                    <h5 className="card-title text-center p-1">Skandashramam</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
       <>
  <style>{`
    @keyframes marqueeScroll {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
  `}</style>

  <div className="container">
    <h3 className="text-dark pt-3">Best Weekend Stays</h3>
    <div style={{ overflow: "hidden", position: "relative", width: "100%", marginTop: "2rem", marginBottom: "2rem" }}>
      <div
        style={{
          display: "flex",
          gap: "20px",
          width: "max-content",
          animation: "marqueeScroll 30s linear infinite"
        }}
      >
        {[
          { name: "MPS Saai Residency", address: "61-B ROA Nagar, Chengam Road, Ramana nagar", img: "./assets/index/bestWeekend 1.png", rating: "4.6", oldPrice: "5,999", newPrice: "4,271", taxes: "513" },
          { name: "Hotel Sunshine", address: "MG Road, Chennai", img: "./assets/index/bestWeekend 2.png", rating: "4.3", oldPrice: "4,999", newPrice: "3,999", taxes: "450" },
          { name: "Hotel Sunshine", address: "MG Road, Chennai", img: "./assets/index/bestWeekend 2.png", rating: "4.3", oldPrice: "4,999", newPrice: "3,999", taxes: "450" },
          { name: "Green Valley Inn", address: "Kodaikanal Main Road", img: "./assets/index/bestWeekend 3.png", rating: "4.7", oldPrice: "6,499", newPrice: "4,999", taxes: "550" },
          { name: "MPS Saai Residency", address: "61-B ROA Nagar, Chengam Road, Ramana nagar", img: "./assets/index/bestWeekend 1.png", rating: "4.6", oldPrice: "5,999", newPrice: "4,271", taxes: "513" },
          { name: "Hotel Sunshine", address: "MG Road, Chennai", img: "./assets/index/bestWeekend 2.png", rating: "4.3", oldPrice: "4,999", newPrice: "3,999", taxes: "450" }
        ].map((hotel, index) => (
          <div
            key={index}
            className="card flex-shrink-0"
            style={{
              width: "300px",
              borderRadius: "20px",
              overflow: "hidden",
              border: "2px solid #ddd",
              flexShrink: 0
            }}
          >
            <div className="position-relative">
              <img
                src={hotel.img}
                alt={hotel.name}
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <span
                className="position-absolute top-0 end-0 text-white px-2 py-1 rounded-bottom-left"
                style={{
                  fontSize: "14px",
                  background: "#038A5E"
                }}
              >
                {hotel.rating}
              </span>
            </div>
            <div className="card-body text-center">
              <h5 className="fw-bold">{hotel.name}</h5>
              <p className="text-muted" style={{ fontSize: "14px" }}>{hotel.address}</p>
              <div className="d-flex justify-content-center align-items-center">
                <del className="text-danger me-2">₹{hotel.oldPrice}</del>
                <span className="fw-bold" style={{ fontSize: "18px", color: "#038A5E" }}>
                  ₹{hotel.newPrice}
                </span>
              </div>
              <p className="text-muted" style={{ fontSize: "12px" }}>
                +₹{hotel.taxes} taxes and charges
              </p>
              <button className="btn btn-sm w-100" style={{ background: "#038A5E", color: "white" }}>
                See availability
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</>

        
        {/* comming soon section */}
        <div className="container-fluid text-white py-5" style={{ backgroundColor: "#038A5E" }}>
          <div className="row align-items-center">
            {/* Left Section: Text */}
            <div className="col-md-6 text-center text-md-start px-5">
              <h2 className="fw-bold">Book Your Stay Anywhere</h2>
              <h3 className="fw-bold">in Tamil Nadu with</h3>
              <h1 className="fw-bold mt-2">
                <i className="bi bi-geo-alt-fill"></i> ohm
              </h1>
              <button className="btn btn-lg fw-bold mt-3 rounded-pill" style={{ backgroundColor: "#FFDE00" }}>Coming Soon</button>
            </div>

            {/* Right Section: Map Image */}
            <div className="col-md-6 text-center">
              <img
                src="/assets/index/tamilnadu.png"
                alt="Tamil Nadu Map"
                className="img-fluid p-3"
                style={{ maxWidth: "400px", width: "100%" }}
              />
            </div>
          </div>
        </div>

        {/* Why Book Hotels Section */}
        <h1 className="text-center pt-3">Why Book Hotels with Ohm Stays?</h1>
        <div className="container my-5">
          <div className="row justify-content-center align-items-stretch">
            <div className="col-12 col-lg-3 col-md-6 pb-4">
              <div style={{ border: "2px solid #038A5E" }} className="card text-center align-items-stretch">
                <img
                  src="/assets/img/index page icons footer/1.png"
                  alt="Profile Image"
                  className="card-img-circle"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: "-40px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block",
                    border: "3px solid white",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <b>Convenience and Accessibility</b>
                  </h5>
                  <p className="card-text">
                    24/7 Availability Booking apps allow users to make reservations or appointments at any time,
                    without being restricted to business hours.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3 col-md-6 pb-4">
              <div style={{ border: "2px solid #038A5E" }} className="card text-center align-items-stretch">
                <img
                  src="/assets/img/index page icons footer/2.png"
                  alt="Profile Image"
                  className="card-img-circle"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: "-40px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block",
                    border: "3px solid white",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <b>Time-Saving</b>
                  </h5>
                  <p className="card-text">
                    Instant Confirmation Many booking websites provide instant confirmation of bookings, reducing
                    uncertainty and the need for follow-up communication.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3 col-md-6 pb-4">
              <div style={{ border: "2px solid #038A5E" }} className="card text-center align-items-stretch">
                <img
                  src="/assets/img/index page icons footer/3.png"
                  alt="Profile Image"
                  className="card-img-circle"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: "-40px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block",
                    border: "3px solid white",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <b>Reviews and Ratings</b>
                  </h5>
                  <p className="card-text">
                    User Reviews Access to reviews and ratings from other customers provides insights into the quality
                    and service of accommodations and travel services.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-3 col-md-6 pb-4">
              <div style={{ border: "2px solid #038A5E" }} className="card text-center align-items-stretch">
                <img
                  src="/assets/img/index page icons footer/4.png"
                  alt="Profile Image"
                  className="card-img-circle"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginTop: "-40px",
                    marginLeft: "auto",
                    marginRight: "auto",
                    display: "block",
                    border: "3px solid white",
                  }}
                />
                <div className="card-body">
                  <h5 className="card-title">
                    <b>User-Friendly Interfaces</b>
                  </h5>
                  <p className="card-text">
                    Intuitive platforms that simplify the booking process, often with step-by-step guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      </main>

      {/* Back to Top Button */}
      <button
        id="backToTop"
        className="btn"
        style={{
          backgroundColor: "#038A5E",
          position: "fixed",
          bottom: "90px",
          right: "40px",
          display: "none",
          zIndex: 100,
        }}
      >
        <i className="fa-solid fa-arrow-up text-light"></i>
      </button>
    </div>
  )
}

export default HomePage

