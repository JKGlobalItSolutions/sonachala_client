import React from 'react';
import { Link } from 'react-router-dom';


import logo from "../assets/image/componetimsges/logo.png";
import componislogo from "../assets/image/componetimsges/footerimg.png";

import smedia1 from "../assets/image/componetimsges/smedia1.png";
import smedia2 from "../assets/image/componetimsges/smedia2.png";
import smedia3 from "../assets/image/componetimsges/smedia3.png";
import smedia4 from "../assets/image/componetimsges/smedia4.png";
import smedia5 from "../assets/image/componetimsges/smedia5.png";



function Footer() {
  
  return (

    
    // <footer className="footer pt-4" style={{backgroundColor: "#001524", color: "#ffffff"}}>
    //   <div className="container">
    //     <div className="row">
    //       <div className="col-6 col-sm-3 col-lg-2 mb-4">
    //         <h6><b>Help</b></h6>
    //         <ul className="list-unstyled">
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>FAQ</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Privacy policy</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Cookies privacy</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Terms of use</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Help centre</a></li>
    //         </ul>
    //       </div>
    //       <div className="col-6 col-sm-3 col-lg-2 mb-4">
    //         <h6><b>Get the App</b></h6>
    //         <ul className="list-unstyled">
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>IOS app</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Android app</a></li>
    //         </ul>
    //       </div>
    //       <div className="col-6 col-sm-3 col-lg-2 mb-4">
    //         <h6><b>Company</b></h6>
    //         <ul className="list-unstyled">
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>About Us</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Blog</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Careers</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>PointMAX</a></li>
    //         </ul>
    //       </div>
    //       <div className="col-6 col-sm-3 col-lg-2 mb-4">
    //         <h6><b>Destination</b></h6>
    //         <ul className="list-unstyled">
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Cities</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Spiritual places</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Hill Stations</a></li>
    //           <li><a href="#" className="text-white" style={{textDecoration: "none", fontSize: "0.9rem"}}>Solo Travel places</a></li>
    //         </ul>
    //       </div>
    //       <div className="col-12 col-lg-4 mb-4">
    //         <h6 className="d-flex justify-content-center"><b>Social Networks</b></h6>
    //         <ul className="list-unstyled d-flex justify-content-center p-2">
    //           <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 406.png" alt="Facebook" className="rounded-pill" /></a></li>
    //           <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 407.png" alt="Twitter" className="rounded-pill" /></a></li>
    //           <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 408.png" alt="Instagram" className="rounded-pill" /></a></li>
    //           <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 410.png" alt="LinkedIn" className="rounded-pill" /></a></li>
    //           <li className="me-2"><a href="#"><img src="/assets/img/footer social meadia icons/Frame 409.png" alt="YouTube" className="rounded-pill" /></a></li>
    //         </ul>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="horizontal-line bg-white my-3" style={{height: "1px"}}></div>
    //   <h6 className="text-center mx-5 pt-3">&copy; 2023 Ohm Stays pvt .ltd.</h6>
    // </footer>






    <footer className="bg-dark text-white pt-4 pb-2">
      <div className="container-fluid">
        <div className="row text-center text-md-start align-items-start">
          {/* Logo */}
          <div className="col-lg-6 mt-5 mb-md-0">
            <div className="d-flex justify-content-center justify-content-md-start mb-5">
              <img
                src={logo}
                alt="Logo"
                width="300"
                height="200"
                className="rounded-5"
              />
            </div>
          </div>

          {/* Explore, Company, Help + Social/Logos */}
          <div className="col-lg-6 mt-5">
            <div className="row">
              <div className="col-4">
                <h6 className="text-uppercase fw-bold mb-3">Explore</h6>
                <p className="mb-1 small">India Services</p>
                <p className="mb-1 small">IRCTC Agent</p>
                <p className="mb-1 small">No. 1 B2B</p>
              </div>
              <div className="col-4">
                <h6 className="text-uppercase fw-bold mb-3">Company</h6>
                <p className="mb-1 small">About Us</p>
                <p className="mb-1 small">GST/ MSME Certified</p>
                <p className="mb-1 small">Career</p>
              </div>
              <div className="col-4">
                <h6 className="text-uppercase fw-bold mb-3">Help</h6>
                <p className="mb-1 small">Privacy Policy</p>
                <p className="mb-1 small">Terms & Conditions</p>
                <p className="mb-1 small">Support</p>
              </div>
            </div>

            {/* Combined Social Media & Company Logos in one row */}
            <div className="mt-3 d-flex flex-wrap justify-content-center justify-content-md-between align-items-center ">
              {/* Social Media Icons */}
              <div className="d-flex ">
                <Link to="/linkedin">
                  <img
                    src={smedia1}
                    alt="LinkedIn"
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%" }}
                  />
                </Link>
                <Link to="/instagram">
                  <img
                    src={smedia2}
                    alt="Instagram"
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%" }}
                  />
                </Link>
                <Link to="/twitter">
                  <img
                    src={smedia3}
                    alt="Twitter"
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%" }}
                  />
                </Link>
                <Link to="/facebook">
                  <img
                    src={smedia4}
                    alt="Facebook"
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%" }}
                  />
                </Link>
                <Link to="/youtube">
                  <img
                    src={smedia5}
                    alt="YouTube"
                    width="50"
                    height="50"
                    style={{ borderRadius: "50%" }}
                  />
                </Link>
              </div>

              {/* Payment/Company Logos */}
              <div className="d-flex gap-3 flex-wrap justify-content-center">
                <img src={componislogo} alt="Paytm" height="45" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="text-center mt-3 small text-muted">
          © 2025 SONACHALA Developers Pvt. Ltd.
        </div>
      </div>
    </footer>








  );
}

export default Footer;

