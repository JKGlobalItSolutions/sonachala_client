document.addEventListener("DOMContentLoaded", function() {
    // Initialize Flatpickr for date selection
    flatpickr("#dates", {
        dateFormat: "Y-m-d",
        mode: "range"
    });

    // Toggle guests dropdown visibility
    document.getElementById('guests').addEventListener('click', function () {
        var dropdown = document.getElementById('guestsDropdown');
        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
    });

    // Add event listeners for incrementing and decrementing adults, children, and rooms
    document.getElementById('adults-plus').addEventListener('click', function() {
        incrementValue('adults');
    });

    document.getElementById('adults-minus').addEventListener('click', function() {
        decrementValue('adults');
    });

    document.getElementById('children-plus').addEventListener('click', function() {
        incrementValue('children');
    });

    document.getElementById('children-minus').addEventListener('click', function() {
        decrementValue('children');
    });

    document.getElementById('rooms-plus').addEventListener('click', function() {
        incrementValue('rooms');
    });

    document.getElementById('rooms-minus').addEventListener('click', function() {
        decrementValue('rooms');
    });
});

// Function to increment the input value
function incrementValue(inputId) {
    var input = document.getElementById(inputId);
    var currentValue = parseInt(input.value);
    input.value = currentValue + 1;
    updateGuests();
}

// Function to decrement the input value with a minimum of 0
function decrementValue(inputId) {
    var input = document.getElementById(inputId);
    var currentValue = parseInt(input.value);
    if (currentValue > 0) {
        input.value = currentValue - 1;
        updateGuests();
    }
}

// Function to update the "Adults, Children & Rooms" input
function updateGuests() {
    var adults = document.getElementById('adults').value;
    var children = document.getElementById('children').value;
    var rooms = document.getElementById('rooms').value;
    var guests = "Adults: " + adults + ", Children: " + children + ", Rooms: " + rooms;
    document.getElementById('guests').value = guests;
}

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCp2e7CNo83HwDx_HAVgY_IDh0_KW2Y0HI",
  authDomain: "y-spot-e84ca.firebaseapp.com",
  databaseURL: "https://y-spot-e84ca-default-rtdb.firebaseio.com",
  projectId: "y-spot-e84ca",
  storageBucket: "y-spot-e84ca.appspot.com",
  messagingSenderId: "783996806068",
  appId: "1:783996806068:web:298ca1ddb4dfb7e758c8e1",
  measurementId: "G-TSH2JVYJHR"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

window.onload = () => {
  const userDetailsContainer = document.getElementById("userDetailsContainer");
  const registerLink = document.getElementById("registerLink");
  const loginLink = document.getElementById("loginLink");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userDetailsContainer.style.display = "block";
      registerLink.style.display = "none";
      loginLink.style.display = "none";
      document.getElementById("userName").textContent = user.displayName || "User";
    } else {
      userDetailsContainer.style.display = "none";
      registerLink.style.display = "block";
      loginLink.style.display = "block";
    }
  });
};

document.getElementById('logoutButton').addEventListener('click', function () {
  signOut(auth).then(() => {
    alert('Logged out successfully');
    // Hide user details and show register and login links
    document.getElementById("userDetailsContainer").style.display = "none";
    document.getElementById("registerLink").style.display = "block";
    document.getElementById("loginLink").style.display = "block";
    // Redirect to login page or home page after logout
    window.location.href = './login/index.html';
  }).catch((error) => {
    console.error('Error logging out: ', error);
    alert('Error logging out. Please try again.');
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const fetchContent = async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.text();
  };

  const loadContent = async () => {
    try {
      const [headerData, footerData] = await Promise.all([
        fetchContent('includes/header.html'),
        fetchContent('includes/footer.html')
      ]);

      document.getElementById('included-header').innerHTML = headerData;
      document.getElementById('included-footer').innerHTML = footerData;
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  loadContent();
});
