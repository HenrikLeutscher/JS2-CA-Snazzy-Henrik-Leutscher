import { removeToken } from "./utils/storage.js";

// logout.js
export function logout() {
    removeToken();
    window.location.href = "index.html";
}

// Automatically attach logout to any button with id="logoutBtn"
document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", logout);
    }
});