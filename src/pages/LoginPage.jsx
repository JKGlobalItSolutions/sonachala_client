import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs"
import { FcGoogle } from "react-icons/fc"
import styles from "../styles/LoginPage.module.css"
import "bootstrap/dist/css/bootstrap.min.css"

function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { currentUser, signInWithGoogle, signInWithEmail } = useAuth()

  useEffect(() => {
    if (currentUser) {
      navigate("/")
    }
  }, [currentUser, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await signInWithEmail(email, password)
      toast.success("Login successful!")
      navigate("/")
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        toast.error("Invalid password. Please try again.")
      } else {
        toast.error("Login failed. Please check your credentials.")
      }
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      toast.success("Google sign-in successful!")
      navigate("/")
    } catch (error) {
      toast.error("Google sign-in failed. Please try again.")
      console.error(error)
    }
  }

  return (
    <div className={styles.container} style={{ backgroundColor: "#038A5E" }}>
      <div className={styles.form}>
        <div className={styles.formContent}>
          <header className={styles.header}>Login</header>
          <form onSubmit={handleSubmit}>
            <div className={styles.field}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <i className={styles.eyeIcon} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <BsEyeSlashFill /> : <BsEyeFill />}
              </i>
            </div>

            <div className={styles.formLink}>
              <a href="#" className={styles.forgotPass}>
                Forgot password?
              </a>
            </div>

            <div className={styles.field}>
              <button type="submit" style={{ backgroundColor: "#038A5E" }}>
                Login
              </button>
            </div>
          </form>

          <div className={styles.line}></div>

          <div className={`${styles.field} ${styles.mediaOptions}`}>
            <button
              onClick={handleGoogleSignIn}
              className="btn btn-outline-light w-100 d-flex align-items-center justify-content-center"
              style={{ borderColor: "#038A5E", color: "#038A5E",backgroundColor:"#038A5E" }}
            >
              <FcGoogle className="me-2 m-1" />
              <span style={{color:"white"}} >Login with Google</span>
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" />
    </div>
  )
}
export default LoginPage

