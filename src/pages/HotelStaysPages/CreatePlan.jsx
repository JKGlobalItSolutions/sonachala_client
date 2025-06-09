import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  FaWifi,
  FaUtensils,
  FaBed,
  FaInfoCircle,
  FaUsers,
  FaRupeeSign,
  FaWheelchair,
  FaParking,
  FaDumbbell,
  FaSpa,
  FaSwimmer,
  FaVideo,
  FaTshirt,
  FaBell,
  FaGlassMartini,
  FaSnowflake,
  FaBuilding,
  FaSmokingBan,
  FaCheck,
  FaArrowUp,
} from "react-icons/fa"
import styled from "styled-components"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Modal } from "react-bootstrap"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { db } from "../../firebase/config"
import { toast } from "react-toastify"

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Roboto', sans-serif;
`

const MainContent = styled.main`
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem;
`

const RoomInfo = styled.div`
  padding: 1rem;
`

const RoomTitle = styled.h2`
  font-size: 1.5rem;
  color: #038A5E;
  margin-bottom: 0.5rem;
  font-weight: bold;
`

const RoomFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #555;
    background-color: #f8f9fa;
    padding: 0.25rem 0.5rem;
    border-radius: 20px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #e9ecef;
    }

    svg {
      color: #038A5E;
    }
  }
`

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
  padding: 0.5rem;
  border-radius: 8px;
`

const Counter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CounterButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#f0f0f0" : props.increment ? "#038A5E" : "#e9ecef")};
  color: ${(props) => (props.disabled ? "#999" : "white")};
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 1rem;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#f0f0f0" : props.increment ? "#038A5E" : "#ced4da")};
  }
`

const CounterValue = styled.span`
  font-size: 1rem;
  font-weight: bold;
  min-width: 20px;
  text-align: center;
`

const PriceDetails = styled.div`
  margin-top: 1rem;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
`

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  &.total {
    font-weight: bold;
    font-size: 1rem;
    margin-top: 0.5rem;
    padding-top: 0.5rem;
    border-top: 1px solid #dee2e6;
  }
`

const CreatePlanButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${(props) => (props.disabled ? "#ccc" : "#038A5E")};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.3s ease;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background-color: ${(props) => (props.disabled ? "#ccc" : "#038A5E")};
    transform: ${(props) => (props.disabled ? "none" : "translateY(-2px)")};
    box-shadow: ${(props) => (props.disabled ? "none" : "0 4px 8px rgba(0, 59, 148, 0.2)")};
  }
`

const CreatedRoomsSection = styled.div`
  margin-top: 1rem;
  @media (max-width: 991px) {
    display: none;
  }
`

const CreatedRoomCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`

const DeleteButton = styled.button`
  background-color: #038A5E;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.875rem;

  &:hover {
    background-color: #038A5E;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 59, 148, 0.2);
  }
`

const ReserveButton = styled(CreatePlanButton)`
  margin-top: 1rem;
  background-color: #038A5E;
    &:hover {
    background-color: #038A5E;
 
  }
`

const RoomInfoButton = styled.button`
  background: none;
  border: none;
  color: #038A5E;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: translateX(3px);
  }
`

const NoRoomsMessage = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  font-size: 1rem;
  color: #666;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`

const MobileCreatedRoomsPopup = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-out;
  transform: ${(props) => (props.isOpen ? "translateY(0)" : "translateY(calc(100% - 40px))")};
  z-index: 1000;

  @media (min-width: 992px) {
    display: none;
  }
`

const MobileCreatedRoomsContent = styled.div`
  padding: 1rem;
`

const ScrollArea = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 200px);
`

const ToggleButton = styled.button`
  width: 100%;
  height: 40px;
  background-color: #038A5E;
  color: white;
  border: none;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`

const InfoItem = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`

const InfoIcon = styled.div`
  color: #038A5E;
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6f0ff;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(15deg);
  }
`

const InfoContent = styled.div`
  flex: 1;
`

const InfoLabel = styled.div`
  color: #666;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
`

const InfoValue = styled.div`
  color: #333;
  font-size: 1rem;
  font-weight: 600;
`

const FacilitiesSection = styled.div`
  margin-top: 1rem;
