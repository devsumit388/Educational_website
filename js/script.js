alert("js loaded success");
// Wait for everything to load before running JS
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const errorMsg = document.getElementById("error-msg");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // prevent page from refreshing

    const userEmail = "user@example.com";
    const userPassword = "1a2b3c4d";

    const enteredEmail = email.value.trim();
    const enteredPassword = password.value;

    // Password must be at least 6 characters and include letters and numbers
    const passwordValid = /^(?=.*[a-zA-Z])(?=.*\d).{6,}$/.test(enteredPassword);

    if (!passwordValid) {
      errorMsg.style.color = "red";
      errorMsg.textContent =
        "Password must be at least 6 characters and include letters and numbers.";
      return;
    }

    if (enteredEmail === userEmail && enteredPassword === userPassword) {
      errorMsg.style.color = "green";
      errorMsg.textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        window.location.href = "index3.html"; // redirect after 1s
      }, 1000);
    } else {
      errorMsg.style.color = "red";
      errorMsg.textContent = "Invalid email or password. Try again.";
    }
  });
});



window.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("loggedIn");

  const startBtn = document.getElementById("start-learning-btn");
  const afterLoginBtns = document.getElementById("after-login-buttons");

  if (isLoggedIn) {
    if (startBtn) startBtn.style.display = "none";
    if (afterLoginBtns) afterLoginBtns.style.display = "block";
  }
});
