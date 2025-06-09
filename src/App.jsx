import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import HomePage from "./pages/HotelStaysPages/Hotel";
import Homestay from "./pages/HotelStaysPages/Homestay";
import LoginPage from "./pages/LoginPage";
import HotelList from "./pages/HotelStaysPages/Hotel-list";
import HomestayList from "./pages/HotelStaysPages/Homestay-list";
import HotelDetails from "./pages/HotelStaysPages/HotelDetails";
import MapScreen from "./pages/MapScreen";
import "./styles/global.css";
import CreatePlan from "./pages/HotelStaysPages/CreatePlan";
import Reservation from "./pages/HotelStaysPages/Reservation";
import YourBooking from "./pages/HotelStaysPages/YourBooking";
import Profile from "./pages/UserProfile/Profile";
import MyBookings from "./pages/UserProfile/MyBookings";
import HelpAndSupport from "./pages/HelpAndSupport";
import About from "./pages/About";
import HourlyStay from "./pages/HourlyStayPages/HourlyStay";
import HourlyStayRoomDetails from "./pages/HourlyStayPages/HourlyStayRoomDetails";
import HourlyStayReservation from "./pages/HourlyStayPages/HourlyStayReservation";
import Preloader from "./pages/HotelStaysPages/Preloader";
import BookingSuccessful from "./pages/HotelStaysPages/YourBooking";
import HourlyStayBookingSuccessful from "./pages/HotelStaysPages/YourBooking";
import HourlyStayBookingSuccessfull from "./pages/HourlyStayPages/HourlyStayBookingSuccessfull";

// new pages

// import Home from "./pages/Home";
import Agent from "./pages/newpages/Agent";
import Hotelpatner from "./pages/newpages/Hotelpatner";
import Listyourhotel from "./pages/newpages/Listyourhotel";
import Agreementform from "./pages/newpages/Agreementform";
import Flightform from "./pages/newpages/FlightForm";
import BusForm from "./pages/newpages/BusForm";
import EventForm from "./pages/newpages/EventForm";
import CabForm from "./pages/newpages/CabForm";
import HolidayForm from "./pages/newpages/HolidayForm";
import ForexForm from "./pages/newpages/ForexForm";

import SupportForm from "./pages/newpages/SupportForm";
import Searchbookings from "./pages/newpages/Searchbookings";
import CustomerSignin from "./pages/newpages/CustomerSignin";
import SignupForm from "./pages/newpages/SignupForm";
import Centralreseve from "./pages/newpages/Centralreseve";
import PmsConnect from "./pages/newpages/PmsConnect";
import ReserveBackend from "./pages/newpages/ReserveBackend";
import Revenuemanage from "./pages/newpages/Revenuemanage";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Navbar />
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/Homestays" element={<Homestay />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/HotelList" element={<HotelList />} />
              <Route path="/HomestayList" element={<HomestayList />} />
              <Route path="/hourly-stay" element={<HourlyStay />} />
              <Route
                path="/hotel-details/:hotelId"
                element={<HotelDetails />}
              />
              <Route path="create-plan/:hotelId" element={<CreatePlan />} />
              <Route path="/reservation/:hotelId" element={<Reservation />} />
              <Route
                path="/Your-booking/:bookingId"
                element={<YourBooking />}
              />
              <Route path="/profile" element={<Profile />} />
              <Route path="/about" element={<About />} />
              <Route path="/help-And-Support" element={<HelpAndSupport />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route
                path="hourly-stay-room-details"
                element={<HourlyStayRoomDetails />}
              />
              <Route
                path="hourly-reservation"
                element={<HourlyStayReservation />}
              />
              <Route
                path="/hourly-successful"
                element={<HourlyStayBookingSuccessfull />}
              />

              <Route path="/map" element={<MapScreen />} />

              {/*---------------------- new pages---------------------------------------------------------------- */}

              {/* <Route path="/" element={<Home showPopup={showPopup} />} /> */}

              <Route path="/Agent" element={<Agent />} />
              <Route path="/Hotel-patner" element={<Hotelpatner />} />
              <Route path="/List-your-hotel" element={<Listyourhotel />} />
              <Route path="/Agreement-form" element={<Agreementform />} />
              <Route path="/flight-form" element={<Flightform />} />
              <Route path="/Bus-form" element={<BusForm />} />
              <Route path="/Event-form" element={<EventForm />} />
              <Route path="/Cab-form" element={<CabForm />} />
              <Route path="/Holiday-form" element={<HolidayForm />} />
              <Route path="/Forex-form" element={<ForexForm />} />
              <Route path="/Support-form" element={<SupportForm />} />
              <Route path="/Searchbookings" element={<Searchbookings />} />
              <Route path="/CustomerSignin" element={<CustomerSignin />} />
              <Route path="/SignupForm" element={<SignupForm />} />
              <Route path="/Centralreseve" element={<Centralreseve />} />
              <Route path="/PmsConnect" element={<PmsConnect />} />
              <Route path="/ReserveBackend" element={<ReserveBackend />} />
              <Route path="/Revenuemanage" element={<Revenuemanage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
