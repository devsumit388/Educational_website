function logout() {
  localStorage.removeItem("loggedIn");
  alert("Logged out successfully!");
  window.location.href = "login.html";
}
