// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuzymeZYu59a917I2klJTO-32k3Pi-Pbo",
  authDomain: "inclusisphere-49199.firebaseapp.com",
  databaseURL: "https://inclusisphere-49199-default-rtdb.firebaseio.com",
  projectId: "inclusisphere-49199",
  storageBucket: "inclusisphere-49199.firebasestorage.app",
  messagingSenderId: "103984352021",
  appId: "1:103984352021:web:6d363a79dd790d0e52f71c",
  measurementId: "G-CKNSDT1ZGB"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference the database
const loginDB = firebase.database().ref("logins");

// Get DOM elements
const memberBtn = document.getElementById("memberBtn");
const volunteerBtn = document.getElementById("volunteerBtn");
const loginForm = document.getElementById("loginForm");

// Role button toggle logic
memberBtn.addEventListener("click", () => {
  memberBtn.classList.add("active");
  volunteerBtn.classList.remove("active");
});

volunteerBtn.addEventListener("click", () => {
  volunteerBtn.classList.add("active");
  memberBtn.classList.remove("active");
});

// Form submit handler
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = getElementVal("email");
  const password = getElementVal("password");
  const role = volunteerBtn.classList.contains("active") ? "Volunteer" : "Member";

  // Save login attempt in Firebase (optional)
  saveLogin(email, password, role);

  // Redirect based on role
  if (role === "Volunteer") {
    window.location.href = "volunteer.html";
  } else {
    window.location.href = "memberssss.html";
  }

  // Reset form
  loginForm.reset();
});

// Save login data to Firebase Realtime DB
const saveLogin = (email, password, role) => {
  const newLogin = loginDB.push();
  newLogin.set({
    email: email,
    password: password,
    role: role,
    timestamp: new Date().toISOString()
  });
};

// Helper function to get field values
const getElementVal = (id) => {
  return document.getElementById(id).value;
};
