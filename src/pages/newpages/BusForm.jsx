import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function BusForm() {
  return (
    <div className="container-fluid mt-5  mb-5">
      <form className="row justify-content-center ">
        <div className="col-md-3 mb-3">
          <label htmlFor="fromCity" className="form-label">From</label>
          <select className="form-select" id="fromCity">
            <option>Select City</option>
            <option>New York</option>
            <option>Chicago</option>
            <option>San Francisco</option>
          </select>
        </div>

        <div className="col-md-3 mb-3    ">
          <label htmlFor="toCity" className="form-label">To</label>
          <select className="form-select" id="toCity">
            <option>Select City</option>
            <option>Los Angeles</option>
            <option>Houston</option>
            <option>Seattle</option>
          </select>
        </div>

        <div className="col-md-3 mb-3">
          <label htmlFor="departureDate" className="form-label">Departure</label>
          <input type="date" className="form-control" id="departureDate" />
        </div>

        <div className="col-12 d-flex justify-content-center mt-5   mb-lg-4">
          <button type="submit" className="btn btn-success px-4">
            Search Bus
          </button>
        </div>
      </form>
    </div>
  );
}

export default BusForm;
