import React from "react";
import { FaBuilding, FaRedoAlt, FaStar, FaUserAlt } from "react-icons/fa";

const Searchbookings = () => {
  return (
    <div className="container">
      {/* Search Form */}
      <div className="container p-4 my-4" style={{ backgroundColor: "#f7f0f0" }}>
        <h6 className="fw-bold bg-secondary w-25 mb-4 text-white text-center p-2 rounded-1">
          Search Booking
        </h6>
        <form>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Booking ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Booking ID"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mobile No</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Mobile No"
              />
            </div>
          </div>
          <div className="mt-4 d-flex gap-2">
            <button type="submit" className="btn btn-success">
              Search
            </button>
            <button type="reset" className="btn btn-outline-dark">
              Reset
            </button>
          </div>
        </form>
      </div>

      {/* Why Book Hotels Section */}
      <div className="text-center mt-5">
        <h5 className="fw-bold mb-5">Why Book Hotels with ohm.com?</h5>
        <div className="row justify-content-center">
          {[
            {
              icon: <FaBuilding size={24} className="text-success" />,
              title: "Convenience and Accessibility",
              text: "24/7 Availability. Booking apps allow users to book hotels anytime, anywhere—without being restricted to business hours.",
            },
            {
              icon: <FaRedoAlt size={24} className="text-success" />,
              title: "Time-Saving",
              text: "Instant Confirmation. Many booking websites provide instant confirmation and reduce follow-up communication.",
            },
            {
              icon: <FaStar size={24} className="text-success" />,
              title: "Reviews and Ratings",
              text: "User reviews and ratings help make better decisions by providing real experiences about hotels and services.",
            },
            {
              icon: <FaUserAlt size={24} className="text-success" />,
              title: "User-Friendly Interfaces",
              text: "Intuitive platforms that simplify the hotel booking process with step-by-step flows.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="col-lg-3 col-md-6 col-sm-6 mb-4 d-flex justify-content-center"
            >
              <div
                className="border rounded text-center pt-5 px-3 pb-3 w-100 position-relative"
              >
                <div
                  className="position-absolute top-0 start-50 translate-middle"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    width: 48,
                    height: 48,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {item.icon}
                </div>
                <h6 className="mt-3">{item.title}</h6>
                <p className="small">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Searchbookings;
