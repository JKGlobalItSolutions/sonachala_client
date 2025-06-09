import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import event from "../image/agreementform/event.png"; // Adjust the path as necessary

function EventForm() {
  const [price, setPrice] = useState(1000);

  return (
    <div className="container mt-4">
      <form>
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Event name"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Event Type"
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Language"
            />
          </div>
          <div className="col">
            <input type="text" className="form-control" placeholder="City" />
          </div>
        </div>

        <div className="form-check mb-3">
          <input
            className="form-check-input"
            type="checkbox"
            id="dateCheck"
            defaultChecked
          />
          <label className="form-check-label" htmlFor="dateCheck">
            Date
          </label>
        </div>

        <div className="row mb-3">
          <div className="col-md-2">
            <input type="date" className="form-control" placeholder="From..." />
          </div>
          <div className="col-md-2">
            <input type="date" className="form-control" placeholder="To..." />
          </div>
          <div className="col-md-2">
            <input
              type="time"
              className="form-control"
              placeholder="Select Time"
            />
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="priceRange" className="form-label">
            Price Range:
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control d-inline w-auto mx-2"
          />
          <input
            type="range"
            className="form-range w-25 d-inline"
            min="0"
            max="5000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <button
            type="button"
            className="btn me-2"
            style={{
              backgroundColor: "#D21312",
              color: "white",
              border: "none",
            }}
          >
            Today
          </button>

          <button
            type="button"
            className="btn me-2"
            style={{
              backgroundColor: "#D21312",
              color: "white",
              border: "none",
            }}
          >
            Tomorrow
          </button>

          <button
            type="button"
            className="btn me-2"
            style={{
              backgroundColor: "#D21312",
              color: "white",
              border: "none",
            }}
          >
            WeekEnd
          </button>

          <button type="submit" className="btn btn-success">
            Search
          </button>
        </div>

        <div className=" mt-5 mb-3">
          <img
            src={event}
            alt="Event"
            className="img-fluid rounded "
            style={{ maxWidth: "300px" }}
          />
        </div>
      </form>
    </div>
  );
}

export default EventForm;
