import React from 'react';

const SignupForm = () => {
  return (
   <div className="container mt-5 mb-5">
      <div className="p-4 border rounded mx-auto" style={{ maxWidth: "700px" }}>
        <h6 className="fw-bold bg-secondary w-100 mb-4 text-white text-center p-2 rounded-1">
          Sign up
        </h6>
        <form>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" className="form-control" placeholder="Name" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input type="email" className="form-control" placeholder="Email" />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Mobile No</label>
              <input type="text" className="form-control" placeholder="Mobile No" />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <button type="button" className="btn btn-outline-secondary me-2">
                Send OTP
              </button>
              <input type="text" className="form-control" placeholder="Enter OTP" />
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <label className="form-label">Username</label>
              <input type="text" className="form-control" placeholder="Username" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" placeholder="Password" />
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-success w-100">
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
