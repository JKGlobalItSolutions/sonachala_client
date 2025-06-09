import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAuth, signOut } from "firebase/auth"
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import EditProfile from "./EditProfile"
import MyBookings from "./MyBookings"
import Favorites from "./Favourites"
import LogoutPopup from "../../components/LogoutPopup"

const customRedColor = "#003B94"

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [activeSection, setActiveSection] = useState("editProfile")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [isTablet, setIsTablet] = useState(window.innerWidth <= 1024 && window.innerWidth > 768)

  useEffect(() => {
    const auth = getAuth()
    const db = getFirestore()

    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        const userDocRef = doc(db, "Users", currentUser.uid)
        const userDoc = await getDoc(userDocRef)

        if (userDoc.exists()) {
          setUser({ id: currentUser.uid, ...userDoc.data() })
        } else {
          const newUserData = {
            email: currentUser.email,
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
            createdAt: new Date(),
          }
          await setDoc(userDocRef, newUserData)
          setUser({ id: currentUser.uid, ...newUserData })
        }
      } else {
        setUser(null)
        navigate("/login")
      }
      setLoading(false)
    })

    const handleResize = () => {
      const width = window.innerWidth
      setIsMobile(width <= 768)
      setIsTablet(width <= 1024 && width > 768)
      if (width > 1024) {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => {
      unsubscribe()
      window.removeEventListener("resize", handleResize)
    }
  }, [navigate])

  const handleLogout = () => {
    setShowLogoutModal(true)
  }

  const confirmLogout = async () => {
    try {
      await signOut(getAuth())
      setShowLogoutModal(false)
      navigate("/login")
    } catch (error) {
      console.error("Error signing out: ", error)
    }
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status" style={{ color: customRedColor }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="text-center mt-5">Please log in to view your profile.</div>
  }

  const menuItems = [
    { id: "editProfile", icon: "👤", label: "Edit Profile" },
    { id: "myBookings", icon: "📅", label: "My Bookings" },
    { id: "favorites", icon: "❤️", label: "Favorites" },
  ]

  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header */}
      <header className="bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center">
        <h1 className="h4 mb-0">My Profile</h1>
        {(isMobile || isTablet) && (
          <button
            onClick={toggleSidebar}
            className="btn btn-outline-primary"
            style={{ borderColor: "#003B94", color: "#003B94" }}
          >
            ☰
          </button>
        )}
      </header>

      <div className="flex-grow-1 d-flex">
        {/* Sidebar */}
        <nav
          className={`bg-white border-end ${isMobile || isTablet ? "position-fixed h-100" : "sticky-top"}`}
          style={{
            width: isMobile ? "100%" : isTablet ? "250px" : "280px",
            transform: (isMobile || isTablet) && !isSidebarOpen ? "translateX(-100%)" : "translateX(0)",
            transition: "transform 0.3s ease-in-out",
            zIndex: 1030,
            height: "calc(100vh - 62px)", // Adjust based on your header height
          }}
        >
          <div className="p-4">
            {menuItems.map((item, index) => (
              <React.Fragment key={item.id}>
                <div
                  onClick={() => {
                    setActiveSection(item.id)
                    if (isMobile || isTablet) setIsSidebarOpen(false)
                  }}
                  className={`d-flex align-items-center py-3 px-4 cursor-pointer ${activeSection === item.id ? "text-white" : "text-dark"}`}
                  style={{
                    transition: "background-color 0.2s ease",
                    cursor: "pointer",
                    backgroundColor: activeSection === item.id ? "#003B94" : "transparent",
                  }}
                >
                  <span className="me-3 bg-light rounded-circle p-2">{item.icon}</span>
                  {item.label}
                </div>
                {index < menuItems.length - 1 && <hr className="my-0" />}
              </React.Fragment>
            ))}
            <hr />
            <div
              onClick={handleLogout}
              className="d-flex align-items-center py-3 px-4 cursor-pointer text-danger"
              style={{ cursor: "pointer" }}
            >
              <span className="me-3 bg-light rounded-circle p-2">🚪</span>
              Logout
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-grow-1 p-lg-4">
          {activeSection === "editProfile" && <EditProfile user={user} />}
          {activeSection === "myBookings" && <MyBookings userId={user.id} />}
          {activeSection === "favorites" && <Favorites userId={user.id} />}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutPopup isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} onConfirm={confirmLogout} />
    </div>
  )
}

export default Profile