`

const FacilitiesTitle = styled.h3`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
  font-weight: bold;
`

const FacilitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.5rem;
`

const FacilityItem = styled.div`
  background: #f8f9fa;
  padding: 0.5rem;
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`

const FacilityIcon = styled.div`
  color: #038A5E;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`

const FacilityName = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  color: #333;
`

const CancelButton = styled.button`
  background-color: #e9ecef;
  color: #333;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.875rem;

  &:hover {
    background-color: #dee2e6;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`

const ConfirmButton = styled.button`
  background-color: #038A5E;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: bold;
  font-size: 0.875rem;

  &:hover {
    background-color: #002d70;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(0, 59, 148, 0.2);
  }
`

const RoomCardWrapper = styled.div`
  margin-bottom: 1rem;
`

const BackToTopButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: #038A5E;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: ${(props) => (props.visible ? "1" : "0")};
  visibility: ${(props) => (props.visible ? "visible" : "hidden")};

  &:hover {
    background-color: #002d70;
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 59, 148, 0.2);
  }
`

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

const calculateRoomPrice = (room, adults, children, nights) => {
  if (!room || typeof adults !== "number" || typeof children !== "number" || !nights) {
    return { originalPrice: 0, discountedPrice: 0 }
  }

  const basePrice = Number.parseFloat(room.roomPrice) || 0
  const adultPrice = (Number.parseFloat(room.perAdultPrice) || 0) * adults
  const childPrice = (Number.parseFloat(room.perChildPrice) || 0) * children

  const totalPricePerNight = basePrice + adultPrice + childPrice
  const totalPrice = totalPricePerNight * nights

  const discount = (Number.parseFloat(room.discount) || 0) / 100
  const discountAmount = totalPrice * discount
  const discountedPrice = totalPrice - discountAmount

  return {
    originalPrice: Number.parseFloat(totalPrice.toFixed(2)),
    discountedPrice: Number.parseFloat(discountedPrice.toFixed(2)),
  }
}

const CreatePlan = () => {
  const { hotelId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [rooms, setRooms] = useState([])
  const [createdRooms, setCreatedRooms] = useState(() => {
    const savedRooms = localStorage.getItem("createdRooms")
    return savedRooms ? JSON.parse(savedRooms) : []
  })
  const [adults, setAdults] = useState({})
  const [children, setChildren] = useState({})
  const [showRoomInfo, setShowRoomInfo] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)
  const [showMobileCreatedRooms, setShowMobileCreatedRooms] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [availableRooms, setAvailableRooms] = useState({})
  const [showBackToTop, setShowBackToTop] = useState(false)

  const pageTopRef = useRef(null)
  const createdRoomsRef = useRef(createdRooms)

  const getTotalNights = useCallback(() => {
    const searchParams = new URLSearchParams(location.search)
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }, [location.search])

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)

      const hotelRef = doc(db, "Hotels", hotelId)
      const hotelDoc = await getDoc(hotelRef)

      if (!hotelDoc.exists()) {
        setError("Hotel not found")
        setLoading(false)
        return
      }

      const roomsCollection = collection(hotelRef, "Rooms")
      const roomsSnapshot = await getDocs(roomsCollection)
      const roomsData = roomsSnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          bedType: data.bedType || "Not specified",
          maxGuestAllowed: Number.parseInt(data.maxguestAllowed) || 2,
          totalRooms: Number.parseInt(data.totalRooms) || 0,
        }
      })

      setRooms(roomsData)

      // Calculate available rooms
      const availableRoomsCount = {}
      const bookingsCollection = collection(hotelRef, "Guest Details")
      const bookingsSnapshot = await getDocs(bookingsCollection)

      const searchParams = new URLSearchParams(location.search)
      const checkInDate = new Date(searchParams.get("checkIn"))
      const checkOutDate = new Date(searchParams.get("checkOut"))

      roomsData.forEach((room) => {
        let bookedCount = 0
        bookingsSnapshot.docs.forEach((bookingDoc) => {
          const bookingData = bookingDoc.data()
          const bookingCheckIn = bookingData["Check-In Date"].toDate()
          const bookingCheckOut = bookingData["Check-Out Date"].toDate()

          if (!(checkOutDate <= bookingCheckIn || checkInDate >= bookingCheckOut)) {
            const bookedRooms = bookingData.Rooms || []
            const bookedRoom = bookedRooms.find((r) => r.roomType === room.roomType)
            if (bookedRoom) {
              bookedCount += bookedRoom.roomsCount || 0
            }
          }
        })

        availableRoomsCount[room.id] = room.totalRooms - bookedCount
      })

      setAvailableRooms(availableRoomsCount)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching rooms:", err)
      setError("Error fetching rooms. Please try again later.")
      setLoading(false)
    }
  }, [hotelId, location.search])

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const adultsParam = Number.parseInt(searchParams.get("adults") || localStorage.getItem("adults") || "1")
    const childrenParam = Number.parseInt(searchParams.get("children") || localStorage.getItem("children") || "0")

    setAdults({ 1: adultsParam })
    setChildren({ 1: childrenParam })
    fetchRooms()
  }, [location.search, fetchRooms])

  useEffect(() => {
    if (createdRooms.length > 0 && window.innerWidth < 992) {
      setShowMobileCreatedRooms(true)
    }
  }, [createdRooms])

  useEffect(() => {
    localStorage.setItem("createdRooms", JSON.stringify(createdRooms))
    createdRoomsRef.current = createdRooms
  }, [createdRooms])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.pageYOffset > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const incrementValue = (setter, value, roomId, isAdult) => {
    const room = rooms.find((r) => r.id === roomId)
    if (!room) return

    const maxGuestAllowed = room.maxGuestAllowed
    const currentAdults = adults[roomId] || 1
    const currentChildren = children[roomId] || 0
    const totalGuests = currentAdults + currentChildren

    if (isAdult) {
      if (totalGuests < maxGuestAllowed) {
        setter((prev) => ({
          ...prev,
          [roomId]: Math.min(value + 1, maxGuestAllowed - currentChildren),
        }))
      }
    } else {
      if (totalGuests < maxGuestAllowed && currentChildren < currentAdults - 1) {
        setter((prev) => ({
          ...prev,
          [roomId]: value + 1,
        }))
      }
    }
  }

  const decrementValue = (setter, value, roomId, isAdult) => {
    const currentAdults = adults[roomId] || 1
    const currentChildren = children[roomId] || 0

    if (isAdult) {
      if (currentAdults > 1 && currentAdults > currentChildren + 1) {
        setter((prev) => ({
          ...prev,
          [roomId]: value - 1,
        }))
      }
    } else {
      if (currentChildren > 0) {
        setter((prev) => ({
          ...prev,
          [roomId]: value - 1,
        }))
      }
    }
  }

  const updateURL = (params) => {
    const searchParams = new URLSearchParams(location.search)
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value)
    })
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true })
  }

  const handleCreatePlan = useCallback(
    (room) => {
      if (availableRooms[room.id] > 0) {
        const nights = getTotalNights()
        const { discountedPrice } = calculateRoomPrice(room, adults[room.id] || 1, children[room.id] || 0, nights)

        const newRoom = {
          ...room,
          reservationId: Date.now(),
          guestCount: (adults[room.id] || 1) + (children[room.id] || 0),
          childCount: children[room.id] || 0,
          totalPrice: discountedPrice,
          adults: adults[room.id] || 1,
          children: children[room.id] || 0,
          nights,
        }

        setCreatedRooms((prev) => {
          const updatedRooms = [...prev, newRoom]
          return updatedRooms
        })

        // Update available rooms count
        setAvailableRooms((prev) => ({
          ...prev,
          [room.id]: prev[room.id] - 1,
        }))

        // Scroll to top after creating the plan
        setTimeout(() => {
          scrollToTop()
        }, 100)
      }
    },
    [adults, children, getTotalNights, availableRooms],
  )

  const calculateTotalPriceForAllRooms = useCallback(() => {
    return Number.parseFloat(
      createdRoomsRef.current
        .reduce((total, room) => {
          return total + (room.totalPrice || 0)
        }, 0)
        .toFixed(2),
    )
  }, [])

  const calculateOriginalTotalPrice = useCallback(() => {
    return Number.parseFloat(
      createdRoomsRef.current
        .reduce((total, room) => {
          const { originalPrice } = calculateRoomPrice(room, room.adults, room.children, room.nights)
          return total + originalPrice
        }, 0)
        .toFixed(2),
    )
  }, [])

  const calculateTotalDiscount = useCallback(() => {
    const originalTotal = calculateOriginalTotalPrice()
    const discountedTotal = calculateTotalPriceForAllRooms()
    return Number.parseFloat((originalTotal - discountedTotal).toFixed(2))
  }, [calculateOriginalTotalPrice, calculateTotalPriceForAllRooms])

  const handleShowRoomInfo = (room) => {
    setSelectedRoom(room)
    setShowRoomInfo(true)
  }

  const handleDeleteRoom = (reservationId) => {
    setRoomToDelete(reservationId)
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteRoom = useCallback(() => {
    const roomToDeleteData = createdRoomsRef.current.find((room) => room.reservationId === roomToDelete)
    setCreatedRooms((prev) => {
      const updatedRooms = prev.filter((room) => room.reservationId !== roomToDelete)
      return updatedRooms
    })
    // Update available rooms count
    if (roomToDeleteData) {
      setAvailableRooms((prev) => ({
        ...prev,
        [roomToDeleteData.id]: prev[roomToDeleteData.id] + 1,
      }))
    }
    setShowDeleteConfirmation(false)
    setRoomToDelete(null)
  }, [roomToDelete])

  const cancelDeleteRoom = () => {
    setShowDeleteConfirmation(false)
    setRoomToDelete(null)
  }

  const handleReserve = useCallback(() => {
    if (createdRoomsRef.current.length === 0) {
      toast.error("Please select at least one room before reserving.")
      return
    }

    const searchParams = new URLSearchParams(location.search)
    const checkInDate = searchParams.get("checkIn")
    const checkOutDate = searchParams.get("checkOut")

    // Scroll to top before navigating
    scrollToTop()

    navigate(`/reservation/${hotelId}`, {
      state: {
        roomDetails: createdRoomsRef.current,
        totalPrice: calculateTotalPriceForAllRooms(),
        checkInDate,
        checkOutDate,
      },
    })
  }, [hotelId, location.search, navigate, calculateTotalPriceForAllRooms])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <PageContainer>
      <MainContent ref={pageTopRef}>
        <Container fluid>
          <Row>
            <Col lg={6}>
              {rooms.map((room) => (
                <RoomCardWrapper key={room.id}>
                  <RoomCard
                    room={room}
                    adults={adults[room.id] || 1}
                    children={children[room.id] || 0}
                    maxGuestAllowed={room.maxGuestAllowed}
                    onIncrementAdults={() => incrementValue(setAdults, adults[room.id] || 1, room.id, true)}
                    onDecrementAdults={() => decrementValue(setAdults, adults[room.id] || 1, room.id, true)}
                    onIncrementChildren={() => incrementValue(setChildren, children[room.id] || 0, room.id, false)}
                    onDecrementChildren={() => decrementValue(setChildren, children[room.id] || 0, room.id, false)}
                    onCreatePlan={() => handleCreatePlan(room)}
                    onShowInfo={() => handleShowRoomInfo(room)}
                    totalNights={getTotalNights()}
                    availableRooms={availableRooms[room.id] || 0}
                  />
                </RoomCardWrapper>
              ))}
            </Col>
            <Col lg={6}>
              <CreatedRoomsSection>
                {createdRooms.length > 0 ? (
                  <>
                    <h2>Rooms Created</h2>
                    {createdRooms.map((room) => (
                      <CreatedRoomCard key={room.reservationId}>
                        <div>
                          <h3>{room.roomType}</h3>
                          <p>
                            Adults: {room.adults}, Children: {room.children}
                          </p>
                          <p>Total Price: ₹{room.totalPrice.toFixed(2)}</p>
                        </div>
                        <DeleteButton onClick={() => handleDeleteRoom(room.reservationId)}>Delete</DeleteButton>
                      </CreatedRoomCard>
                    ))}

                    <PriceDetails>
                      <PriceRow>
                        <span>Original Total Price:</span>
                        <span>₹{calculateOriginalTotalPrice().toFixed(2)}</span>
                      </PriceRow>
                      <PriceRow>
                        <span>Total Discount:</span>
                        <span>₹{calculateTotalDiscount().toFixed(2)}</span>
                      </PriceRow>
                      <PriceRow className="total">
                        <span>Total Price:</span>
                        <span>₹{calculateTotalPriceForAllRooms().toFixed(2)}</span>
                      </PriceRow>
                    </PriceDetails>

                    <ReserveButton onClick={handleReserve}>Reserve</ReserveButton>
                  </>
                ) : (
                  <NoRoomsMessage>No rooms created yet. Please create a plan to add rooms.</NoRoomsMessage>
                )}
              </CreatedRoomsSection>
            </Col>
          </Row>
        </Container>
      </MainContent>

      <RoomInfoModal show={showRoomInfo} onClose={() => setShowRoomInfo(false)} room={selectedRoom} />
      <DeleteConfirmationModal
        show={showDeleteConfirmation}
        onConfirm={confirmDeleteRoom}
        onCancel={cancelDeleteRoom}
      />
      {createdRooms.length > 0 && (
        <MobileCreatedRoomsPopup isOpen={showMobileCreatedRooms}>
          <ToggleButton onClick={() => setShowMobileCreatedRooms(!showMobileCreatedRooms)}>
            {showMobileCreatedRooms ? "Close" : "Open"}
          </ToggleButton>
          <MobileCreatedRoomsContent>
            <ScrollArea>
              <h2>Rooms Created</h2>
              {createdRooms.map((room) => (
                <CreatedRoomCard key={room.reservationId}>
                  <div>
                    <h3>{room.roomType}</h3>
                    <p>
                      Adults: {room.adults}, Children: {room.children}
                    </p>
                    <p>Total Price: ₹{room.totalPrice.toFixed(2)}</p>
                  </div>
                  <DeleteButton onClick={() => handleDeleteRoom(room.reservationId)}>Delete</DeleteButton>
                </CreatedRoomCard>
              ))}

              <PriceDetails>
                <PriceRow>
                  <span>Original Total Price:</span>
                  <span>₹{calculateOriginalTotalPrice().toFixed(2)}</span>
                </PriceRow>
                <PriceRow>
                  <span>Total Discount:</span>
                  <span>₹{calculateTotalDiscount().toFixed(2)}</span>
                </PriceRow>
                <PriceRow className="total">
                  <span>Total Price:</span>
                  <span>₹{calculateTotalPriceForAllRooms().toFixed(2)}</span>
                </PriceRow>
              </PriceDetails>

              <ReserveButton  onClick={handleReserve}>Reserve</ReserveButton>
            </ScrollArea>
          </MobileCreatedRoomsContent>
        </MobileCreatedRoomsPopup>
      )}
      <BackToTopButton visible={showBackToTop} onClick={scrollToTop}>
        <FaArrowUp />
      </BackToTopButton>
    </PageContainer>
  )
}

const RoomCard = ({
  room,
  adults,
  children,
  maxGuestAllowed,
  onIncrementAdults,
  onDecrementAdults,
  onIncrementChildren,
  onDecrementChildren,
  onCreatePlan,
  onShowInfo,
  totalNights,
  availableRooms,
}) => {
  const { originalPrice, discountedPrice } = calculateRoomPrice(room, adults, children, totalNights)

  return (
    <Card>
      <RoomInfo>
        <RoomTitle>{room.roomType}</RoomTitle>
        <RoomInfoButton onClick={onShowInfo}>
          <FaInfoCircle />
          Room Information
        </RoomInfoButton>
        <RoomFeatures>
          <span>
            <FaBed /> {room.bedType}
          </span>
          <span>
            <FaUsers /> Max Guests: {maxGuestAllowed}
          </span>
          {room.facilities?.slice(0, 3).map((facility, index) => {
            const FacilityIcon = getFacilityIcon(facility.name)
            return (
              <span key={index}>
                <FacilityIcon /> {facility.name}
              </span>
            )
          })}
        </RoomFeatures>

        <InputGroup>
          <span>Adults:</span>
          <Counter>
            <CounterButton onClick={onDecrementAdults} disabled={adults <= 1}>
              -
            </CounterButton>
            <CounterValue>{adults}</CounterValue>
            <CounterButton onClick={onIncrementAdults} increment disabled={adults + children >= maxGuestAllowed}>
              +
            </CounterButton>
          </Counter>
        </InputGroup>

        <InputGroup>
          <span>Children:</span>
          <Counter>
            <CounterButton onClick={onDecrementChildren} disabled={children <= 0}>
              -
            </CounterButton>
            <CounterValue>{children}</CounterValue>
            <CounterButton
              onClick={onIncrementChildren}
              increment
              disabled={adults + children >= maxGuestAllowed || adults === 1}
            >
              +
            </CounterButton>
          </Counter>
        </InputGroup>

        <PriceDetails>
          <PriceRow>
            <span>Base Price per Night:</span>
            <span>₹{Number.parseFloat(room.roomPrice || 0).toFixed(2)}</span>
          </PriceRow>
          <PriceRow>
            <span>Adult Price ({adults} adults):</span>
            <span>₹{(Number.parseFloat(room.perAdultPrice || 0) * adults).toFixed(2)}</span>
          </PriceRow>
          {children > 0 && (
            <PriceRow>
              <span>Child Price ({children} children):</span>
              <span>₹{(Number.parseFloat(room.perChildPrice || 0) * children).toFixed(2)}</span>
            </PriceRow>
          )}
          <PriceRow>
            <span>Number of Nights:</span>
            <span>{totalNights}</span>
          </PriceRow>
          <PriceRow className="total">
            <span>Total Price:</span>
            <span>
              <s>₹{originalPrice.toFixed(2)}</s>{" "}
              <strong style={{ color: "#038A5E" }}>₹{discountedPrice.toFixed(2)}</strong>
            </span>
          </PriceRow>
          {room.discount > 0 && (
            <PriceRow>
              <span>Savings ({room.discount}% off):</span>
              <span>₹{(originalPrice - discountedPrice).toFixed(2)}</span>
            </PriceRow>
          )}
        </PriceDetails>

        <CreatePlanButton onClick={() => onCreatePlan(room)} disabled={availableRooms <= 0}>
          {availableRooms > 0 ? "Create Plan" : "Unavailable"}
        </CreatePlanButton>
      </RoomInfo>
    </Card>
  )
}

const RoomInfoModal = ({ show, onClose, room }) => {
  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{room?.roomType || "Room Information"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InfoGrid>
          <InfoItem>
            <InfoIcon>
              <FaBed />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Bed Type</InfoLabel>
              <InfoValue>{room?.bedType}</InfoValue>
            </InfoContent>
          </InfoItem>
          <InfoItem>
            <InfoIcon>
              <FaUsers />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Max Guests</InfoLabel>
              <InfoValue>{room?.maxGuestAllowed}</InfoValue>
            </InfoContent>
          </InfoItem>
          <InfoItem>
            <InfoIcon>
              <FaRupeeSign />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Price per Night</InfoLabel>
              <InfoValue>₹{room?.roomPrice}</InfoValue>
            </InfoContent>
          </InfoItem>
          <InfoItem>
            <InfoIcon>
              <FaInfoCircle />
            </InfoIcon>
            <InfoContent>
              <InfoLabel>Description</InfoLabel>
              <InfoValue>{room?.description}</InfoValue>
            </InfoContent>
          </InfoItem>
        </InfoGrid>
        <FacilitiesSection>
          <FacilitiesTitle>Facilities</FacilitiesTitle>
          <FacilitiesGrid>
            {room?.facilities?.map((facility) => (
              <FacilityItem key={facility.name}>
                <FacilityIcon>{getFacilityIcon(facility.name)()}</FacilityIcon>
                <FacilityName>{facility.name}</FacilityName>
              </FacilityItem>
            ))}
          </FacilitiesGrid>
        </FacilitiesSection>
      </Modal.Body>
    </Modal>
  )
}

const DeleteConfirmationModal = ({ show, onConfirm, onCancel }) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>Delete Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this room?</Modal.Body>
      <Modal.Footer>
        <CancelButton onClick={onCancel}>Cancel</CancelButton>
        <ConfirmButton onClick={onConfirm}>Confirm</ConfirmButton>
      </Modal.Footer>
    </Modal>
  )
}

export default CreatePlan

