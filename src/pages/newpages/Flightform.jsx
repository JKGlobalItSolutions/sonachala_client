import React, { useState } from "react";
import { FaSearch, FaCalendarAlt, FaUserFriends } from "react-icons/fa";

const Flightform = () => {
  const [activeTab, setActiveTab] = useState("oneWay");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  const handleCountChange = (setter, value) => {
    if (value >= 0) setter(value);
  };

  const handleSearch = () => {
    alert(`Searching ${activeTab} flights...`);
  };

  const InputGroup = ({ label, value, setValue }) => (
    <div className="d-flex align-items-center gap-2">
      <label className="fw-medium">{label}</label>
      <button
        className="btn btn-success btn-sm"
        onClick={() => handleCountChange(setValue, value - 1)}
        disabled={value <= 0}
      >
        -
      </button>
      <span className="fw-bold">{value}</span>
      <button
        className="btn btn-success btn-sm"
        onClick={() => handleCountChange(setValue, value + 1)}
      >
        +
      </button>
    </div>
  );

  const FlightInputs = () => (
    <div className="row mb-3">
      <div className="col-12 col-md-4 mb-3 mb-md-0">
        <label className="form-label">From</label>
        <input
          type="text"
          className="form-control"
          placeholder="City or Airport"
        />
      </div>
      <div className="col-12 col-md-4 mb-3 mb-md-0">
        <label className="form-label">To</label>
        <input
          type="text"
          className="form-control"
          placeholder="City or Airport"
        />
      </div>
      <div className="col-12 col-md-4">
        <label className="form-label">Date</label>
        <input type="date" className="form-control" />
      </div>
    </div>
  );

  const PassengerSection = () => (
    <div className="d-flex flex-column flex-md-row gap-3 mb-4 align-items-start">
      <InputGroup label="Adults" value={adults} setValue={setAdults} />
      <InputGroup label="Children" value={children} setValue={setChildren} />
      <InputGroup label="Infants" value={infants} setValue={setInfants} />
    </div>
  );

  const tabColors = {
    oneWay: "#e6f4ea", // pastel green
    roadTrip: "#fff7da", // pastel yellow
    multiCity: "#e5f0ff", // pastel blue
  };

  return (
    <div
      className="container px-3 py-4"
      style={{ backgroundColor: "#e0f2f1", minHeight: "100vh" }}
    >
      {/* Tab Buttons */}
      <div
        className="d-flex flex-wrap justify-content-center gap-2 mb-4 p-3"
        style={{
          background: "linear-gradient(to right, #b2dfdb, #a5d6a7)",
          borderRadius: "10px",
          border: "2px solid #4caf50",
        }}
      >
        {["oneWay", "roadTrip", "multiCity"].map((tab) => (
          <button
            key={tab}
            className={`btn px-4 py-2 fw-semibold ${
              activeTab === tab
                ? "btn-light text-success"
                : "btn-outline-light text-dark"
            }`}
            onClick={() => setActiveTab(tab)}
            style={{
              backgroundColor: activeTab === tab ? "#ffffff" : "transparent",
              borderRadius: "6px",
              border: "none",
            }}
          >
            {tab === "oneWay"
              ? "One Way"
              : tab === "roadTrip"
              ? "Road Trip"
              : "Multi City"}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded shadow">
        {activeTab === "multiCity" ? (
          <>
            <div className="mb-3">
              <button className="btn btn-outline-success me-2">Flight 1</button>
              <button className="btn btn-outline-success">Flight 2</button>
            </div>
            <FlightInputs />
            <FlightInputs />
            <PassengerSection />
          </>
        ) : (
          <>
            <FlightInputs />
            <PassengerSection />
          </>
        )}

        {/* Search Button */}
        <div className="text-end mt-4">
          <button
            className="btn btn-lg btn-success w-100 w-md-auto"
            style={{ maxWidth: "250px" }}
            onClick={handleSearch}
          >
            🔍 Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Flightform;
