import React, { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import { collection, getDocs, query } from "firebase/firestore"
import { db } from "../../firebase/config"
import {
  FaLocationDot,
  FaCheck,
  FaArrowUp,
  FaList,
  FaGrip,
  FaFilter,
  FaWifi,
  FaCar,
  FaWater,
  FaDumbbell,
  FaUtensils,
  FaSpa,
  FaMartiniGlass,
  FaBell,
  FaUsers,
  FaShirt,
  FaSnowflake,
  FaVideo,
  FaWheelchair,
  FaBuilding,
  FaBanSmoking,
  FaSort,
  FaMap,
} from "react-icons/fa6"
import { Slider } from "../../components/Slider"
import { Modal } from "../../components/Modal"
import MapCard from "../../components/MapCard"
import MapModal from "../../components/MapModal"

const HotelListing = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [filters, setFilters] = useState({
    priceRange: [300, 6000],
    facilities: [],
  })
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [searchLocation, setSearchLocation] = useState("")
  const [dates, setDates] = useState("")
  const [guests, setGuests] = useState("")
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const datePickerRef = useRef(null)
  const guestsDropdownRef = useRef(null)
  const [hotels, setHotels] = useState([])
  const [filteredHotels, setFilteredHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSort, setSelectedSort] = useState("Price - Low to High")
  const [calculatedPrices, setCalculatedPrices] = useState({})
  const [allDeals, setAllDeals] = useState(false)
  const [viewType, setViewType] = useState("list")
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [showMapModal, setShowMapModal] = useState(false)
  const [tempFilters, setTempFilters] = useState(filters)
  const [showSortModal, setShowSortModal] = useState(false)

  const facilityOptions = [
    { name: "Wi-Fi", icon: FaWifi },
    { name: "Parking", icon: FaCar },
    { name: "Pool", icon: FaWater },
    { name: "Gym", icon: FaDumbbell },
    { name: "Restaurant", icon: FaUtensils },
    { name: "Spa", icon: FaSpa },
    { name: "Bar", icon: FaMartiniGlass },
    { name: "Room Service", icon: FaBell },
    { name: "Family Room", icon: FaUsers },
    { name: "Laundry", icon: FaShirt },
    { name: "Air Conditioning", icon: FaSnowflake },
    { name: "CCTV", icon: FaVideo },
    { name: "Facility for Disabled guests", icon: FaWheelchair },
    { name: "Lift/Elevator", icon: FaBuilding },
    { name: "Non-Smoking Area", icon: FaBanSmoking },
    { name: "Smoke Free Area", icon: FaBanSmoking },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300)
    }

    window.addEventListener("scroll", handleScroll)

    const searchParams = new URLSearchParams(location.search)
    const locationParam = searchParams.get("location") || localStorage.getItem("location") || "Chennai"
    const checkInParam = searchParams.get("checkIn") || localStorage.getItem("checkIn")
    const checkOutParam = searchParams.get("checkOut") || localStorage.getItem("checkOut")
    const adultsParam = Number.parseInt(searchParams.get("adults") || localStorage.getItem("adults") || "1")
    const childrenParam = Number.parseInt(searchParams.get("children") || localStorage.getItem("children") || "0")
    const roomsParam = Number.parseInt(searchParams.get("rooms") || localStorage.getItem("rooms") || "1")

    setSearchLocation(locationParam)
    setDates(`${checkInParam} - ${checkOutParam}`)
    setAdults(adultsParam)
    setChildren(childrenParam)
    setRooms(roomsParam)
    updateGuests(adultsParam, childrenParam, roomsParam)

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      dateFormat: "Y-m-d",
      minDate: "today",
      maxDate: new Date().fp_incr(420),
      defaultDate: [checkInParam, checkOutParam],
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

    const handleClickOutside = (event) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target)) {
        setShowGuestsDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    fetchHotelsAndPreloadPrices()

    // Store initial values in local storage
    localStorage.setItem("location", locationParam)
    localStorage.setItem("adults", adultsParam.toString())
    localStorage.setItem("children", childrenParam.toString())
    localStorage.setItem("rooms", roomsParam.toString())

    return () => {
      window.removeEventListener("scroll", handleScroll)
      document.removeEventListener("mousedown", handleClickOutside)
      if (fp) {
        fp.destroy()
      }
    }
  }, [location.search])

  const fetchHotelsAndPreloadPrices = async () => {
    setLoading(true)
    try {
      const hotelsQuery = query(collection(db, "Hotels"))

      const hotelsSnapshot = await getDocs(hotelsQuery)

      const hotelsData = await Promise.all(
        hotelsSnapshot.docs.map(async (doc) => {
          const hotelData = { id: doc.id, ...doc.data(), type: "Hotel" }
          const roomDetails = await fetchRoomDetails("Hotels", doc.id)
          const price = calculateTotalPrice(roomDetails, getTotalNights(), adults)
          return { ...hotelData, price }
        }),
      )

      const allProperties = hotelsData
      setHotels(allProperties)
      setFilteredHotels(allProperties)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching hotels:", error)
      setLoading(false)
    }
  }

  const fetchRoomDetails = async (collectionName, hotelId) => {
    try {
      const roomSnapshot = await getDocs(collection(db, collectionName, hotelId, "Rooms"))
      if (roomSnapshot.docs.length > 0) {
        const roomData = roomSnapshot.docs[0].data()
        return {
          perNightPrice: Number.parseFloat(roomData.roomPrice) || 0,
          perAdultPrice: Number.parseFloat(roomData.perAdultPrice) || 0,
          discountValue: Number.parseFloat(roomData.discountValue) || 0,
        }
      }
      return { perNightPrice: 0, perAdultPrice: 0, discountValue: 0 }
    } catch (error) {
      console.error("Error fetching room details:", error)
      return { perNightPrice: 0, perAdultPrice: 0, discountValue: 0 }
    }
  }

  const calculateTotalPrice = (roomDetails, totalNights, totalAdults) => {
    const { perNightPrice, perAdultPrice, discountValue } = roomDetails
    const nightPrice = totalNights * perNightPrice
    const guestPrice = totalAdults * perAdultPrice
    const totalPrice = nightPrice + guestPrice
    const discount = totalPrice * (discountValue / 100)
    return totalPrice - discount
  }

  const getTotalNights = () => {
    if (!dates) return 1
    const [start, end] = dates.split(" - ").map((date) => new Date(date))
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const applyFilters = (filtersToApply) => {
    const filtered = hotels.filter((hotel) => {
      const [minPrice, maxPrice] = filtersToApply.priceRange
      if (hotel.price < minPrice || (maxPrice !== 6000 && hotel.price > maxPrice)) {
        return false
      }

      if (filtersToApply.facilities.length > 0) {
        if (
          !filtersToApply.facilities.every(
            (facility) =>
              hotel["Accommodation Facilities"] && hotel["Accommodation Facilities"].some((f) => f.name === facility),
          )
        ) {
          return false
        }
      }

      if (allDeals && (!hotel.discountValue || hotel.discountValue === 0)) {
        return false
      }

      return true
    })

    setFilteredHotels(filtered)
  }

  const resetFilters = () => {
    const resetFilters = {
      priceRange: [300, 6000],
      facilities: [],
    }
    setFilters(resetFilters)
    setAllDeals(false)
    setFilteredHotels(hotels)
  }

  const updateGuests = (a, c, r) => {
    setGuests(`${a} Adults, ${c} Children, ${r} Rooms`)
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
    if (adults < rooms) {
      setAdults(rooms)
    }
    setShowGuestsDropdown(false)
    updateGuests(Math.max(adults, rooms), children, rooms)
    localStorage.setItem("adults", Math.max(adults, rooms).toString())
    localStorage.setItem("children", children.toString())
    localStorage.setItem("rooms", rooms.toString())
  }

  const handleSeeAvailability = (hotelId) => {
    const [checkIn, checkOut] = dates.split(" - ")

    const bookingData = {
      location: searchLocation,
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
    }

    // Store booking data in local storage
    Object.entries(bookingData).forEach(([key, value]) => {
      localStorage.setItem(key, value)
    })

    // Create URL parameters
    const params = new URLSearchParams(bookingData)

    // Navigate to hotel details page with booking data in URL
    navigate(`/hotel-details/${hotelId}?${params.toString()}`)
  }

  const handleSort = (sortOption) => {
    setSelectedSort(sortOption)
    const sortedHotels = [...filteredHotels]
    switch (sortOption) {
      case "Our top picks":
        // Default sorting logic
        break
      case "Price - Low to High":
        sortedHotels.sort((a, b) => a.price - b.price)
        break
      case "Price - High to Low":
        sortedHotels.sort((a, b) => b.price - a.price)
        break
      default:
        break
    }
    setFilteredHotels(sortedHotels)
  }

  const validateForm = () => {
    if (!searchLocation) {
      alert("Please enter a destination")
      return false
    }
    if (!dates) {
      alert("Please select check-in and check-out dates")
      return false
    }
    if (adults + children > rooms * 4) {
      alert("Maximum 4 guests per room allowed")
      return false
    }
    if (children > adults * 2) {
      alert("Number of children cannot be more than twice the number of adults")
      return false
    }
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    const [checkIn, checkOut] = dates.split(" - ")

    const params = new URLSearchParams()
    params.append("location", searchLocation)
    params.append("checkIn", checkIn)
    params.append("checkOut", checkOut)
    params.append("adults", adults.toString())
    params.append("children", children.toString())
    params.append("rooms", rooms.toString())

    // Store values in local storage
    localStorage.setItem("location", searchLocation)
    localStorage.setItem("checkIn", checkIn)
    localStorage.setItem("checkOut", checkOut)
    localStorage.setItem("adults", adults.toString())
    localStorage.setItem("children", children.toString())
    localStorage.setItem("rooms", rooms.toString())

    navigate(`/hotels?${params.toString()}`)
  }

  const handleFilterModalSubmit = () => {
    applyFilters(filters)
    setShowFilterModal(false)
  }

  return (
    <div className="container-fluid px-3 px-md-5 pb-5 pt-3 bg-light">
      <div className="bg-black p-4">
        <div className="container">
          <form id="bookingForm" onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter destination"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Check-in - Check-out"
                value={dates}
                ref={datePickerRef}
                readOnly
              />
            </div>
            <div className="col-md-4">
              <div ref={guestsDropdownRef} className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Adults, Children & Rooms"
                  value={guests}
                  onClick={handleGuestsClick}
                  readOnly
                />
                {showGuestsDropdown && (
                  <div className="dropdown-menu show p-3 position-absolute" style={{ width: "100%", zIndex: 1000 }}>
                    <div className="form-group mb-3">
                      <label htmlFor="adults">Adults</label>
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => decrementValue(setAdults, adults, 1)}
                          style={{ backgroundColor: adults > 1 ? "#038A5E" : "gray", color: "white" }}
                          disabled={adults <= 1}
                        >
                          -
                        </button>
                        <input type="number" className="form-control" id="adults" value={adults} readOnly />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => incrementValue(setAdults, adults, 30)}
                          style={{ backgroundColor: adults < 30 ? "#038A5E" : "gray", color: "white" }}
                          disabled={adults >= 30 || adults + children >= rooms * 4}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="form-group mb-3">
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
                          disabled={children >= 10 || adults + children >= rooms * 4 || children >= adults * 2}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="form-group mb-3">
                      <label htmlFor="rooms">Rooms</label>
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => {
                            if (rooms > 1) {
                              setRooms(rooms - 1)
                              if (adults > rooms - 1) {
                                setAdults(Math.max(adults - 1, rooms - 1))
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
                          disabled={rooms >= 30 || rooms * 4 <= adults + children}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button className="btn btn-primary w-100" onClick={handleDone}>
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="col-md-2">
              <button
                type="submit"
                className="btn btn-lg w-100 fw-bold"
                style={{ backgroundColor: "#038A5E", color: "white" }}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <nav aria-label="breadcrumb" className="bg-light py-2">
        <div className="container">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none" style={{ color: "#038A5E" }}>
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/tamil-nadu" className="text-decoration-none" style={{ color: "#038A5E" }}>
                Tamil Nadu
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {searchLocation}
            </li>
          </ol>
        </div>
      </nav>

      {/* Add the mobile navigation here */}
      <div className="d-md-none bg-white border-bottom py-2">
        <div className="container">
          <div className="row g-2">
            <div className="col-4">
              <button
                className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowSortModal(true)}
              >
                <FaSort /> Sort
              </button>
            </div>
            <div className="col-4">
              <button
                className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowFilterModal(true)}
              >
                <FaFilter /> Filter
              </button>
            </div>
            <div className="col-4">
              <button
                className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2"
                onClick={() => setShowMapModal(true)}
              >
                <FaMap /> Map
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            {searchLocation}: {filteredHotels.length} properties found
          </h4>
          <div className="d-flex gap-3">
            <div className="dropdown d-none d-md-block">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="me-2">Sort by:</span>
                {selectedSort}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <button className="dropdown-item" onClick={() => handleSort("Our top picks")}>
                    Our top picks
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleSort("Price - Low to High")}>
                    Price - Low to High
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => handleSort("Price - High to Low")}>
                    Price - High to Low
                  </button>
                </li>
              </ul>
            </div>
            <div className="btn-group d-none d-md-flex">
              <button
                className={`btn btn-outline-secondary ${viewType === "list" ? "active" : ""}`}
                onClick={() => setViewType("list")}
              >
                <FaList />
              </button>
              <button
                className={`btn btn-outline-secondary ${viewType === "grid" ? "active" : ""}`}
                onClick={() => setViewType("grid")}
              >
                <FaGrip />
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-3 d-none d-lg-block">
            <MapCard location={searchLocation} onOpenMap={() => setShowMapModal(true)} />
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={resetFilters}
              facilityOptions={facilityOptions}
              allDeals={allDeals}
              setAllDeals={setAllDeals}
            />
          </div>
          <div className="col-lg-9">
            <div className={`${viewType === "grid" ? "row row-cols-1 row-cols-md-2 g-4" : ""}`}>
              {loading ? (
                <p>Loading hotels...</p>
              ) : (
                filteredHotels.map((hotel) => (
                  <div key={hotel.id} className={viewType === "grid" ? "col" : ""}>
                    <HotelCard
                      hotel={hotel}
                      onSeeAvailability={() => handleSeeAvailability(hotel.id)}
                      viewType={viewType}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <button
        className={`btn rounded-circle position-fixed bottom-0 end-0 m-4 ${showBackToTop ? "d-block" : "d-none"}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{ width: "50px", height: "50px", backgroundColor: "#038A5E", color: "white" }}
      >
        <FaArrowUp />
      </button>

      <Modal
        isOpen={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        title="Filters"
        onSubmit={handleFilterModalSubmit}
      >
        <Filters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
          facilityOptions={facilityOptions}
          allDeals={allDeals}
          setAllDeals={setAllDeals}
        />
      </Modal>

      <Modal isOpen={showSortModal} onClose={() => setShowSortModal(false)} title="Sort By">
        <div className="list-group">
          <button
            className={`list-group-item list-group-item-action ${selectedSort === "Our top picks" ? "active" : ""}`}
            onClick={() => {
              handleSort("Our top picks")
              setShowSortModal(false)
            }}
          >
            Our top picks
          </button>
          <button
            className={`list-group-item list-group-item-action ${selectedSort === "Price - Low to High" ? "active" : ""}`}
            onClick={() => {
              handleSort("Price - Low to High")
              setShowSortModal(false)
            }}
          >
            Price - Low to High
          </button>
          <button
            className={`list-group-item list-group-item-action ${selectedSort === "Price - High to Low" ? "active" : ""}`}
            onClick={() => {
              handleSort("Price - High to Low")
              setShowSortModal(false)
            }}
          >
            Price - High to Low
          </button>
        </div>
      </Modal>

      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        hotels={filteredHotels}
        searchLocation={searchLocation}
      />
    </div>
  )
}

const Filters = ({ filters, onFilterChange, onResetFilters, facilityOptions, allDeals, setAllDeals }) => {
  const [localFilters, setLocalFilters] = useState(filters)
  const [priceRange, setPriceRange] = useState(filters.priceRange[0])

  const handleFilterChange = (category, value) => {
    let updatedFilters
    if (category === "priceRange") {
      updatedFilters = { ...localFilters, [category]: [300, value[0]] }
    } else {
      const currentFilters = localFilters[category] || []
      updatedFilters = {
        ...localFilters,
        [category]: currentFilters.includes(value)
          ? currentFilters.filter((item) => item !== value)
          : [...currentFilters, value],
      }
    }
    setLocalFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handlePriceRangeChange = (value) => {
    setPriceRange(value[0])
    handleFilterChange("priceRange", value)
  }

  const handleAllDealsChange = (e) => {
    setAllDeals(e.target.checked)
    onFilterChange(localFilters)
  }

  const resetFilters = () => {
    setPriceRange(300)
    setLocalFilters({
      priceRange: [300, 6000],
      facilities: [],
    })
    setAllDeals(false)
    onResetFilters()
  }

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Filters</h5>
        <div className="mb-4">
          <h6 className="mb-2">Your budget (per night)</h6>
          <div className="px-2 py-4">
            <Slider
              defaultValue={[priceRange]}
              min={300}
              max={6000}
              step={100}
              value={[priceRange]}
              onValueChange={handlePriceRangeChange}
              className="mb-2"
            />
            <div className="d-flex justify-content-between text-muted small">
              <span>₹300</span>
              <span>₹{priceRange}+</span>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <h6 className="mb-2">Deals</h6>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              checked={allDeals}
              onChange={handleAllDealsChange}
              id="allDeals"
            />
            <label className="form-check-label" htmlFor="allDeals">
              All deals
            </label>
          </div>
        </div>
        <div className="mb-4">
          <h6 className="mb-2">Facilities</h6>
          {facilityOptions.map((facility) => (
            <div className="form-check" key={facility.name}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={localFilters.facilities.includes(facility.name)}
                onChange={() => handleFilterChange("facilities", facility.name)}
                id={facility.name}
              />
              <label className="form-check-label" htmlFor={facility.name}>
                {facility.name}
              </label>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset all filters
          </button>
        </div>
      </div>
    </div>
  )
}

const HotelCard = ({ hotel, onSeeAvailability, viewType }) => {
  const getFacilityIcon = (facilityName) => {
    switch (facilityName.toLowerCase()) {
      case "wi-fi":
        return FaWifi
      case "parking":
        return FaCar
      case "pool":
        return FaWater
      case "gym":
        return FaDumbbell
      case "restaurant":
        return FaUtensils
      case "spa":
        return FaSpa
      case "bar":
        return FaMartiniGlass
      case "room service":
        return FaBell
      case "family room":
        return FaUsers
      case "laundry":
        return FaShirt
      case "air conditioning":
        return FaSnowflake
      case "cctv":
        return FaVideo
      case "facility for disabled guests":
        return FaWheelchair
      case "lift":
      case "elevator":
        return FaBuilding
      case "non-smoking area":
      case "smoke free area":
        return FaBanSmoking
      default:
        return FaCheck
    }
  }

  if (viewType === "grid") {
    return (
      <div className="card h-100 shadow-sm" onClick={() => onSeeAvailability(hotel.id)} style={{ cursor: "pointer" }}>
        <div className="position-relative">
          <img
            src={hotel["Property Images"]?.[0] || "/placeholder.svg?height=200&width=300"}
            className="card-img-top"
            alt={`${hotel["Property Name"]}`}
            style={{ height: "200px", objectFit: "cover" }}
          />
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h5 className="card-title mb-0">{hotel["Property Name"]}</h5>
            <div className="text-white px-2 py-1 rounded" style={{ backgroundColor: "#038A5E" }}>
              {Number.parseFloat(hotel.overallRating).toFixed(1)}
            </div>
          </div>
          <p className="card-text">
            <small className="text-muted">
              <FaLocationDot className="me-1" style={{ color: "#038A5E" }} />
              {hotel["Property Address"]}
            </small>
          </p>
          {hotel["Accommodation Facilities"]?.slice(0, 3).map((facility, index) => (
            <p key={index} className="card-text">
              <small className="text-muted">
                {React.createElement(getFacilityIcon(facility.name), {
                  className: "me-1",
                  style: { color: "#038A5E" },
                })}
                {facility.name}
              </small>
            </p>
          ))}
          <p className="card-text mt-auto">
            <span className="fs-5 fw-bold">₹{hotel.price.toFixed(2)}</span>
            <small className="text-muted"> per night</small>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="card mb-4 shadow-sm" onClick={() => onSeeAvailability(hotel.id)} style={{ cursor: "pointer" }}>
      <div className="row g-0">
        <div className="col-md-4 position-relative">
          <img
            src={hotel["Property Images"]?.[0] || "/placeholder.svg?height=200&width=300"}
            className="img-fluid rounded-start"
            alt={`${hotel["Property Name"]}`}
            style={{ height: "100%", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-5">
          <div className="card-body">
            <h5 className="card-title">{hotel["Property Name"]}</h5>
            <p className="card-text">
              <small className="text-muted">
                <FaLocationDot className="me-1" style={{ color: "#038A5E" }} />
                {hotel["Property Address"]}
              </small>
            </p>
            {hotel["Accommodation Facilities"]?.slice(0, 3).map((facility, index) => (
              <p key={index} className="card-text">
                <small className="text-muted">
                  {React.createElement(getFacilityIcon(facility.name), {
                    className: "me-1",
                    style: { color: "#038A5E" },
                  })}
                  {facility.name}
                </small>
              </p>
            ))}
            <p className="card-text">
              <span className="fs-4 fw-bold">₹{hotel.price.toFixed(2)} per night</span>
            </p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-body d-flex flex-column justify-content-between h-100">
            <div className="d-flex justify-content-end align-items-center">
              <div className="text-end me-2">
                <div style={{ color: "#038A5E" }} className="fw-bold">
                  {hotel.type}
                </div>
                <small className="text-muted">{hotel.reviewCount} reviews</small>
              </div>{" "}
              <div className="text-white px-2 py-1 rounded" style={{ backgroundColor: "#038A5E" }}>
                {Number.parseFloat(hotel.overallRating).toFixed(1)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelListing

