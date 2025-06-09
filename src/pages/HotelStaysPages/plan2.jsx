import React, { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import {
  FaWifi,
  FaUtensils,
  FaBed,
  FaSwimmingPool,
  FaCocktail,
  FaInfoCircle,
  FaTimes,
  FaUsers,
  FaRupeeSign,
  FaRulerCombined,
  FaBars,
  FaHotel,
  FaSterlingSign,
  FaUserFriends,
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
} from "react-icons/fa"
import styled from "styled-components"
import "bootstrap/dist/css/bootstrap.min.css"
import { Container, Row, Col, Card, Modal } from "react-bootstrap"
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"
import { auth, db } from "../../firebase/config"
import { toast } from "react-toastify"

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Roboto', sans-serif;
`

const Header = styled.header`
  background-color: #003B94;
  padding: 1rem 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`

const BackButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.8;
  }
`

const MainContent = styled.main`
  max-width: 1100px;
  margin: 1.5rem auto;
  padding: 0 1rem;
`

const RoomInfo = styled.div`
  padding: 1rem 1.25rem;
`

const RoomTitle = styled.h2`
  font-size: 1.5rem;
  color: #003B94;
  margin-bottom: 0.75rem;
  font-weight: bold;
`

const RoomFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;

  span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #555;
    background-color: #f8f9fa;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #e9ecef;
    }

    svg {
      color: #003B94;
    }
  }
`

const InputGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  background-color: #f8f9fa;
  padding: 0.75rem;
  border-radius: 6px;
`

const Counter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const CounterButton = styled.button`
  background-color: ${(props) => (props.disabled ? "#f0f0f0" : props.increment ? "#003B94" : "#e9ecef")};
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
    background-color: ${(props) => (props.disabled ? "#f0f0f0" : props.increment ? "#002d70" : "#ced4da")};
  }
`

const CounterValue = styled.span`
  font-size: 1rem;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
`

const PriceDetails = styled.div`
  margin-top: 1rem;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
`

const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;

  &.total {
    font-weight: bold;
    font-size: 1rem;
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid #dee2e6;
  }
`

const CreatePlanButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #003B94;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;

  &:hover {
    background-color: #002d70;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 59, 148, 0.2);
  }
`

const CreatedRoomsSection = styled.div`
  margin-top: 2rem;
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
  background-color: #003B94;
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

const ReserveButton = styled(CreatePlanButton)`
  margin-top: 1.5rem;
`

const RoomInfoButton = styled.button`
  background: none;
  border: none;
  color: #003B94;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
    transform: translateX(3px);
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  transition: all 0.3s ease;

  &:hover {
    color: #333;
    transform: rotate(90deg);
  }
`

const ModalTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
  font-weight: bold;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
`

const InfoItem = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`

const InfoIcon = styled.div`
  color: #003B94;
  font-size: 2rem;
  width: 50px;
  height: 50px;
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
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`

const InfoValue = styled.div`
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
`

const FacilitiesSection = styled.div`
  margin-top: 2rem;
`

const FacilitiesTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
  font-weight: bold;
`

const FacilitiesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`

const FacilityItem = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 10px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  svg {
    color: #003B94;
    font-size: 2rem;
    margin-bottom: 0.75rem;
    transition: all 0.3s ease;
  }

  &:hover svg {
    transform: scale(1.1);
  }
`

const FacilityName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #333;
`

const FacilityIcon = styled.div`
  color: #003B94;
  font-size: 2rem;
  margin-bottom: 0.75rem;
`

const ConfirmationModal = styled(ModalOverlay)``

const ConfirmationContent = styled(ModalContent)`
  max-width: 400px;
`

const ConfirmationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1.5rem;
`

const ConfirmButton = styled.button`
  background-color: #003B94;
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

const NoRoomsMessage = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
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

const DragHandle = styled.div`
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
`

const ScrollArea = styled.div`
  overflow-y: auto;
  max-height: calc(100vh - 200px);
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
  const [createdRooms, setCreatedRooms] = useState([])
  const [adults, setAdults] = useState(1)
  const [children, setChildren] = useState(0)
  const [showRoomInfo, setShowRoomInfo] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [roomToDelete, setRoomToDelete] = useState(null)
  const [showMobileCreatedRooms, setShowMobileCreatedRooms] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const dragStartY = useRef(0)

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true)

      // Check both Homestays and Hotels collections
      const collections = ["Homestays", "Hotels"]
      let propertyDoc
      let collectionName

      for (const collection of collections) {
        const docRef = doc(db, collection, hotelId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          propertyDoc = docSnap
          collectionName = collection
          break
        }
      }

      if (!propertyDoc) {
        setError("Property not found")
        setLoading(false)
        return
      }

      const roomsCollection = collection(db, collectionName, hotelId, "Rooms")
      const roomsSnapshot = await getDocs(roomsCollection)
      const roomsData = roomsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))

      // Fetch bookings to calculate available rooms
      const bookingsCollection = collection(db, collectionName, hotelId, "Guest Details")
      const bookingsSnapshot = await getDocs(bookingsCollection)

      const bookedRoomCounts = {}
      const searchParams = new URLSearchParams(location.search)
      const checkInDate = new Date(searchParams.get("checkIn"))
      const checkOutDate = new Date(searchParams.get("checkOut"))

      bookingsSnapshot.forEach((doc) => {
        const bookingData = doc.data()
        const bookingCheckIn = bookingData["Check-In Date"].toDate()
        const bookingCheckOut = bookingData["Check-Out Date"].toDate()

        if (!(checkOutDate <= bookingCheckIn || checkInDate >= bookingCheckOut)) {
          ;(bookingData.Rooms || []).forEach((room) => {
            bookedRoomCounts[room.roomType] = (bookedRoomCounts[room.roomType] || 0) + (room.roomsCount || 1)
          })
        }
      })

      const availableRooms = roomsData
        .map((room) => ({
          ...room,
          availableCount: room.totalRooms - (bookedRoomCounts[room.roomType] || 0),
        }))
        .filter((room) => room.availableCount > 0)

      setRooms(availableRooms)
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

    setAdults(adultsParam)
    setChildren(childrenParam)
    fetchRooms()
  }, [location.search, fetchRooms])

  const incrementValue = (setter, value) => {
    const newValue = value + 1
    setter(newValue)
    localStorage.setItem(setter === setAdults ? "adults" : "children", newValue.toString())
  }

  const decrementValue = (setter, value, minValue) => {
    if (value > minValue) {
      const newValue = value - 1
      setter(newValue)
      localStorage.setItem(setter === setAdults ? "adults" : "children", newValue.toString())
    }
  }

  const updateURL = (params) => {
    const searchParams = new URLSearchParams(location.search)
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value)
    })
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true })
  }

  const handleCreatePlan = (room) => {
    const nights = getTotalNights()
    const { discountedPrice } = calculateRoomPrice(room, adults, children, nights)

    const newRoom = {
      ...room,
      guestCount: adults + children,
      childCount: children,
      totalPrice: discountedPrice,
      adults,
      children,
      nights,
    }

    setCreatedRooms((prev) => [...prev, newRoom])
    if (window.innerWidth < 992) {
      setShowMobileCreatedRooms(true)
    }
  }

  const calculateTotalPriceForAllRooms = () => {
    return Number.parseFloat(
      createdRooms
        .reduce((total, room) => {
          return total + (room.totalPrice || 0)
        }, 0)
        .toFixed(2),
    )
  }

  const calculateOriginalTotalPrice = () => {
    return Number.parseFloat(
      createdRooms
        .reduce((total, room) => {
          const { originalPrice } = calculateRoomPrice(room, room.adults, room.children, room.nights)
          return total + originalPrice
        }, 0)
        .toFixed(2),
    )
  }

  const calculateTotalDiscount = () => {
    const originalTotal = calculateOriginalTotalPrice()
    const discountedTotal = calculateTotalPriceForAllRooms()
    return Number.parseFloat((originalTotal - discountedTotal).toFixed(2))
  }

  const handleShowRoomInfo = (room) => {
    setSelectedRoom(room)
    setShowRoomInfo(true)
  }

  const handleDragStart = (e) => {
    setIsDragging(true)
    dragStartY.current = e.clientY || e.touches[0].clientY
  }

  const handleDragMove = (e) => {
    if (!isDragging) return
    const currentY = e.clientY || e.touches[0].clientY
    const deltaY = currentY - dragStartY.current
    if (deltaY < -50) {
      setShowMobileCreatedRooms(true)
    } else if (deltaY > 50) {
      setShowMobileCreatedRooms(false)
    }
  }

  const handleDragEnd = () => {
    setIsDragging(false)
  }

  const getTotalNights = () => {
    const searchParams = new URLSearchParams(location.search)
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    if (!checkIn || !checkOut) return 1
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24))
  }

  const handleDeleteRoom = (roomId) => {
    setRoomToDelete(roomId)
    setShowDeleteConfirmation(true)
  }

  const confirmDeleteRoom = () => {
    setCreatedRooms((prev) => prev.filter((room) => room.id !== roomToDelete))
    setShowDeleteConfirmation(false)
    setRoomToDelete(null)
  }

  const cancelDeleteRoom = () => {
    setShowDeleteConfirmation(false)
    setRoomToDelete(null)
  }

  const handleReserve = () => {
    if (createdRooms.length === 0) {
      toast.error("Please select at least one room before reserving.")
      return
    }

    const searchParams = new URLSearchParams(location.search)
    const checkInDate = searchParams.get("checkIn")
    const checkOutDate = searchParams.get("checkOut")

    navigate(`/reservation/${hotelId}`, {
      state: {
        roomDetails: createdRooms,
        totalPrice: calculateTotalPriceForAllRooms(),
        checkInDate,
        checkOutDate,
        adults,
        children,
      },
    })
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <PageContainer>
      <MainContent>
        <Container fluid>
          <Row>
            <Col lg={6}>
              {rooms.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  adults={adults}
                  children={children}
                  onIncrementAdults={() => incrementValue(setAdults, adults)}
                  onDecrementAdults={() => decrementValue(setAdults, adults, 1)}
                  onIncrementChildren={() => incrementValue(setChildren, children)}
                  onDecrementChildren={() => decrementValue(setChildren, children, 0)}
                  onCreatePlan={() => handleCreatePlan(room)}
                  onShowInfo={() => handleShowRoomInfo(room)}
                  totalNights={getTotalNights()}
                />
              ))}
            </Col>
            <Col lg={6}>
              <CreatedRoomsSection>
                {createdRooms.length > 0 ? (
                  <>
                    <h2>Rooms Created</h2>
                    {createdRooms.map((room, index) => (
                      <CreatedRoomCard key={index}>
                        <div>
                          <h3>{room.roomType}</h3>
                          <p>
                            Adults: {room.adults}, Children: {room.children}
                          </p>
                          <p>Total Price: ₹{room.totalPrice.toFixed(2)}</p>
                        </div>
                        <DeleteButton onClick={() => handleDeleteRoom(room.id)}>Delete</DeleteButton>
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
          <DragHandle
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            onMouseMove={handleDragMove}
            onTouchMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onTouchEnd={handleDragEnd}
          >
            <FaBars />
          </DragHandle>
          <MobileCreatedRoomsContent>
            <ScrollArea>
              <h2>Rooms Created</h2>
              {createdRooms.map((room, index) => (
                <CreatedRoomCard key={index}>
                  <div>
                    <h3>{room.roomType}</h3>
                    <p>
                      Adults: {room.adults}, Children: {room.children}
                    </p>
                    <p>Total Price: ₹{room.totalPrice.toFixed(2)}</p>
                  </div>
                  <DeleteButton onClick={() => handleDeleteRoom(room.id)}>Delete</DeleteButton>
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
            </ScrollArea>
          </MobileCreatedRoomsContent>
        </MobileCreatedRoomsPopup>
      )}
    </PageContainer>
  )
}

const RoomCard = ({
  room,
  adults,
  children,
  onIncrementAdults,
  onDecrementAdults,
  onIncrementChildren,
  onDecrementChildren,
  onCreatePlan,
  onShowInfo,
  totalNights,
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
            <FaUtensils /> Food Available
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
            <CounterButton onClick={onIncrementAdults} increment>
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
            <CounterButton onClick={onIncrementChildren} increment>
              +
            </CounterButton>
          </Counter>
        </InputGroup>

        <PriceDetails>
          <PriceRow>
            <span>Base Price per Night:</span>
            <span>₹{Number.parseFloat(room.roomPrice || 0).toFixed(2)}</span>
          </PriceRow>{" "}
          <PriceRow>
            {" "}
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
              <strong style={{ color: "#003B94" }}>₹{discountedPrice.toFixed(2)}</strong>
            </span>
          </PriceRow>
          {room.discount > 0 && (
            <PriceRow>
              <span>Savings ({room.discount}% off):</span>
              <span>₹{(originalPrice - discountedPrice).toFixed(2)}</span>
            </PriceRow>
          )}
        </PriceDetails>

        <CreatePlanButton onClick={() => onCreatePlan(room)}>Create Plan</CreatePlanButton>
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
                <FacilityIcon>{getFacilityIcon(facility.name)}</FacilityIcon>
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