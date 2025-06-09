import React from 'react'
import banner from '../Images/About/Frame 1006.png'

const About = () => {
  return (
    <div>
      <div className=" mb-3 ">
      <img className='img-fluid' src={banner} alt="" />
      </div>
      <div className="container">
        <h4>Company Overview</h4>
        <p> <span style={{color:"#038A5E"}} >Ohm Stays</span> is your all-in-one platform designed to enhance your travel and dining experiences, whether you're planning a vacation, booking a stay, or finding the perfect restaurant. With our comprehensive suite of services, including stays & hotels, restaurant reservations, and holiday packages, we aim to make your journey seamless and memorable.</p>
        <h4>Mission Statement</h4>
        <p>AT Ohm Stays our mission is to simplify travel and dining for everyone, offering a user-friendly platform that provides unparalleled convenience, value, and quality. We are dedicated to connecting our users with the best experiences, ensuring every trip and meal is extraordinary.</p>
        <h4>Our Services</h4>
        <h5 style={{color:"#038A5E"}} >Stays & Hotels</h5>
        <p>Discover and book accommodations that suit your style and budget. From luxury hotels to cozy bed-and-breakfasts,Ohm Stays offers a wide range of options to ensure you find the perfect place to stay.</p>
        <li>Wide Selection: Browse thousands of properties worldwide.</li>
        <li>Detailed Listings: Comprehensive details, high-quality photos, and real customer reviews.</li>
        <li>Easy Booking: Simple and secure booking process with instant confirmation.</li>
        <h4 style={{color:"#038A5E"}} className='mt-3' >Restaurants</h4>
        <h5>Find and reserve tables at top restaurants, whether you’re looking for a casual dining experience or a gourmet meal.</h5>
        <li>Diverse Choices: Explore a variety of cuisines and dining styles.</li>
        <li>Real-Time Reservations: Check availability and book in real-time.</li>
        <li>Customer Reviews: Read reviews and ratings from fellow diners to make informed choices.</li>
        <h4 style={{color:"#038A5E"}} className='mt-3' >Holiday Packages</h4>
        <h5>Plan your perfect getaway with curated holiday packages that combine accommodations, activities, and dining.</h5>
        <li>Curated Packages: Thoughtfully designed itineraries to suit different interests and budgets.</li>
        <li>Customizable Options: Tailor your holiday package to your preferences.</li>
        <li>Exclusive Deals: Access to special offers and discounts for a more affordable experience.</li>
        <h4 style={{color:"#038A5E"}} className='mt-3' >Core Values</h4>
        <li>Customer-Centric: Our users are at the heart of everything we do. We strive to exceed expectations and provide exceptional service.</li>
        <li>Quality and Trust: We partner with reputable establishments to ensure the highest quality standards.</li>
        <li>Innovation: We continuously improve our platform with the latest technology to offer the best user experience.</li>
        <h4 className='mt-3' >Our Team</h4>
        <p>Our dedicated team of travel and hospitality experts works tirelessly to bring you the best options and support your needs. From our experienced leadership to our passionate support staff, every team member is committed to making Ohm Stays your prefer#038A5E travel and dining companion.</p>
        <h4 className='mt-3' >Community and Sustainability</h4>
        <p>Ohm Staysbelieves in giving back to the community and promoting sustainable travel practices. We partner with local businesses and support eco-friendly initiatives to ensure a positive impact on the environment and local economies.</p>
        <h4 className='mt-3' >Vision for the Future</h4>
        <p>We envision Ohm Stays as the go-to platform for all travel and dining needs, continuously expanding our services and reaching new markets. Our goal is to keep innovating and providing our users with unparalleled convenience and unforgettable experiences.</p>
        <h4  className='mt-3' >Contact Us</h4>
        <p>We are here to assist you 24/7. For any inquiries or support, feel free to reach out to us via email, phone, or through our social media channels. Connect with us today and start exploring the world with Ohm Stays!</p>
      </div>
    </div>
  )
}

export default About
