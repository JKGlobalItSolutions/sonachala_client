import React from "react";

const Hotelpatner = () => {
  return (
    <div className="container my-5">
      {/* Sign-in Box */}
      <div
        className="mx-auto"
        style={{
          maxWidth: "500px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          boxShadow: "0px 0px 6px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <h5
          className="fw-bold text-start m-0 px-3 py-2"
          style={{ backgroundColor: "#e9e9e9", borderBottom: "1px solid #ccc" }}
        >
          LOGIN
        </h5>

        {/* Instruction */}
        <div className="px-3 pt-3">
          <h6 className="mb-3">
            Please fill out the following fields to login:
          </h6>
        </div>

        {/* Form */}
        <div className="p-3">
  <div className="mb-3">
    <label className="form-label">Email / Mobile no</label>
    <input
      type="text"
      className="form-control"
      placeholder="Email / Mobile no"
    />
  </div>

  <div className="mb-4">
    <label className="form-label">Password</label>
    <input
      type="password"
      className="form-control"
      placeholder="Password"
    />
  </div>

  <div className="d-flex justify-content-center">
    <button
      className="btn w-50 fw-semibold text-white"
      style={{ backgroundColor: "#038A5E" }}
    >
      Sign in
    </button>
  </div>
</div>

      </div>
    </div>
  );
};

export default Hotelpatner;


