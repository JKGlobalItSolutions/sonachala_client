import React from "react";

// Import images from src folder

import form1 from "../image/agreementform/form1.png";
 
import form2 from "../image/agreementform/form2.png";
import form3 from "../image/agreementform/form3.png";
import form4 from "../image/agreementform/form4.png";

// import agreementPDF from "../pdf/AgreementForm.pdf";

const Agreementform = () => {
  const imageFiles = [form1, form2, form3, form4];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = agreementPDF;
    link.download = "AgreementForm.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container my-4">
      {/* Download Button */}
      <div className="text-end mb-4">
        <button
          onClick={handleDownload}
          className="btn btn-success fw-semibold"
        >
          📥 Download Agreement Form
        </button>
      </div>

      {/* Image Previews */}
      <div className="row">
        {imageFiles.map((src, index) => (
          <div className="col-md-6 mb-4" key={index}>
            <img
              src={src}
              alt={`Agreement Page ${index + 1}`}
              className="img-fluid rounded shadow-sm"
              style={{ border: "1px solid #ccc" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agreementform;
