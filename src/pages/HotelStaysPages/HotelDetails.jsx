import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  FaHeart,
  FaWifi,
  FaDumbbell,
  FaUtensils,
  FaHotel,
  FaMapMarkerAlt,
  FaCheck,
  FaShareAlt,
  FaParking,
  FaSpa,
  FaWheelchair,
  FaStar,
  FaEdit,
  FaTrash,
  FaVideo,
  FaTshirt,
  FaBell,
  FaUsers,
  FaGlassMartini,
  FaSnowflake,
  FaBuilding,
  FaSmokingBan,
  FaSwimmer,
} from "react-icons/fa"
import flatpickr from "flatpickr"
import "flatpickr/dist/flatpickr.min.css"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  setDoc,
  deleteDoc,
  addDoc,
  updateDoc,
} from "firebase/firestore"
import { auth, db } from "../../firebase/config"
import { toast } from "react-toastify"
import { format } from "date-fns"
import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

const calculateTotalPrice = (roomDetails, totalNights, totalAdults, totalChildren, totalRooms) => {
  const nightPrice = calculateTotalNightPrice(totalNights, roomDetails.perNightPrice, totalRooms)
  const guestPrice = calculateTotalGuestPrice(
    totalAdults,
    totalChildren,
    roomDetails.perAdultPrice,
    roomDetails.perChildPrice,
  )
  const totalPrice = nightPrice + guestPrice
  const discount = calculateDiscount(totalPrice, roomDetails.discountValue)
  return totalPrice - discount
}

const calculateTotalNightPrice = (nights, roomPrice, totalRooms) => {
  return nights * roomPrice * totalRooms
}

const calculateTotalGuestPrice = (adults, children, perAdultPrice, perChildPrice) => {
  return adults * perAdultPrice + children * perChildPrice
}

const calculateDiscount = (totalPrice, discountValue) => {
  return totalPrice * (discountValue / 100)
}

