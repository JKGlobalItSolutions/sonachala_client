import React, { useState, useEffect, useRef, useCallback } from "react"
import {
  FaWifi,
  FaParking,
  FaWheelchair,
  FaSwimmingPool,
  FaUtensils,
  FaCoffee,
  FaDumbbell,
  FaSpa,
  FaStar,
} from "react-icons/fa"

const MapScreen = ({ selectedHotel, hotels }) => {
  const [map, setMap] = useState(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const scriptRef = useRef(null)
  const activeInfoWindowRef = useRef(null)

  const getAmenityIcon = useCallback((name) => {
    switch (name?.toLowerCase()) {
      case "wi-fi":
        return '<i class="fas fa-wifi" style="color: #003B94;"></i>'
      case "parking":
        return '<i class="fas fa-parking" style="color: #003B94;"></i>'
      case "facility for disabled guests":
        return '<i class="fas fa-wheelchair" style="color: #003B94;"></i>'
      case "swimming pool":
        return '<i class="fas fa-swimming-pool" style="color: #003B94;"></i>'
      case "restaurant":
        return '<i class="fas fa-utensils" style="color: #003B94;"></i>'
      case "coffee shop":
        return '<i class="fas fa-coffee" style="color: #003B94;"></i>'
      case "fitness center":
        return '<i class="fas fa-dumbbell" style="color: #003B94;"></i>'
      case "spa":
        return '<i class="fas fa-spa" style="color: #003B94;"></i>'
      default:
        return ""
    }
  }, [])

  const createInfoWindowContent = useCallback(
    (hotel) => {
      const stars = "★".repeat(hotel.rating || 5)
      const reviewCount = hotels.length

      return `
      <div class="map-card">
        <div class="hotel-image">
          <img 
            src="${hotel["Property Images"]?.[0] || "/placeholder.svg"}" 
            alt="${hotel["Property Name"]}"
            onerror="this.src='/placeholder.svg'"
          />
        </div>
        <div class="hotel-info">
          <div class="hotel-header">
            <h3 class="hotel-name">
              ${hotel["Property Name"]}
              <span class="stars">${stars}</span>
            </h3>
            <div class="rating-container">
              <div class="rating-score">${Number(hotel.overallRating || 0.0).toFixed(1)}</div>
              <div class="rating-text">
                <div class="rating-word">Good</div>
                <div class="review-count">${reviewCount} reviews</div>
              </div>
            </div>
          </div>
          <div class="property-address">${hotel["Property Address"] || "Address not available"}</div>
          <div class="price-info">Add dates to see prices</div>
        </div>
      </div>
      <style>
        .map-card {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          border: 1px solid #e0e0e0;
        }
        .hotel-image {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }
        .hotel-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .hotel-info {
          flex: 1;
          padding: 12px;
          display: flex;
          flex-direction: column;
        }
        .hotel-header {
          margin-bottom: 8px;
        }
        .hotel-name {
          font-size: 16px;
          font-weight: 600;
          color: #262626;
          margin: 0 0 8px 0;
        }
        .stars {
          color: #febb02;
          font-size: 14px;
          margin-left: 4px;
        }
        .rating-container {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .rating-score {
          background: #003B94;
          color: white;
          padding: 4px 8px;
          border-radius: 4px 4px 4px 0;
          font-weight: 600;
          font-size: 14px;
        }
        .rating-text {
          display: flex;
          flex-direction: column;
          font-size: 12px;
        }
        .rating-word {
          color: #003B94;
          font-weight: 500;
        }
        .review-count {
          color: #6b6b6b;
        }
        .property-address {
          color: #6b6b6b;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .price-info {
          color: #6b6b6b;
          font-size: 14px;
          margin-top: auto;
        }
        @media (min-width: 768px) {
          .map-card {
            flex-direction: row;
          }
          .hotel-image {
            width: 150px;
            min-width: 150px;
            height: 150px;
          }
        }
      </style>
    `
    },
    [hotels],
  )

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      return new Promise((resolve, reject) => {
        if (window.google) {
          resolve()
          return
        }

        const script = document.createElement("script")
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAba8Pvzm4uXVQs3VKdlqW-JqavRU1yIEs`
        script.async = true
        script.defer = true
        script.onload = resolve
        script.onerror = reject
        document.head.appendChild(script)
        scriptRef.current = script
      })
    }

    const initializeMap = () => {
      if (mapRef.current && window.google) {
        const mapInstance = new window.google.maps.Map(mapRef.current, {
          center: { lat: 12.2253, lng: 79.0747 },
          zoom: 13,
          mapTypeControl: false,
          fullscreenControl: false,
          streetViewControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        })
        setMap(mapInstance)
      }
    }

    loadGoogleMapsScript()
      .then(initializeMap)
      .catch((error) => console.error("Error loading Google Maps:", error))

    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
      }
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []
    }
  }, [])

  useEffect(() => {
    if (map && hotels && hotels.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      markersRef.current.forEach((marker) => marker.setMap(null))
      markersRef.current = []

      hotels.forEach((hotel) => {
        if (!hotel.latitude || !hotel.longitude) return

        const position = {
          lat: Number(hotel.latitude),
          lng: Number(hotel.longitude),
        }
        bounds.extend(position)

        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: hotel["Property Name"],
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
          },
        })

        markersRef.current.push(marker)

        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(hotel),
          maxWidth: 400,
          pixelOffset: new window.google.maps.Size(0, -30),
        })

        marker.addListener("click", () => {
          if (activeInfoWindowRef.current) {
            activeInfoWindowRef.current.close()
          }
          infoWindow.open(map, marker)
          activeInfoWindowRef.current = infoWindow
        })
      })

      if (markersRef.current.length > 0) {
        map.fitBounds(bounds)
        const listener = window.google.maps.event.addListenerOnce(map, "idle", () => {
          if (map.getZoom() > 15) map.setZoom(15)
        })
      }
    }
  }, [map, hotels, createInfoWindowContent])

  useEffect(() => {
    if (map && selectedHotel && selectedHotel.latitude && selectedHotel.longitude) {
      const position = {
        lat: Number(selectedHotel.latitude),
        lng: Number(selectedHotel.longitude),
      }
      map.setCenter(position)
      map.setZoom(15)

      if (activeInfoWindowRef.current) {
        activeInfoWindowRef.current.close()
      }

      const marker = markersRef.current.find(
        (m) => m.getPosition().lat() === position.lat && m.getPosition().lng() === position.lng,
      )

      if (marker) {
        const infoWindow = new window.google.maps.InfoWindow({
          content: createInfoWindowContent(selectedHotel),
          maxWidth: 400,
          pixelOffset: new window.google.maps.Size(0, -30),
        })
        infoWindow.open(map, marker)
        activeInfoWindowRef.current = infoWindow
      }
    }
  }, [map, selectedHotel, createInfoWindowContent])

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "100%",
        minHeight: "400px",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {!hotels ||
        (hotels.length === 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              backgroundColor: "#f8f9fa",
            }}
          >
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ))}
    </div>
  )
}

export default MapScreen

