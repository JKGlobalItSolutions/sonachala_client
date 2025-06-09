import React from "react"
import {
  FaMapMarkedAlt,
  FaWifi,
  FaParking,
  FaWheelchair,
  FaSwimmingPool,
  FaUtensils,
  FaCoffee,
  FaDumbbell,
  FaSpa,
} from "react-icons/fa"

const MapCard = ({ location, onOpenMap, hotels }) => {
  const getAmenityIcon = (name) => {
    switch (name?.toLowerCase()) {
      case "wi-fi":
        return <FaWifi className="amenity-icon" />
      case "parking":
        return <FaParking className="amenity-icon" />
      case "facility for disabled guests":
        return <FaWheelchair className="amenity-icon" />
      case "swimming pool":
        return <FaSwimmingPool className="amenity-icon" />
      case "restaurant":
        return <FaUtensils className="amenity-icon" />
      case "coffee shop":
        return <FaCoffee className="amenity-icon" />
      case "fitness center":
        return <FaDumbbell className="amenity-icon" />
      case "spa":
        return <FaSpa className="amenity-icon" />
      default:
        return null
    }
  }

  return (
    <div className="card mb-4 cursor-pointer" onClick={onOpenMap}>
      <div className="card-body">
        <h5 className="card-title d-flex align-items-center">
          <FaMapMarkedAlt className="me-2" style={{ color: "#003B94" }} />
          Map View
        </h5>
        <p className="card-text text-muted mb-3">Click to view properties on map</p>
        {hotels && hotels.length > 0 && (
          <div className="hotel-list mb-3">
            {hotels.slice(0, 3).map((hotel, index) => (
              <div key={index} className="hotel-item">
                <span className="hotel-name">{hotel["Property Name"] || "Unnamed Property"}</span>
                <div className="amenities">
                  {hotel["Accommodation Facilities"]?.slice(0, 3).map((facility, i) => (
                    <span key={i} className="amenity">
                      {getAmenityIcon(facility.name)}
                      <span className="amenity-name">{facility.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {hotels.length > 3 && (
              <div className="hotel-item text-muted">And {hotels.length - 3} more properties...</div>
            )}
          </div>
        )}
        <div className="ratio ratio-16x9">
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAba8Pvzm4uXVQs3VKdlqW-JqavRU1yIEs&q=${encodeURIComponent(location)}&zoom=13`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <style jsx>{`
        .card {
          transition: all 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.125);
          border-radius: 0.5rem;
        }
        .card:hover {
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        .card-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
        }
        .card-text {
          font-size: 0.9rem;
        }
        .ratio {
          border-radius: 0.375rem;
          overflow: hidden;
        }
        .hotel-list {
          font-size: 0.9rem;
        }
        .hotel-item {
          margin-bottom: 0.5rem;
        }
        .hotel-name {
          font-weight: 500;
          display: block;
          margin-bottom: 0.25rem;
        }
        .amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .amenity {
          display: flex;
          align-items: center;
          font-size: 0.8rem;
          color: #666;
        }
        .amenity-icon {
          margin-right: 0.25rem;
          color: #003B94;
        }
        .amenity-name {
          white-space: nowrap;
        }
      `}</style>
    </div>
  )
}

export default MapCard