const HotelDetails = () => {
  const { hotelId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [isFavorite, setIsFavorite] = useState(false)
  const [searchLocation, setSearchLocation] = useState("")
  const [dates, setDates] = useState("")
  const [guests, setGuests] = useState("")
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false)
  const datePickerRef = useRef(null)
  const guestsDropdownRef = useRef(null)
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reviewCategories, setReviewCategories] = useState([])
  const [canSubmitReview, setCanSubmitReview] = useState(false)
  const [reviews, setReviews] = useState([])
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [newReview, setNewReview] = useState({
    staffReview: 0,
    luxury: 0,
    amenities: 0,
    price: 0,
    comments: "",
  })

  const fetchPropertyDetails = useCallback(async () => {
    if (!hotelId) {
      setError("No property ID provided")
      setLoading(false)
      return
    }

    try {
      let propertyDoc
      let propertyType

      // Try to fetch from Hotels collection
      propertyDoc = await getDoc(doc(db, "Hotels", hotelId))
      if (propertyDoc.exists()) {
        propertyType = "Hotel"
      } else {
        // If not found in Hotels, try Homestays collection
        propertyDoc = await getDoc(doc(db, "Homestays", hotelId))
        if (propertyDoc.exists()) {
          propertyType = "Homestay"
        }
      }

      if (propertyDoc && propertyDoc.exists()) {
        const propertyData = { id: propertyDoc.id, ...propertyDoc.data(), type: propertyType }

        // Fetch reviews to calculate overall rating
        const reviewsSnapshot = await getDocs(collection(db, propertyType + "s", hotelId, "Reviews"))
        let totalRating = 0
        let totalStaffReview = 0
        let totalLuxury = 0
        let totalAmenities = 0
        let totalPrice = 0
        const reviewCount = reviewsSnapshot.size

        reviewsSnapshot.forEach((doc) => {
          const review = doc.data()
          totalRating += review.overallRating || 0
          totalStaffReview += review.staffReview || 0
          totalLuxury += review.luxury || 0
          totalAmenities += review.amenities || 0
          totalPrice += review.price || 0
        })

        const overallRating =
          reviewCount > 0 ? (totalStaffReview + totalLuxury + totalAmenities + totalPrice) / (reviewCount * 4) : 0
        const averageStaffReview = reviewCount > 0 ? totalStaffReview / reviewCount : 0
        const averageLuxury = reviewCount > 0 ? totalLuxury / reviewCount : 0
        const averageAmenities = reviewCount > 0 ? totalAmenities / reviewCount : 0
        const averagePrice = reviewCount > 0 ? totalPrice / reviewCount : 0

        // Fetch room details
        const roomSnapshot = await getDocs(collection(db, propertyType + "s", hotelId, "Rooms"))
        let roomDetails = {}
        if (roomSnapshot.docs.length > 0) {
          const roomData = roomSnapshot.docs[0].data()
          roomDetails = {
            perNightPrice: Number.parseFloat(roomData.roomPrice) || 0,
            perAdultPrice: Number.parseFloat(roomData.perAdultPrice) || 0,
            perChildPrice: Number.parseFloat(roomData.perChildPrice) || 0,
            discountValue: Number.parseFloat(roomData.discountValue) || 0,
          }
        }

        setProperty({
          ...propertyData,
          overallRating,
          averageStaffReview,
          averageLuxury,
          averageAmenities,
          averagePrice,
          reviewCount,
          roomDetails,
        })
        setSearchLocation(propertyData["Property Address"] || "")
        await fetchReviewCategories(hotelId, propertyType)
        await checkBookingStatus(hotelId)
        await fetchReviews(hotelId, propertyType)
      } else {
        setError("Property not found")
      }
    } catch (err) {
      console.error("Error fetching property data:", err)
      setError("Error fetching property data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }, [hotelId])

  const getTotalNights = () => {
    if (!dates) return 1
    const [start, end] = dates.split(" - ").map((date) => new Date(date))
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  const fetchReviewCategories = async (propertyId, propertyType) => {
    try {
      const reviewsSnapshot = await getDocs(collection(db, propertyType + "s", propertyId, "Reviews"))
      let totalStaffReview = 0
      let totalLuxury = 0
      let totalAmenities = 0
      let totalPrice = 0
      const count = reviewsSnapshot.size

      reviewsSnapshot.forEach((doc) => {
        const review = doc.data()
        totalStaffReview += review.staffReview || 0
        totalLuxury += review.luxury || 0
        totalAmenities += review.amenities || 0
        totalPrice += review.price || 0
      })

      const categories = [
        { name: "Staff Members", rating: count > 0 ? totalStaffReview / count : 0 },
        { name: "Luxury", rating: count > 0 ? totalLuxury / count : 0 },
        { name: "Fair Price", rating: count > 0 ? totalPrice / count : 0 },
        { name: "Amenities", rating: count > 0 ? totalAmenities / count : 0 },
      ]

      setReviewCategories(categories)
    } catch (err) {
      console.error("Error fetching review categories:", err)
    }
  }

  const checkBookingStatus = async (propertyId) => {
    if (!auth.currentUser) return

    try {
      const bookingsRef = collection(db, "Users", auth.currentUser.uid, "Bookings")
      const q = query(bookingsRef, where("propertyId", "==", propertyId), where("Status", "==", "Booked"))
      const bookingSnapshot = await getDocs(q)

      if (!bookingSnapshot.empty) {
        const booking = bookingSnapshot.docs[0].data()
        const checkOutDate = booking["Check-Out Date"]?.toDate()
        if (checkOutDate && new Date() > checkOutDate) {
          setCanSubmitReview(true)
        }
      }
    } catch (err) {
      console.error("Error checking booking status:", err)
    }
  }

  const fetchReviews = async (propertyId, propertyType) => {
    try {
      const reviewsSnapshot = await getDocs(collection(db, propertyType + "s", propertyId, "Reviews"))
      const reviewsData = reviewsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      setReviews(reviewsData)
    } catch (err) {
      console.error("Error fetching reviews:", err)
    }
  }

  // Fetch property details only when hotelId changes
  useEffect(() => {
    fetchPropertyDetails()
  }, [hotelId])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const locationParam = searchParams.get("location") || localStorage.getItem("location") || ""
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

    if (datePickerRef.current) {
      const fp = flatpickr(datePickerRef.current, {
        mode: "range",
        dateFormat: "Y-m-d",
        minDate: "today",
        maxDate: new Date().fp_incr(420),
        defaultDate: [checkInParam, checkOutParam],
        onChange: (selectedDates) => {
          if (selectedDates.length === 2) {
            const [checkin, checkout] = selectedDates.map((date) => date.toISOString().split("T")[0])
            setDates(`${checkin} - ${checkout}`)
            updateURL({ checkIn: checkin, checkOut: checkout })
          }
        },
      })

      return () => fp.destroy() // Cleanup flatpickr instance
    }
  }, [location.search])

  const handleGuestsClick = () => {
    setShowGuestsDropdown(!showGuestsDropdown)
  }

  const updateGuests = (a, c, r) => {
    setGuests(`${a} Adults, ${c} Children, ${r} Rooms`)
  }

  const incrementValue = (setter, value, maxValue, param) => {
    if (value < maxValue) {
      const newValue = value + 1
      setter(newValue)
      updateURL({ [param]: newValue })
      updatePrice(
        param === "rooms" ? newValue : rooms,
        param === "adults" ? newValue : adults,
        param === "children" ? newValue : children,
      )
    }
  }

  const decrementValue = (setter, value, minValue, param) => {
    if (value > minValue) {
      const newValue = value - 1
      setter(newValue)
      updateURL({ [param]: newValue })
      updatePrice(
        param === "rooms" ? newValue : rooms,
        param === "adults" ? newValue : adults,
        param === "children" ? newValue : children,
      )
    }
  }

  const updatePrice = (newRooms, newAdults, newChildren) => {
    if (property && property.roomDetails) {
      const newPrice = calculateTotalPrice(property.roomDetails, getTotalNights(), newAdults, newChildren, newRooms)
      setProperty((prev) => ({ ...prev, price: newPrice }))
    }
  }

  const handleDone = () => {
    setShowGuestsDropdown(false)
    updateGuests(adults, children, rooms)
    updateURL({ adults, children, rooms })
  }

  const updateURL = (params) => {
    const searchParams = new URLSearchParams(location.search)
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value)
    })
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true })
  }

  const handleLocationChange = (e) => {
    const newLocation = e.target.value
    setSearchLocation(newLocation)
    updateURL({ location: newLocation })
  }

  const toggleFavorite = async () => {
    if (!auth.currentUser) {
      toast.info("Please login to add favorites")
      return
    }

    if (!property) {
      console.error("Property data is not available")
      return
    }

    const userId = auth.currentUser.uid
    const favoriteRef = doc(db, "Users", userId, "Favorites", hotelId)

    try {
      if (isFavorite) {
        await deleteDoc(favoriteRef)
        toast.success("Removed from favorites")
      } else {
        await setDoc(favoriteRef, {
          propertyId: hotelId,
          "Property Address": property["Property Address"] || "",
          "Property Facility": property["Accommodation Facilities"] || [],
          "Property Image": property["Property Images"] || [],
          "Property Name": property["Property Name"] || "",
          "Property Price": property.price || 0,
          "Property Type": property.type || "Hotel",
          collectionName: property.type === "Hotel" ? "Hotels" : "Homestays",
          createdAt: new Date(),
        })
        toast.success("Added to favorites")
      }
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error("Error updating favorite status:", error)
      toast.error("Error updating favorites")
    }
  }

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (auth.currentUser) {
        const favoritesRef = doc(db, "Users", auth.currentUser.uid, "Favorites", hotelId)
        const docSnap = await getDoc(favoritesRef)
        setIsFavorite(docSnap.exists())
      }
    }

    fetchFavoriteStatus()
  }, [hotelId])

  useEffect(() => {
    if (property && property.roomDetails) {
      const newPrice = calculateTotalPrice(property.roomDetails, getTotalNights(), adults, children, rooms)
      if (newPrice !== property.price) {
        setProperty((prev) => ({ ...prev, price: newPrice }))
      }
    }
  }, [property, dates, adults, children, rooms])

  const handleReviewChange = (field, value) => {
    setNewReview((prev) => ({ ...prev, [field]: value }))
  }

  const submitReview = async () => {
    if (!auth.currentUser) {
      toast.error("You must be logged in to submit a review")
      return
    }

    try {
      const reviewData = {
        ...newReview,
        userId: auth.currentUser.uid,
        username: auth.currentUser.displayName || "Anonymous",
        userProfilePicture: auth.currentUser.photoURL || "",
        timestamp: new Date(),
        date: format(new Date(), "dd-MM-yyyy"),
        overallRating: (newReview.staffReview + newReview.luxury + newReview.amenities + newReview.price) / 4,
      }

      await addDoc(collection(db, property.type + "s", hotelId, "Reviews"), reviewData)

      toast.success("Review submitted successfully!")
      setNewReview({
        staffReview: 0,
        luxury: 0,
        amenities: 0,
        price: 0,
        comments: "",
      })
      fetchPropertyDetails()
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review. Please try again.")
    }
  }

  const editReview = async (reviewId, updatedReview) => {
    try {
      await updateDoc(doc(db, property.type + "s", hotelId, "Reviews", reviewId), updatedReview)
      toast.success("Review updated successfully!")
      fetchPropertyDetails()
    } catch (error) {
      console.error("Error updating review:", error)
      toast.error("Failed to update review. Please try again.")
    }
  }

  const deleteReview = async (reviewId) => {
    try {
      await deleteDoc(doc(db, property.type + "s", hotelId, "Reviews", reviewId))
      toast.success("Review deleted successfully!")
      fetchPropertyDetails()
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error("Failed to delete review. Please try again.")
    }
  }

  const getFacilityIcon = (facilityName) => {
    switch (facilityName.toLowerCase()) {
      case "facility for disabled guests":
        return FaWheelchair
      case "parking":
        return FaParking
      case "gym":
        return FaDumbbell
      case "spa":
        return FaSpa
      case "pool":
        return FaSwimmer
      case "wi-fi":
        return FaWifi
      case "restaurant":
        return FaUtensils
      case "cctv":
        return FaVideo
      case "laundry":
        return FaTshirt
      case "room service":
        return FaBell
      case "family room":
        return FaUsers
      case "bar":
        return FaGlassMartini
      case "air conditioning":
        return FaSnowflake
      case "lift":
      case "elevator":
        return FaBuilding
      case "non-smoking area":
      case "smoke free area":
        return FaSmokingBan
      default:
        return FaCheck
    }
  }

  const handleReserveNow = () => {
    const [checkIn, checkOut] = dates.split(" - ")
    const queryParams = new URLSearchParams({
      checkIn,
      checkOut,
      adults,
      children,
      rooms,
      price: property.price,
    }).toString()

    window.location.href = `/create-plan/${hotelId}?${queryParams}`
  }

  if (loading)
    return (
      <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
        <div className="text-center">
          <div className="mb-4">
            <FaHotel className="" style={{ fontSize: "4rem", animation: "pulse 1.5s infinite", color: "#038A5E" }} />
          </div>
          <h2 className="mb-3">Loading your perfect stay...</h2>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  if (error)
    return (
      <div className="container mt-5">
        <h2>Error: {error}</h2>
      </div>
    )
  if (!property)
    return (
      <div className="container mt-5">
        <h2>No property data available</h2>
      </div>
    )

  return (
    <div className="bg-light min-vh-100">
      <div className="container py-3">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="/" className="text-decoration-none text-primary">
                Home
              </a>
            </li>
            <li className="breadcrumb-item">
              <a href="/tamil-nadu" className="text-decoration-none text-primary">
                Tamil Nadu
              </a>
            </li>
            <li className="breadcrumb-item text-decoration-none text-primary">Tiruvannamalai</li>
            <li className="breadcrumb-item active" aria-current="page">
              {property["Property Name"]}
            </li>
          </ol>
        </nav>
      </div>

      <div className="container">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="d-flex justify-content-between align-items-start mb-4">
              <div>
                <div className="mb-2">
                  <span className="badge bg-warning text-dark">New to sonachala.com</span>
                </div>
                <h1 className="h3 mb-1">{property["Property Name"]}</h1>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="text-warning">{"★".repeat(Math.round(property.overallRating || 0))}</div>
                  <span className="badge bg-secondary">{property.type}</span>
                </div>
                <p className="text-muted">
                  <FaMapMarkerAlt className="me-1" />
                  {property["Property Address"]} –{" "}
                  <a href="#" style={{ color: "#038A5E" }} className="text-decoration-none">
                    Excellent location - show map
                  </a>
                </p>
              </div>
              <div className="d-flex gap-2">
                <button className="btn btn-outline-success" onClick={toggleFavorite}>
                  <FaHeart className={isFavorite ? "text-danger fill" : ""} />
                </button>
                <button className="btn btn-outline-success">
                  <FaShareAlt />
                </button>
              </div>
            </div>

            <div className="row g-2 mb-4">
              <div className="col-12 col-md-6">
                <img
                  src={property["Property Images"]?.[0] || "/placeholder.svg"}
                  alt=""
                  className="img-fluid rounded w-100 h-100 object-fit-cover"
                  style={{ height: "300px" }}
                />
              </div>
              <div className="col-12 col-md-6">
                <div className="row g-2">
                  {property["Property Images"]?.slice(1, 5).map((image, index) => (
                    <div key={index} className="col-6">
                      <img
                        src={image || "/placeholder.svg"}
                        alt=""
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
                <p className="mb-4">{property.About}</p>
                <hr className="my-4" />
                <h3 className="h5 mb-3">Most Popular Facilities</h3>
                <div className="d-flex flex-wrap gap-3">
                  {property["Accommodation Facilities"]?.map((facility, index) => {
                    const FacilityIcon = getFacilityIcon(facility.name)
                    return (
                      <div key={index} className="d-flex align-items-center gap-2">
                        <FacilityIcon style={{ color: "#038A5E" }} />
                        <span>{facility.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="card-body">
                <h3 className="h5 mb-3">Guest Reviews</h3>
                <div className="d-flex align-items-center mb-4">
                  <div style={{ width: 60, height: 60 }}>
                    <CircularProgressbar
                      value={property.overallRating * 20}
                      text={`${property.overallRating.toFixed(1)}`}
                      styles={buildStyles({
                        textSize: "32px",
                        pathColor: `rgba(0, 59, 148, ${property.overallRating / 5})`,
                        textColor: "#038A5E",
                        trailColor: "#d6d6d6",
                      })}
                    />
                  </div>
                  <div className="ms-3">
                    <div className="fw-bold">{property.ratingLabel || "No rating"}</div>
                    <div className="text-muted">{property.reviewCount || 0} reviews</div>
                  </div>
                </div>
                {reviewCategories.map((category, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{category.name}</span>
                      <span>{category.rating.toFixed(1)}</span>
                    </div>
                    <div className="progress" style={{ height: "8px" }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${(category.rating / 5) * 100}%`, backgroundColor: "#038A5E" }}
                        aria-valuenow={category.rating}
                        aria-valuemin="0"
                        aria-valuemax="5"
                      ></div>
                    </div>
                  </div>
                ))}
                {canSubmitReview && (
                  <div className="mt-4">
                    <h4>Submit Your Review</h4>
                    {["staffReview", "luxury", "amenities", "price"].map((field) => (
                      <div key={field} className="mb-3">
                        <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                        <div>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              className="me-1"
                              style={{ cursor: "pointer", color: star <= newReview[field] ? "#ffc107" : "#e4e5e9" }}
                              onClick={() => handleReviewChange(field, star)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="mb-3">
                      <label className="form-label">Comments</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={newReview.comments}
                        onChange={(e) => handleReviewChange("comments", e.target.value)}
                      ></textarea>
                    </div>
                    <button className="btn btn-success" onClick={submitReview}>
                      Submit Review
                    </button>
                  </div>
                )}
                <div className="mt-4">
                  <h4>Recent Reviews</h4>
                  {reviews.slice(0, showAllReviews ? undefined : 3).map((review, index) => (
                    <div key={index} className="card mb-3">
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="card-title">{review.username}</h5>
                            <p className="card-text">
                              <small className="text-muted">{review.date}</small>
                            </p>
                          </div>
                          <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className="me-1"
                                style={{ color: star <= review.overallRating ? "#ffc107" : "#e4e5e9" }}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="card-text">{review.comments}</p>
                        {auth.currentUser && auth.currentUser.uid === review.userId && (
                          <div>
                            <button
                              className="btn btn-sm btn-outline-primary me-2"
                              onClick={() => editReview(review.id, review)}
                            >
                              <FaEdit /> Edit
                            </button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => deleteReview(review.id)}>
                              <FaTrash /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {reviews.length > 3 && !showAllReviews && (
                    <button className="btn btn-link" onClick={() => setShowAllReviews(true)}>
                      Show All Reviews
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="card position-sticky mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center ">
                  <div>
                    <h3 className="h6 mb-1">Exceptional</h3>
                    <small className="text-muted">{property.reviewCount || 128} reviews</small>
                  </div>
                  <span className="badge  fs-5" style={{backgroundColor:"#038A5E"}} >
                    {property.overallRating ? Number.parseFloat(property.overallRating).toFixed(1) : "4.5"}
                  </span>
                </div>

                <hr className="my-4" />

                <h3 className="h5 mb-3">Property Highlights</h3>
                <ul className="list-unstyled">
                  {property["Nearby Iconic Places"]?.split("\n").map((place, index) => (
                    <li key={index} className="d-flex mb-2">
                      <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span>{place}</span>
                    </li>
                  ))}
                </ul>
                <ul className="list-unstyled mb-4">
                  {property["Transportation"]?.split("\n").map((place, index) => (
                    <li key={index} className="d-flex mb-2">
                      <FaCheck className="text-success mt-1 me-2 flex-shrink-0" />
                      <span>{place}</span>
                    </li>
                  ))}
                </ul>

                <hr className="my-4" />

                <div className="mb-4">
                  <h4 className="h6 mb-3">Room Type</h4>
                  <p className="mb-0">1 Room</p>
                </div>

                <div className="mb-4">
                  <h4 className="h6 mb-3">Check-in / Check-out</h4>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Select dates"
                    value={dates}
                    ref={datePickerRef}
                    readOnly
                  />
                </div>

                <div className="mb-4">
                  <h4 className="h6 mb-3">Guests</h4>
                  <div className="d-flex align-items-center mb-3">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => decrementValue(setAdults, adults, 1, "adults")}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control mx-2"
                      value={adults}
                      onChange={(e) => {
                        const newValue = Math.max(1, Math.min(30, Number.parseInt(e.target.value) || 1))
                        setAdults(newValue)
                        updateURL({ adults: newValue })
                        updatePrice(rooms, newValue, children)
                      }}
                      style={{ width: "60px", textAlign: "center" }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => incrementValue(setAdults, adults, 30, "adults")}
                    >
                      +
                    </button>
                    <span className="ms-2">Adults</span>
                  </div>

                  <div className="d-flex align-items-center mb-3">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => decrementValue(setChildren, children, 0, "children")}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control mx-2"
                      value={children}
                      onChange={(e) => {
                        const newValue = Math.max(0, Math.min(10, Number.parseInt(e.target.value) || 0))
                        setChildren(newValue)
                        updateURL({ children: newValue })
                        updatePrice(rooms, adults, newValue)
                      }}
                      style={{ width: "60px", textAlign: "center" }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => incrementValue(setChildren, children, 10, "children")}
                    >
                      +
                    </button>
                    <span className="ms-2">Children</span>
                  </div>

                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => decrementValue(setRooms, rooms, 1, "rooms")}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control mx-2"
                      value={rooms}
                      onChange={(e) => {
                        const newValue = Math.max(1, Math.min(30, Number.parseInt(e.target.value) || 1))
                        setRooms(newValue)
                        updateURL({ rooms: newValue })
                        updatePrice(newValue, adults, children)
                      }}
                      style={{ width: "60px", textAlign: "center" }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => incrementValue(setRooms, rooms, 30, "rooms")}
                    >
                      +
                    </button>
                    <span className="ms-2">Rooms</span>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="text-end mb-4">
                  <div className="h3 text-success mb-0">₹{property.price ? property.price.toFixed(2) : "1500"}</div>
                  <div className="text-muted small">
                    {adults} Adults, {children} Children, {rooms} Rooms
                  </div>
                </div>

                <button className="btn btn-success w-100 fw-bold" onClick={handleReserveNow}>
                  Select Your Rooms
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelDetails

