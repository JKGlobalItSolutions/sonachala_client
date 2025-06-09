import { useState, useEffect } from "react"
import { getFirestore, collection, onSnapshot } from "firebase/firestore"
import { useNavigate } from "react-router-dom"
import { MapPin, Wifi, Coffee, Car, Dumbbell, PocketIcon as Pool, CreditCard } from "lucide-react"

const customBlueColor = "#003B94"

const facilityIcons = {
  WiFi: Wifi,
  Restaurant: Coffee,
  Parking: Car,
  Gym: Dumbbell,
  Pool: Pool,
}

function HotelCard({ hotel, userId }) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/hotel-details/${hotel.propertyId}`, {
      state: {
        userId: userId,
        collectionName: hotel.collectionName,
        propertyType: hotel.Property_Type,
        guestCount: 1,
      },
    })
  }

  const getFacilityIcon = (facilityName) => {
    const IconComponent = facilityIcons[facilityName] || Coffee
    return <IconComponent size={20} style={{ color: customBlueColor }} className="me-1" />
  }

  // Format price
  const formatPrice = (price) => {
    const numPrice = Number.parseFloat(price)
    return !isNaN(numPrice) && numPrice > 0 ? `₹${numPrice.toFixed(2)}` : "Price not available"
  }

  return (
    <div className="card mb-3 hotel-card" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div className="card-body">
        <div className="row">
          <div className="col-md-4 mb-3 mb-md-0">
            <img
              src={
                Array.isArray(hotel.Property_Images)
                  ? hotel.Property_Images[0]
                  : hotel.Property_Images || "/placeholder.svg"
              }
              alt={hotel.Property_Name}
              className="img-fluid rounded"
              style={{ objectFit: "cover", height: "200px", width: "100%" }}
            />
          </div>
          <div className="col-md-8">
            <h5 className="card-title" style={{ color: customBlueColor }}>
              {hotel.Property_Name}
            </h5>
            <div className="d-flex align-items-center mb-3">
              <MapPin size={20} style={{ color: customBlueColor }} className="me-2" />
              <span>{hotel.Property_Address}</span>
            </div>
            <div className="mb-3">
              {Array.isArray(hotel.Property_Facility) ? (
                hotel.Property_Facility.slice(0, 3).map((facility, index) => (
                  <span key={index} className="me-3 d-inline-flex align-items-center">
                    {getFacilityIcon(typeof facility === "string" ? facility : facility.name)}
                    <span>{typeof facility === "string" ? facility : facility.name}</span>
                  </span>
                ))
              ) : (
                <span>No facilities information available</span>
              )}
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <CreditCard size={20} style={{ color: customBlueColor }} className="me-2" />
                <span className="h5 mb-0">{formatPrice(hotel.Property_Price)}</span>
              </div>
              <button className="btn btn-sm" style={{ backgroundColor: customBlueColor, color: "white" }}>
                See Availability
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Favourites({ userId }) {
  const [favoriteHotels, setFavoriteHotels] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const db = getFirestore()

  useEffect(() => {
    if (!userId) {
      console.error("No user ID provided")
      setIsLoading(false)
      return
    }

    const favoritesRef = collection(db, "Users", userId, "Favorites")
    const unsubscribe = onSnapshot(
      favoritesRef,
      (snapshot) => {
        const hotelsData = snapshot.docs.map((docSnapshot) => {
          const favoriteData = docSnapshot.data()
          console.log("Favorite data for hotel:", favoriteData) // Debug log
          return {
            id: docSnapshot.id,
            propertyId: favoriteData.propertyId,
            Property_Name: favoriteData["Property Name"],
            Property_Address: favoriteData["Property Address"],
            Property_Images: favoriteData["Property Image"] || favoriteData["Property Images"],
            Property_Facility: favoriteData["Property Facility"] || favoriteData["Accommodation Facilities"] || [],
            Property_Price: favoriteData["Property Price"],
            Property_Type: favoriteData["Property Type"],
            collectionName: favoriteData.collectionName,
          }
        })
        console.log("Fetched favorite hotels:", hotelsData) // For debugging
        setFavoriteHotels(hotelsData)
        setIsLoading(false)
      },
      (error) => {
        console.error("Error fetching favorite hotels:", error)
        setIsLoading(false)
      },
    )

    return () => unsubscribe()
  }, [userId, db])

  console.log("Rendering favorite hotels:", favoriteHotels)

  if (isLoading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border spinner-pulse" role="status" style={{ color: customBlueColor }}></div>
      </div>
    )
  }

  if (favoriteHotels.length === 0) {
    return (
      <div className="container mt-4">
        <h2 className="mb-4" style={{ color: customBlueColor }}>
          Favorites
        </h2>
        <div className="text-center mt-5">
          <p className="text-muted fade-in-message">No favorite hotels found.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4" style={{ color: customBlueColor }}>
        Favorites
      </h2>
      {favoriteHotels.map((hotel) => (
        <HotelCard key={hotel.id} hotel={hotel} userId={userId} />
      ))}
    </div>
  )
}

// Add CSS animations in a separate style tag or CSS file
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .hotel-card {
    animation: fadeIn 0.5s ease-out;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .hotel-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.12);
  }

  .spinner-pulse {
    animation: pulse 1s ease-in-out infinite;
  }

  .fade-in-message {
    animation: fadeIn 0.6s ease-out;
  }
`

// Inject styles
const styleElement = document.createElement("style")
styleElement.textContent = styles
document.head.appendChild(styleElement)

export default Favourites

