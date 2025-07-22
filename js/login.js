// login.js

// js/login.js
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const correctEmail = "user@example.com";
  const correctPassword = "1a2b3c4d";

  if (email === correctEmail && password === correctPassword) {
    localStorage.setItem("loggedIn", "true");
    alert("Login successful!");
    window.location.href = "index3.html";
  } else {
    const errorMsg = document.getElementById("error-msg");
    errorMsg.style.color = "red";
    errorMsg.textContent = "Invalid email or password.";
  }
});
