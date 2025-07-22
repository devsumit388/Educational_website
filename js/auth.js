// js/auth.js

// Check if the user is logged in by checking localStorage
if (localStorage.getItem("loggedIn") !== "true") {
  // If not logged in, redirect to login page
  window.location.href = "login.html";
}
