import React from "react";
import { Link } from "react-router-dom";

const Listyourhotel = () => {
  return (
    <div className="container-fluid ps-5  mt-3 mb-4 " style={{ fontFamily: 'Segoe UI, Roboto, sans-serif', fontSize: '1.2rem', lineHeight: '1.6' }}>
      {/* Description Text */}
      <div className="mx-auto" style={{ height: " 280px" }}>
        <p className="text-start mb-4">
        We list your hotel with free of cost, we charge minimum Commision to generate bookings. As well your hotel will be advertise in <br /> all major tourist destination with free of cost, this will help to generate some more bookings.
        </p>

        {/* Agreement Link (Left-Aligned) */}
        <h5>
          <Link to="/Agreement-form" className="text-decoration-none text-black fw-semibold">
            Click here to fill the Agreement Form
          </Link>
        </h5>
      </div>
    </div>
  );
};

export default Listyourhotel;
