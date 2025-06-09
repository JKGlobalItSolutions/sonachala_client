import React, { useState, useEffect, useRef } from "react"
import {
  FaMapMarkerAlt,
  FaWifi,
  FaParking,
  FaWheelchair,
  FaSwimmingPool,
  FaUtensils,
  FaCoffee,
  FaDumbbell,
  FaSpa,
} from "react-icons/fa"
import MapScreen from "../pages/MapScreen"

const MapModal = ({ isOpen, onClose, hotels, searchLocation }) => {
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const cardsRef = useRef(null)

  const getAmenityIcon = (name) => {
    switch (name?.toLowerCase()) {
      case "wi-fi":
        return <FaWifi className="facility-icon" />
      case "parking":
        return <FaParking className="facility-icon" />
      case "facility for disabled guests":
        return <FaWheelchair className="facility-icon" />
      case "swimming pool":
        return <FaSwimmingPool className="facility-icon" />
      case "restaurant":
        return <FaUtensils className="facility-icon" />
      case "coffee shop":
        return <FaCoffee className="facility-icon" />
      case "fitness center":
        return <FaDumbbell className="facility-icon" />
      case "spa":
        return <FaSpa className="facility-icon" />
      default:
        return null
    }
  }

  useEffect(() => {
    if (isOpen && hotels?.length > 0) {
      setSelectedHotel(hotels[0])
    }
  }, [isOpen, hotels])

  const handleCardScroll = (index) => {
    setActiveIndex(index)
    setSelectedHotel(hotels[index])
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <div className="map-container">
          <MapScreen selectedHotel={selectedHotel} hotels={hotels} />
        </div>
        <div ref={cardsRef} className="hotel-cards-container">
          {hotels?.map((hotel, index) => (
            <div
              key={hotel.id}
              className={`hotel-card ${index === activeIndex ? "active" : ""}`}
              onClick={() => handleCardScroll(index)}
            >
              <div className="hotel-image">
                <img
                  src={hotel["Property Images"]?.[0] || "/placeholder.svg?height=128&width=128"}
                  alt={hotel["Property Name"]}
                />
                {hotel.type === "Homestay" && <span className="new-tag">new homestay</span>}
              </div>
              <div className="hotel-info">
                <div className="hotel-name">{hotel["Property Name"] || "Unnamed Property"}</div>
                <div className="location">
                  <FaMapMarkerAlt className="icon" />
                  <span className="location-text">TIRUVANNAMALAI</span>
                </div>
                <div className="facilities">
                  {hotel["Accommodation Facilities"]?.slice(0, 3).map((facility, i) => (
                    <div key={i} className="facility">
                      {getAmenityIcon(facility.name)}
                      <span>{facility.name}</span>
                    </div>
                  ))}
                </div>
                <div className="price-section">
                  <div className="rupee-icon">₹</div>
                  <span className="price-text">Average</span>
                </div>
                <button
                  className="availability-button"
                  onClick={(e) => {
                    e.stopPropagation()
                    window.location.href = `/hotel-details/${hotel.id}`
                  }}
                >
                  See Availability
                </button>
                <div className="rating">
                  <div className="score">{Number(hotel.overallRating || 0).toFixed(1)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background-color: white;
          width: 90vw;
          height: 90vh;
          display: flex;
          flex-direction: column;
          position: relative;
          border-radius: 8px;
          overflow: hidden;
        }
        .close-button {
          position: absolute;
          right: 20px;
          top: 20px;
          background: white;
          border: none;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          font-size: 20px;
          cursor: pointer;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .map-container {
          flex: 1;
          position: relative;
        }
        .hotel-cards-container {
          height: 180px;
          overflow-x: auto;
          display: flex;
          gap: 16px;
          padding: 16px;
          background: white;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .hotel-cards-container::-webkit-scrollbar {
          display: none;
        }
        .hotel-card {
          flex: 0 0 300px;
          scroll-snap-align: start;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          overflow: hidden;
          cursor: pointer;
          display: flex;
          transition: transform 0.2s;
        }
        .hotel-card:hover, .hotel-card.active {
          transform: translateY(-4px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        .hotel-image {
          position: relative;
          width: 120px;
          height: 150px;
        }
        .hotel-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .new-tag {
          position: absolute;
          top: 8px;
          left: 8px;
          background: #003B94;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
          text-transform: lowercase;
        }
        .hotel-info {
          flex: 1;
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .hotel-name {
          font-weight: 600;
          font-size: 16px;
          color: #333;
        }
        .location {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .location .icon {
          color: #003B94;
          font-size: 14px;
        }
        .location-text {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
        .facilities {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .facility {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #666;
          font-size: 12px;
        }
        .facility-icon {
          color: #003B94;
          font-size: 14px;
        }
        .price-section {
          display: flex;
          align-items: center;
          gap: 4px;
          margin-top: auto;
        }
        .rupee-icon {
          color: #003B94;
          font-weight: bold;
        }
        .price-text {
          color: #666;
          font-size: 14px;
        }
        .availability-button {
          background: #003B94;
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          width: fit-content;
          margin-top: 8px;
        }
        .rating {
          position: absolute;
          top: 12px;
          right: 12px;
        }
        .score {
          background: #003B94;
          color: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
          font-size: 14px;
        }
      `}</style>
    </div>
  )
}

export default MapModal

