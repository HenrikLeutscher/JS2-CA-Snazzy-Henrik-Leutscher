import { removeToken } from "./utils/storage.js";

// logout.js
export function logout() {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.disabled = true;
    logoutBtn.textContent = "Logging out...";
  }
  removeToken();
  setTimeout(() => {
    window.location.href = "index.html";
  }, 2000);
}

// Automatically attach logout to any button with id="logoutBtn"
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", logout);
  }
});
