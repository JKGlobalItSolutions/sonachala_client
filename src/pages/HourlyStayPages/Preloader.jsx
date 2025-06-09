import React from 'react';
import { Check } from 'react-feather';

const Preloader = () => {
  return (
    <div className="min-vh-100 bg-white d-flex justify-content-center align-items-center">
      <div className="text-center d-flex flex-column align-items-center">
        <div className="rounded-circle bg-success d-flex align-items-center justify-content-center mb-4" 
             style={{ width: '80px', height: '80px' }}>
          <Check size={40} color="white" />
        </div>
        <h2 className="h4 mb-3">Your Booking Confirmed</h2>
        <p className="text-muted">Guest details saved successfully!</p>
      </div>
    </div>
  );
};

export default Preloader;

