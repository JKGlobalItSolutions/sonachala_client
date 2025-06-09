import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import emailjs from '@emailjs/browser';
// import capcha from "../assets/image/agreementform/captcha.png";

function HolidayForm() {
  const form = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.sendForm(
        "service_dx15jok", // e.g., 'service_xxxxxx'
        "template_chy8xg4", // e.g., 'template_xxxxxx'
        form.current,
        "f9gOiNDslrV9kQENr" // e.g., 'user_xxxxxx'
      )
      .then((result) => {
          alert("Form submitted successfully!");
          console.log(result.text);
      }, (error) => {
          alert("Failed to send form. Try again.");
          console.log(error.text);
      });
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="card">
        <div className="card-header fw-bold">Holiday Package Enquiry</div>
        <div className="card-body">
          <p className="text-muted">Please provide us required details for Holiday Package enquiry.</p>
          <form ref={form} onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="user_name" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="user_email" required />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Mobile</label>
                <input type="text" className="form-control" name="user_mobile" required />
              </div>
              <div className="col-md-6">
                <label className="form-label">City of Residence</label>
                <input type="text" className="form-control" name="user_city" />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Vacation Type</label>
                <input type="text" className="form-control" name="vacation_type" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Destination</label>
                <input type="text" className="form-control" name="location_to" />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">No. of People</label>
                <input type="number" className="form-control" name="people_count" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Appx. Budget</label>
                <input type="text" className="form-control" name="budget" />
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label className="form-label">Travel Date From</label>
                <input type="date" className="form-control" name="travel_date_from" />
              </div>
              <div className="col-md-6">
                <label className="form-label">Travel Date To</label>
                <input type="date" className="form-control" name="travel_date_to" />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Verify Code</label>
                <div className="d-flex align-items-center">
                  {/* <img src={capcha} alt="captcha" className="me-2" /> */}
                  <input type="text" className="form-control w-50" name="captcha_code" />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Remarks</label>
                <textarea className="form-control" rows="3" name="remarks"></textarea>
              </div>
            </div>

            <div className="text-start">
              <button type="submit" className="btn btn-success px-4">Submit</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HolidayForm;
