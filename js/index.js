import { loginUser } from "./api/auth.js";
import { saveToken, saveUser } from "./utils/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#loginForm");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Form Values
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const loginBtn = document.getElementById("loginBtn");

    if (!email || !password) {
      errorMessage.textContent = "Please make sure both fields are filled out.";
      return;
    }

    try {
      const loginResponse = await loginUser(email, password);

      const token = loginResponse.data.accessToken;
      saveToken(token);

      saveUser(loginResponse.data);

      loginBtn.disabled = true;
      loginBtn.textContent = "Logging in...";

      errorMessage.classList.remove("text-danger");
      errorMessage.classList.add("text-success");
      errorMessage.textContent = "Login successful! Redirecting...";

      setTimeout(() => {
        window.location.href = "feed.html";
      }, 2000);
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });
});
