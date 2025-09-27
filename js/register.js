// js/register.js
import { registerUser } from "./api/auth.js";
import { saveToken } from "./utils/storage.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#registerForm");
  const errorMessage = document.getElementById("error-message");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Form Values
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const registerBtn = document.getElementById("registerBtn");

    const userData = {
      name: username,
      email: email,
      password: password,
    };

    // Makes sure Email is as intended
    if (!email.endsWith("@stud.noroff.no")) {
      errorMessage.textContent = "Provided email must end with @stud.noroff.no";
      return;
    }

    // Double password check, ensuring password is written correctly
    if (password !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match, please try again.";
      return;
    }

    if (!username || !email || !password || !confirmPassword) {
      errorMessage.textContent = "Please make sure all fields are filled out.";
      return;
    }

    try {
      const data = await registerUser(userData);
      saveToken(data.accessToken);
      registerBtn.disabled = true;
      registerBtn.textContent = "Registering...";
      errorMessage.classList.remove("text-danger");
      errorMessage.classList.add("text-success");
      errorMessage.textContent = "Registration successful! Redirecting...";
      setTimeout(() => (window.location.href = "feed.html"), 3000);
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });
});
