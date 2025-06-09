import React from "react";
import { FaSearch, FaCalendarAlt, FaUserFriends } from "react-icons/fa";

import { FaMapMarkerAlt } from "react-icons/fa";


import recent1 from "../assets/image/homeimg/recent1.png";
import recent2 from "../assets/image/homeimg/recent2.png";
import recent3 from "../assets/image/homeimg/recent3.png";

import offer1 from "../assets/image/homeimg/offer1.png";
import offer2 from "../assets/image/homeimg/offer2.png";

import trand1 from "../assets/image/homeimg/trand1.png";
import trand2 from "../assets/image/homeimg/trand2.png";
import trand3 from "../assets/image/homeimg/trand3.png";
import trand4 from "../assets/image/homeimg/trand4.png";

import homeimg from "../assets/image/homeimg/scroll.png";

const trendingDestinations = [
  {
    image: trand1,
    name: "Near Arunachaleswarar Temple StaysArunachala Temple",
  },
  { image: trand2, name: "Budget Stays in Tiruvannamalai" },
  { image: trand3, name: "Luxury Heritage Hotels" },
  { image: trand4, name: "Hill View Stays" },
];

import { FaHotel, FaClock, FaStar, FaUser } from "react-icons/fa";

const features = [
  {
    icon: <FaHotel />,
    title: "Convenience and Accessibility",
    desc: "24/7 availability of hotels across regions.",
  },
  {
    icon: <FaClock />,
    title: "Time-Saving",
    desc: "Instant confirmation of bookings.",
  },
  {
    icon: <FaStar />,
    title: "Reviews and Ratings",
    desc: "User reviews help assess hotels accurately.",
  },
  {
    icon: <FaUser />,
    title: "User-Friendly Interfaces",
    desc: "Easy, step-by-step hotel booking process.",
  },
];

import tnmap from "../assets/image/homeimg/tnmap.png";

