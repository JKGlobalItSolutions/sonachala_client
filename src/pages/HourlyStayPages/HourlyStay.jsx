import React, { useState, useRef, useEffect } from 'react';
import { FaLocationDot, FaCheck, FaArrowUp, FaList, FaGrip, FaFilter, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { Link, useNavigate } from 'react-router-dom';

// Mock data for hotels
const mockHotels = [
  {
    id: 1,
    name: "Luxury Hotel Chennai",
    location: "T Nagar, Chennai",
    rating: "4.5",
    reviewCount: 128,
    basePrice: 1200,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    facilities: ["Wi-Fi", "AC", "TV", "Room Service", "Parking", "Restaurant", "Gym", "Pool"],
  },
  {
    id: 2,
    name: "Business Hotel",
    location: "Anna Nagar, Chennai",
    rating: "4.2",
    reviewCount: 95,
    basePrice: 900,
    images: [
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    facilities: ["Wi-Fi", "AC", "TV", "Room Service", "Parking", "Restaurant"],
  },
  {
    id: 3,
    name: "City Center Hotel",
    location: "Mount Road, Chennai",
    rating: "4.0",
    reviewCount: 156,
    basePrice: 800,
    images: [
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80",
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80"
    ],
    facilities: ["Wi-Fi", "AC", "Room Service", "Parking", "Restaurant"],
  },
  {
    id: 4,
    name: "Premium Stay",
    location: "Egmore, Chennai",
    rating: "4.7",
    reviewCount: 203,
    basePrice: 1500,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    facilities: ["Wi-Fi", "AC", "TV", "Room Service", "Parking", "Restaurant", "Gym", "Pool", "Spa"],
  },
  // Add more mock hotels here to test pagination
  ...Array.from({ length: 20 }, (_, i) => ({
    id: i + 5,
    name: `Hotel ${i + 5}`,
    location: "Chennai",
    rating: (Math.random() * (5 - 3) + 3).toFixed(1),
    reviewCount: Math.floor(Math.random() * 200) + 50,
    basePrice: Math.floor(Math.random() * 1000) + 500,
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    ],
    facilities: ["Wi-Fi", "AC", "TV", "Room Service"],
  }))
];

const HourlyStay = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    priceRange: [300, 3000],
    facilities: [],
    duration: '3'
  });
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [searchLocation, setSearchLocation] = useState('');
  const [checkInTime, setCheckInTime] = useState('02:00 PM');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [viewType, setViewType] = useState('list');
  const [filteredHotels, setFilteredHotels] = useState(mockHotels);
  const [displayedHotels, setDisplayedHotels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const hotelsPerPage = 5;
  const timePickerRef = useRef(null);
  const guestsDropdownRef = useRef(null);

  const durationOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: `${i + 1} Hour${i === 0 ? '' : 's'}`,
    price: 1 + (i * 0.1)
  }));

  const facilityOptions = [
    { name: 'Wi-Fi', icon: 'wifi' },
    { name: 'AC', icon: 'snowflake' },
    { name: 'TV', icon: 'tv' },
    { name: 'Room Service', icon: 'concierge-bell' },
    { name: 'Parking', icon: 'parking' },
    { name: 'Restaurant', icon: 'utensils' },
    { name: 'Gym', icon: 'dumbbell' },
    { name: 'Pool', icon: 'swimming-pool' },
    { name: 'Spa', icon: 'spa' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300);
    };

    window.addEventListener('scroll', handleScroll);

    // Initialize time picker
    const fp = flatpickr(timePickerRef.current, {
      enableTime: true,
      noCalendar: true,
      dateFormat: "h:i K",
      minTime: "09:00",
      maxTime: "21:00",
      defaultDate: "14:00",
      time_24hr: false,
      onChange: (selectedDates, dateStr) => {
        setCheckInTime(dateStr);
      }
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (guestsDropdownRef.current && !guestsDropdownRef.current.contains(event.target)) {
        setShowGuestsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      fp.destroy();
    };
  }, []);

  useEffect(() => {
    setDisplayedHotels(filteredHotels.slice(0, currentPage * hotelsPerPage));
  }, [filteredHotels, currentPage]);

  const calculateHourlyPrice = (basePrice, duration) => {
    const multiplier = durationOptions.find(opt => opt.value === duration)?.price || 1;
    return basePrice * multiplier;
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (filtersToApply) => {
    const filtered = mockHotels.filter(hotel => {
      const hourlyPrice = calculateHourlyPrice(hotel.basePrice, filtersToApply.duration);
      const [minPrice, maxPrice] = filtersToApply.priceRange;
      
      if (hourlyPrice < minPrice || hourlyPrice > maxPrice) {
        return false;
      }
      
      if (filtersToApply.facilities.length > 0) {
        if (!filtersToApply.facilities.every(facility => 
          hotel.facilities.includes(facility)
        )) {
          return false;
        }
      }
      
      return true;
    });
    
    setFilteredHotels(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    const resetFilters = {
      priceRange: [300, 3000],
      facilities: [],
      duration: '3'
    };
    setFilters(resetFilters);
    setFilteredHotels(mockHotels);
    setCurrentPage(1);
  };

  const handleDurationChange = (duration) => {
    setFilters(prev => ({ ...prev, duration }));
    applyFilters({ ...filters, duration });
    setDisplayedHotels(prevHotels => 
      prevHotels.map(hotel => ({
        ...hotel,
        selectedDuration: duration
      }))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
    console.log('Search submitted:', {
      location: searchLocation,
      checkInTime,
      duration: filters.duration,
      rooms,
      adults,
      children
    });
    // You can add logic here to filter hotels based on the search criteria
  };

  const loadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const incrementAdults = () => {
    setAdults(prev => Math.max(prev + 1, rooms));
  };

  const decrementAdults = () => {
    if (adults > rooms) {
      setAdults(prev => prev - 1);
    }
  };

  const addChild = () => {
    setChildren(prev => prev + 1);
  };

  const removeChild = () => {
    if (children > 0) {
      setChildren(prev => prev - 1);
    }
  };

  const incrementRooms = () => {
    setRooms(prev => {
      const newRooms = prev + 1;
      if (adults < newRooms) {
        setAdults(newRooms);
      }
      return newRooms;
    });
  };

  const decrementRooms = () => {
    if (rooms > 1) {
      setRooms(prev => prev - 1);
    }
  };

  const handleGuestsClick = () => {
    setShowGuestsDropdown(!showGuestsDropdown);
  };

  const updateGuests = () => {
    return `${adults} Adults, ${children} Children, ${rooms} Rooms`;
  };

  return (
    <div className="p-lg-3 bg-light">
      {/* Search Section */}
      <div className="bg-black p-3">
        <div className="container">
          <form onSubmit={handleSubmit} className="row g-2 g-md-3">
            <div className="col-12 col-md-6 col-lg-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Enter destination"
                value={searchLocation || ''}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <input 
                type="text" 
                className="form-control" 
                placeholder="Check-in Time"
                value={checkInTime}
                ref={timePickerRef}
                readOnly
              />
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <select 
                className="form-select"
                value={filters.duration}
                onChange={(e) => handleDurationChange(e.target.value)}
              >
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <div ref={guestsDropdownRef} className="position-relative">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Guests & Rooms" 
                  value={adults + children + rooms > 0 ? updateGuests() : ''}
                  onClick={handleGuestsClick}
                  readOnly 
                />
                {showGuestsDropdown && (
                  <div className="dropdown-menu show p-3" style={{ position: 'absolute', zIndex: 1000, width: '100%' }}>
                    <div className="mb-3">
                      <label>Adults</label>
                      <div className="input-group">
                        <button type="button" className="btn btn-outline-secondary" onClick={decrementAdults}>-</button>
                        <input type="text" className="form-control text-center" value={adults} readOnly />
                        <button type="button" className="btn btn-outline-secondary" onClick={incrementAdults}>+</button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label>Children</label>
                      <div className="input-group">
                        <button type="button" className="btn btn-outline-secondary" onClick={removeChild}>-</button>
                        <input type="text" className="form-control text-center" value={children} readOnly />
                        <button type="button" className="btn btn-outline-secondary" onClick={addChild}>+</button>
                      </div>
                    </div>
                    <div>
                      <label>Rooms</label>
                      <div className="input-group">
                        <button type="button" className="btn btn-outline-secondary" onClick={decrementRooms}>-</button>
                        <input type="text" className="form-control text-center" value={rooms} readOnly />
                        <button type="button" className="btn btn-outline-secondary" onClick={incrementRooms}>+</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-12 col-lg-2">
              <button type="submit" className="btn w-100 fw-bold" style={{ backgroundColor: '#003B94', color: '#ffffff' }}>
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="bg-light py-2">
        <div className="container">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none" style={{ color: '#003B94' }}>
                Home
              </Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/hourly-stay" className="text-decoration-none" style={{ color: '#003B94' }}>
                Hourly Stays
              </Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {searchLocation} 
            </li>
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">
            {searchLocation}: {filteredHotels.length} hourly stay hotels found
          </h4>
          <div className="d-flex gap-3">
            <div className="btn-group d-none d-md-flex">
              <button 
                className={`btn btn-outline-secondary ${viewType === 'list' ? 'active' : ''}`}
                onClick={() => setViewType('list')}
              >
                <FaList />
              </button>
              <button 
                className={`btn btn-outline-secondary ${viewType === 'grid' ? 'active' : ''}`}
                onClick={() => setViewType('grid')}
              >
                <FaGrip />
              </button>
            </div>
            <button 
              className="btn btn-outline-secondary d-md-none"
              onClick={() => setShowFilterModal(true)}
            >
              <FaFilter /> Filters
            </button>
          </div>
        </div>

        <div className="row">
          {/* Filters Sidebar */}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Duration</h5>
                <select 
                  className="form-select"
                  value={filters.duration}
                  onChange={(e) => handleDurationChange(e.target.value)}
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <Filters 
              filters={filters} 
              onFilterChange={handleFilterChange} 
              onResetFilters={resetFilters}
              facilityOptions={facilityOptions}
            />
          </div>

          {/* Hotel List */}
          <div className="col-lg-9">
            <div className={`${viewType === 'grid' ? 'row row-cols-1 row-cols-md-2 g-4' : ''}`}>
              {displayedHotels.map(hotel => (
                <div key={hotel.id} className={viewType === 'grid' ? 'col' : ''}>
                  <HourlyHotelCard 
                    hotel={hotel}
                    calculatePrice={calculateHourlyPrice}
                    viewType={viewType}
                    durationOptions={durationOptions}
                    navigate={navigate}
                    selectedDuration={hotel.selectedDuration || filters.duration}
                    onDurationChange={(hotelId, duration) => {
                      setDisplayedHotels(prevHotels => 
                        prevHotels.map(h => 
                          h.id === hotelId ? { ...h, selectedDuration: duration } : h
                        )
                      );
                      if (hotelId === displayedHotels[0].id) {
                        handleDurationChange(duration);
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            {displayedHotels.length < filteredHotels.length && (
              <div className="text-center mt-4">
                <button className="btn btn-primary" onClick={loadMore}>
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        className={`btn rounded-circle position-fixed bottom-0 end-0 m-4 ${showBackToTop ? 'd-block' : 'd-none'}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        style={{ width: '50px', height: '50px', backgroundColor: '#003B94', color: '#ffffff' }}
      >
        <FaArrowUp />
      </button>

      {/* Filter Modal for Mobile */}
      {showFilterModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Filters</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowFilterModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-4">
                  <h5>Duration</h5>
                  <select 
                    className="form-select"
                    value={filters.duration}
                    onChange={(e) => handleDurationChange(e.target.value)}
                  >
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <Filters 
                  filters={filters} 
                  onFilterChange={handleFilterChange} 
                  onResetFilters={resetFilters}
                  facilityOptions={facilityOptions}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowFilterModal(false)}
                >
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={() => setShowFilterModal(false)}
                  style={{ backgroundColor: '#003B94', color: '#ffffff' }}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Filters = ({ filters, onFilterChange, onResetFilters, facilityOptions }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState(filters.priceRange[0]);

  const handleFilterChange = (category, value) => {
    let updatedFilters;
    if (category === 'priceRange') {
      updatedFilters = { ...localFilters, [category]: [300, value[0]] };
    } else {
      const currentFilters = localFilters[category] || [];
      updatedFilters = {
        ...localFilters,
        [category]: currentFilters.includes(value)
          ? currentFilters.filter(item => item !== value)
          : [...currentFilters, value]
      };
    }
    setLocalFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handlePriceRangeChange = (value) => {
    setPriceRange(value[0]);
    handleFilterChange('priceRange', value);
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Filters</h5>
        <div className="mb-4">
          <h6 className="mb-2">Price Range</h6>
          <input
            type="range"
            className="form-range"
            min="300"
            max="3000"
            step="100"
            value={priceRange}
            onChange={(e) => handlePriceRangeChange([parseInt(e.target.value)])}
          />
          <div className="d-flex justify-content-between text-muted small">
            <span>₹300</span>
            <span>₹{priceRange}+</span>
          </div>
        </div>
        <div className="mb-4">
          <h6 className="mb-2">Facilities</h6>
          <div className="d-flex flex-wrap gap-2">
            {facilityOptions.map((facility) => (
              <div className="form-check" key={facility.name}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={localFilters.facilities.includes(facility.name)}
                  onChange={() => handleFilterChange('facilities', facility.name)}
                  id={facility.name}
                />
                <label className="form-check-label" htmlFor={facility.name}>
                  {facility.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <button className="btn btn-secondary" onClick={onResetFilters}>
            Reset all filters
          </button>
        </div>
      </div>
    </div>
  );
};

const HourlyHotelCard = ({ hotel, calculatePrice, viewType, durationOptions, navigate, selectedDuration, onDurationChange }) => {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -100 : 100;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleSeeAvailability = () => {
    if (selectedDuration) {
      const hourlyPrice = calculatePrice(hotel.basePrice, selectedDuration);
      navigate(`/hourly-stay-room-details`, { state: { selectedDuration, hourlyPrice } });
    } else {
      alert("Please select a duration before checking availability.");
    }
  };

  const scrollButtonStyle = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.7rem',
    color: '#495057',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    zIndex: 1,
  };

  const hourBoxStyle = {
    transition: 'all 0.3s ease',
  };

  const cardStyle = {
    transition: 'all 0.3s ease',
    border: '1px solid #dee2e6',
  };

  const renderCardContent = () => (
    <>
      <div className="card-body p-2">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <h6 className="card-title mb-0 fs-6">{hotel.name}</h6>
          <div style={{ backgroundColor: '#003B94', color: '#ffffff' }} className="px-2 py-1 rounded small">
            {hotel.rating}
          </div>
        </div>
        <p className="card-text mb-1">
          <small className="text-muted">
            <FaLocationDot style={{ color: '#003B94' }} className="me-1" />
            <span className="fs-7">{hotel.location}</span>
          </small>
        </p>
        <div className="d-flex align-items-center mb-1">
          <FaClock style={{ color: '#003B94' }} className="me-1" />
          <span className="fs-7">{selectedDuration ? `${selectedDuration} Hour Stay` : 'Select duration'}</span>
        </div>
        <div className="position-relative mb-2">
          <button 
            className="position-absolute top-50 start-0 translate-middle-y" 
            onClick={() => handleScroll('left')}
            style={scrollButtonStyle}
          >
            <FaChevronLeft />
          </button>
          <div 
            ref={scrollContainerRef} 
            className="d-flex overflow-auto" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {durationOptions.map((option) => (
              <div
                key={option.value}
                className={`flex-shrink-0 me-1 p-1 border rounded ${selectedDuration === option.value ? 'border-danger' : 'border-secondary'}`}
                style={{
                  ...hourBoxStyle,
                  cursor: 'pointer',
                }}
                onClick={() => onDurationChange(hotel.id, option.value)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#003B94';
                  e.currentTarget.style.borderWidth = '1px';
                  e.currentTarget.style.backgroundColor = 'rgba(0, 59, 148, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = selectedDuration === option.value ? '#003B94' : '#6c757d';
                  e.currentTarget.style.borderWidth = '1px';
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <div className="small fs-7">{option.label}</div>
                <div className="fw-bold fs-7">₹{calculatePrice(hotel.basePrice, option.value).toFixed(2)}</div>
              </div>
            ))}
          </div>
          <button 
            className="position-absolute top-50 end-0 translate-middle-y" 
            onClick={() => handleScroll('right')}
            style={scrollButtonStyle}
          >
            <FaChevronRight />
          </button>
        </div>
        <div className="mt-2 border-top pt-2">
          <p className="mb-1 fs-7">Amenities:</p>
          <div className="d-flex flex-wrap gap-1">
            {hotel.facilities.map((facility, index) => (
              <span key={index} className="badge bg-light text-dark fs-8">{facility}</span>
            ))}
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <p className="card-text mb-0">
            <span className="fs-6 fw-bold">
              {selectedDuration ? `₹${calculatePrice(hotel.basePrice, selectedDuration).toFixed(2)}` : 'Select duration'}
            </span>
          </p>
          <button 
            className="btn btn-sm" 
            style={{ backgroundColor: '#003B94', color: '#ffffff' }}
            onClick={handleSeeAvailability}
            disabled={!selectedDuration}
          >
            See Availability
          </button>
        </div>
      </div>
    </>
  );

  if (viewType === 'grid') {
    return (
      <div 
        className="card h-100 shadow-sm" 
        style={cardStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.border = '1px solid #003B94';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.border = '1px solid #dee2e6';
        }}
      >
        <img 
          src={hotel.images[0] || "/placeholder.svg"} 
          className="card-img-top" 
          alt={hotel.name} 
          style={{ height: '150px', objectFit: 'cover' }}
        />
        {renderCardContent()}
      </div>
    );
  }

  return (
    <div 
      className="card mb-3 shadow-sm" 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.border = '1px solid #003B94';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.border = '1px solid #dee2e6';
      }}
    >
      <div className="row g-0">
        <div className="col-md-4">
          <img 
            src={hotel.images[0] || "/placeholder.svg"} 
            className="img-fluid rounded-start h-100 w-100" 
            alt={hotel.name} 
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          {renderCardContent()}
        </div>
      </div>
    </div>
  );
};

export default HourlyStay;