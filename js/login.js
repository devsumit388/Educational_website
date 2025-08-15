// login.js

// js/login.js
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const correctEmail = "student@gmail.com";
  const correctPassword = "7ESTUDY";

  if (email === correctEmail && password === correctPassword) {
    localStorage.setItem("loggedIn", "true");
    alert("Login successful!");
    window.location.href = "index.html";
  } else {
    const errorMsg = document.getElementById("error-msg");
    errorMsg.style.color = "red";
    errorMsg.textContent = "Invalid email or password.";
  }
});