const Home = ({ showPopup  }) => {
  return (
    <div>
      <main style={{ backgroundColor: "#f8f9fa" }}>
        {/* Hero Section */}
        <section
          className="position-relative text-white"
          style={{ backgroundColor: "#000", height: "400px" }}
        >
          <img
            src={homeimg}
            alt="Hero"
            className="w-100 h-100 object-fit-cover opacity-50 position-absolute"
          />

          <div className="container position-relative z-1 py-5 d-flex flex-column align-items-start text-start">
            <h2 className="fw-bold">Pack the whole toybox</h2>
            <p className="lead">Unwind and spread out in a holiday home</p>
            <button className="btn btn-success px-4 py-2">
              Discover holiday rentals
            </button>
          </div>

          {/* Search Bar */}

          {/* Desktop Search Bar (absolute positioned) */}
          <div
            className="container bg-success shadow rounded position-absolute start-50 translate-middle-x d-none d-md-block"
            style={{ bottom: "-30px", maxWidth: "90%" }}
          >
            <div className="row p-3 g-2">
              <div className="col-md-4">
                <div className="position-relative">
                  <FaSearch className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
                  <input
                    className="form-control ps-5 border-0 p-3"
                    placeholder="Searching For destination"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="position-relative">
                  <FaCalendarAlt className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
                  <input
                    className="form-control ps-5 border-0 p-3"
                    placeholder="Thu 16 May - Fri 17 May"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="position-relative">
                  <FaUserFriends className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
                  <input
                    className="form-control ps-5 border-0 p-3"
                    placeholder="2 adults / 0 children (1 room)"
                  />
                </div>
              </div>

              <div className="col-md-2">

                {/* <button className="btn btn-success w-100 bg-dark p-3" >
                  Search
                </button> */}

                <button className="btn btn-success w-100 bg-dark " onClick={showPopup}>Show Coming Soon Popup</button>

                
              </div>
            </div>
          </div>

          {/* Mobile Search Bar (normal block flow) */}
          <div
            className="container bg-success shadow rounded mt-5 d-block d-md-none mb-5"
            style={{ bottom: "-80px", maxWidth: "90%" }}
          >
            <div className="row p-3 g-2">
              <div className="col-12">
                <div className="position-relative mb-2">
                  <FaSearch className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
                  <input
                    className="form-control ps-5 border-0 p-3"
                    placeholder="Searching For destination"
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="position-relative mb-2">
                  <FaCalendarAlt className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
                  <input
                    className="form-control ps-5 border-0 p-3"
                    placeholder="Thu 16 May - Fri 17 May"
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="position-relative mb-2">
                  <FaUserFriends className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
                  <input
                    className="form-control ps-5 border-0 p-3"
                    placeholder="2 adults / 0 children (1 room)"
                  />
                </div>
              </div>

              <div className="col-12">
                <button className="btn btn-success w-100 bg-dark p-3">
                  Search
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="py-5 mt-5 container mobile-top-space">
          {/* Recent Searches */}
          <h4 className="fw-bold">Your recent searches</h4>
          <div className="d-flex gap-3 overflow-auto py-3">
            {/* Sparsa Resort */}

            {/* Sparsa Resort */}
            <div
              className="card p-3 d-flex flex-row align-items-start"
              style={{
                minWidth: "357px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              <img
                src={recent1} // beach resort image
                alt="Sparsa Resort"
                className="rounded me-3"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start gap-4">
                  <h6
                    className="fw-semibold mb-1"
                    style={{ fontSize: "1.1rem", color: "#333" }}
                  >
                    Sparsa Resort
                  </h6>
                  <div>
                    <span
                      className="badge bg-success rounded-pill"
                      style={{ fontSize: "0.9rem" }}
                    >
                      4.7
                    </span>
                    <br />
                    <div style={{ fontSize: "0.9rem", color: "green" }}>
                      ★★★★★
                    </div>
                  </div>
                </div>
                <small
                  className="text-muted d-block"
                  style={{ fontSize: "0.85rem" }}
                >
                  21 Feb – 23 Feb, 2 people
                </small>
                <p
                  className="fw-bold mb-1"
                  style={{ fontSize: "1rem", color: "#333" }}
                >
                  ₹4,672
                </p>
              </div>
            </div>

            {/* Arudra Residency */}
            <div
              className="card p-3 d-flex flex-row align-items-start"
              style={{
                minWidth: "357px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              <img
                src={recent2} // luxury hotel lobby
                alt="Arudra Residency"
                className="rounded me-3"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start gap-4">
                  <h6
                    className="fw-semibold mb-1"
                    style={{ fontSize: "1.1rem", color: "#333" }}
                  >
                    Arudra Residency
                  </h6>
                  <div>
                    <span
                      className="badge bg-success rounded-pill"
                      style={{ fontSize: "0.9rem" }}
                    >
                      4.5
                    </span>
                    <br />
                    <div style={{ fontSize: "0.9rem", color: "green" }}>
                      ★★★★★
                    </div>
                  </div>
                </div>
                <small
                  className="text-muted d-block"
                  style={{ fontSize: "0.85rem" }}
                >
                  16 Feb – 17 Feb, 2 people
                </small>
                <p
                  className="fw-bold mb-1"
                  style={{ fontSize: "1rem", color: "#333" }}
                >
                  ₹6,579
                </p>
              </div>
            </div>

            {/* Athena Hotel */}
            <div
              className="card p-3 d-flex flex-row align-items-start"
              style={{
                minWidth: "357px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
              }}
            >
              <img
                src={recent3} // hotel entrance sign
                alt="Athena Hotel"
                className="rounded me-3"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-start gap-4">
                  <h6
                    className="fw-semibold mb-1"
                    style={{ fontSize: "1.1rem", color: "#333" }}
                  >
                    Athena Hotel
                  </h6>
                  <div>
                    <span
                      className="badge bg-success rounded-pill"
                      style={{ fontSize: "0.9rem" }}
                    >
                      4.4
                    </span>
                    <br />
                    <div style={{ fontSize: "0.9rem", color: "green" }}>
                      ★★★★★
                    </div>
                  </div>
                </div>
                <small
                  className="text-muted d-block"
                  style={{ fontSize: "0.85rem" }}
                >
                  21 Jan – 23 Jan, 4 people
                </small>
                <p
                  className="fw-bold mb-1"
                  style={{ fontSize: "1rem", color: "#333" }}
                >
                  ₹7,254
                </p>
              </div>
            </div>
          </div>

          {/* Offers */}
          <h4 className="fw-bold mt-4">Offers</h4>
          <h6>Grab the best deals before they’re gone!</h6>
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card p-3 shadow-sm">
                <div className="row g-2 align-items-center">
                  <div className="col-4">
                    <img
                      src={offer1}
                      className="img-fluid rounded"
                      alt="offer1"
                    />
                  </div>
                  <div className="col-8">
                    <h6>3 Days & 2 Nights Accordable Stay Price</h6>
                    <p className="mb-1 small text-muted">CS Arunachala</p>
                    <button className="btn btn-success btn-sm">BOOK NOW</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card p-3 shadow-sm">
                <div className="row g-2 align-items-center">
                  <div className="col-4">
                    <img
                      src={offer2}
                      className="img-fluid rounded"
                      alt="offer2"
                    />
                  </div>
                  <div className="col-8">
                    <h6>20% OFF On Premium Stays</h6>

                    <p className="mb-1 small text-muted">
                      Flat ₹500 OFF on First Booking
                    </p>
                    <button className="btn btn-success btn-sm">
                      Claim Offer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Destinations */}

          <h4 className="fw-bold mt-5">Trending Destinations</h4>
          <p className="text-muted">Top places to stay in Thiruvannamalai</p>

          <div className="row g-4">
            {trendingDestinations.map((item, i) => (
              <div className="col-lg-6" key={i}>
                <div className="card">
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                  />
                  <div className="card-body p-2 bg-success text-white text-center">
                    <small style={{ fontSize: "1rem" }}>{item.name}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Coming Soon */}

          <div className="container-fluid px-0 mt-5 ">
            <div
              className="bg-success text-white rounded-2 position-relative overflow-hidden"
              style={{ padding: "100px 0" }}
            >
              {/* Content Block */}
              <div
                className="container position-relative"
                style={{
                  right: "0", // default for mobile
                }}
              >
                <h4 className="text-center ms-5 text-md-start">
                  Book Your Stay Anywhere <br className="d-none d-md-block" />
                  in Tamil Nadu with
                </h4>

                <div className="d-flex flex-column flex-md-row align-items-center mt-3 ms-5">
                  <FaMapMarkerAlt
                    style={{
                      color: "white",
                      fontSize: "1.7rem",
                      marginRight: "10px",
                    }}
                  />
                  <h3
                    style={{
                      fontFamily: "Montserrat",
                      margin: 0,
                    }}
                  >
                    Sonachala
                  </h3>
                </div>

                <button className="btn btn-warning mt-3 ms-5 custom-mobile-btn">
                  Coming Soon
                </button>
              </div>

              {/* Map Image */}
              <img
                src={tnmap}
                className="position-absolute d-none d-md-block"
                alt="Map"
                style={{
                  maxWidth: "350px",
                  right: "100px",
                  bottom: "20px",
                  zIndex: 0,
                }}
              />

              {/* Mobile map (inline) */}
              <div className="d-block d-md-none text-center mt-4">
                <img
                  src={tnmap}
                  alt="Map"
                  style={{
                    width: "100%",
                    maxWidth: "280px",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Why Book With Us */}

          <h4 className="fw-bold mt-5 text-center">
            Why Book Hotels with ohm.com?
          </h4>

          <div
            className="row g-5"
            style={{ marginTop: "3rem", marginBottom: "9rem" }} // Equivalent to Bootstrap `mt-5 mb-5`
          >
            {features.map((item, i) => (
              <div className="col-md-3" key={i}>
                <div
                  className="position-relative text-center h-100 border rounded-3 p-4 pt-5"
                  style={{ borderColor: "#0f9d58" }}
                >
                  {/* Icon Circle */}
                  <div
                    className="position-absolute top-0 start-50 translate-middle"
                    style={{
                      width: "60px",
                      height: "60px",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 0 0 4px #0f9d58",
                      fontSize: "1.4rem",
                      color: "#0f9d58",
                      zIndex: 1,
                    }}
                  >
                    {item.icon}
                  </div>

                  {/* Title & Description */}
                  <h6 className="mt-4 pt-3">{item.title}</h6>
                  <p className="text-muted small">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
