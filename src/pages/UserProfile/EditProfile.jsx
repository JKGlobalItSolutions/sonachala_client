import React, { useState, useEffect } from "react"
import { getAuth, updateProfile } from "firebase/auth"
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { useAuth } from "../../contexts/AuthContext"
import { Camera, User, Mail, Calendar, Phone, MapPin } from "lucide-react"

const customRedColor = "#003B94"

const EditProfile = () => {
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    address: "",
    dob: "",
    profilePicture: null,
    fcmToken: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser?.uid) {
        const db = getFirestore()
        const userDoc = await getDoc(doc(db, "Users", currentUser.uid))

        if (userDoc.exists()) {
          const userData = userDoc.data()
          setFormData({
            fullName: userData["Full Name"] || currentUser.displayName || "",
            email: userData["Email Address"] || currentUser.email || "",
            mobileNumber: userData["Mobile Number"] || "",
            address: userData["Address"] || "",
            dob: userData["DOB"] || "",
            profilePicture: userData["ProfilePicture"] || currentUser.photoURL || "",
            fcmToken: userData["fcmToken"] || "",
          })
          setPreviewUrl(userData["ProfilePicture"] || currentUser.photoURL)
        }
      }
    }

    fetchUserData()
  }, [currentUser])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
      }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const auth = getAuth()
      const db = getFirestore()
      const storage = getStorage()

      let profilePictureUrl = formData.profilePicture

      if (formData.profilePicture instanceof File) {
        const storageRef = ref(storage, `ProfilePicture/${currentUser.uid}`)
        await uploadBytes(storageRef, formData.profilePicture)
        profilePictureUrl = await getDownloadURL(storageRef)
      }

      await updateProfile(auth.currentUser, {
        displayName: formData.fullName,
        photoURL: profilePictureUrl,
      })

      const userRef = doc(db, "Users", currentUser.uid)
      await updateDoc(userRef, {
        Address: formData.address,
        DOB: formData.dob,
        "Email Address": formData.email,
        "Full Name": formData.fullName,
        "Mobile Number": formData.mobileNumber,
        ProfilePicture: profilePictureUrl,
        fcmToken: formData.fcmToken,
      })

      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }

    setIsLoading(false)
  }

  const inputGroupStyle = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #ced4da",
    borderRadius: "0.25rem",
    overflow: "hidden",
  }

  const inputGroupTextStyle = {
    display: "flex",
    alignItems: "center",
    padding: "0.375rem 0.75rem",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.5",
    color: "#495057",
    textAlign: "center",
    whiteSpace: "nowrap",
    backgroundColor: "#e9ecef",
    borderRight: "none",
  }

  const inputStyle = {
    display: "block",
    width: "100%",
    padding: "0.375rem 0.75rem",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.5",
    color: "#495057",
    backgroundColor: "#fff",
    backgroundClip: "padding-box",
    border: "none",
    borderLeft: "none",
    transition: "border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
  }

  return (
    <div className="container py-5 px-3 px-lg-0 ">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-11">
          <form onSubmit={handleSubmit}>
            {/* Profile Picture Section */}
            <div className="text-center mb-5">
              <div className="position-relative d-inline-block">
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    overflow: "hidden",
                    backgroundColor: "#f8f9fa",
                  }}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl || "/placeholder.svg"}
                      alt="Profile"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", backgroundColor: "#f8f9fa" }} />
                  )}
                </div>
                <label
                  htmlFor="profilePicture"
                  className="position-absolute bottom-0 end-0 p-2 rounded-circle cursor-pointer shadow"
                  style={{ backgroundColor: customRedColor, cursor: "pointer" }}
                >
                  <Camera className="text-white" />
                  <input
                    type="file"
                    id="profilePicture"
                    name="profilePicture"
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                    aria-label="Upload profile picture"
                  />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="mb-4">
              <label htmlFor="fullName" className="form-label fs-5 fw-medium">
                Full Name
              </label>
              <div style={inputGroupStyle}>
                <span style={inputGroupTextStyle}>
                  <User style={{ color: customRedColor }} />
                </span>
                <input
                  type="text"
                  style={inputStyle}
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="form-label fs-5 fw-medium">
                Email Address
              </label>
              <div style={inputGroupStyle}>
                <span style={inputGroupTextStyle}>
                  <Mail style={{ color: customRedColor }} />
                </span>
                <input
                  type="email"
                  style={inputStyle}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="dob" className="form-label fs-5 fw-medium">
                Date Of Birth
              </label>
              <div style={inputGroupStyle}>
                <span style={inputGroupTextStyle}>
                  <Calendar style={{ color: customRedColor }} />
                </span>
                <input
                  type="date"
                  style={inputStyle}
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="mobileNumber" className="form-label fs-5 fw-medium">
                Mobile Number
              </label>
              <div style={inputGroupStyle}>
                <span style={inputGroupTextStyle}>
                  <Phone style={{ color: customRedColor }} />
                </span>
                <input
                  type="tel"
                  style={inputStyle}
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="address" className="form-label fs-5 fw-medium">
                Address
              </label>
              <div style={inputGroupStyle}>
                <span style={inputGroupTextStyle}>
                  <MapPin style={{ color: customRedColor }} />
                </span>
                <input
                  type="text"
                  style={inputStyle}
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-lg w-100 mt-4"
              disabled={isLoading}
              style={{
                backgroundColor: customRedColor,
                borderColor: customRedColor,
                color: "white",
                padding: "0.5rem 1rem",
                fontSize: "1.25rem",
                lineHeight: "1.5",
                borderRadius: "0.3rem",
              }}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProfile

