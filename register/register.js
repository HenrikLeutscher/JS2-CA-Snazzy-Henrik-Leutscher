
import { errorMessage } from "./index.js"; // Importing errorMessage from index.js

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registerForm");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Get form data / values

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        // Email Clarification
        if (!email.endsWith("@stud.noroff.no")) {
            errorMessage.textContent = "Provided email must end with @stud.noroff.no";
            return;
        }

        // Password Matching Check

        if (password !== confirmPassword) {
            errorMessage.textContent = "Passwords do not match, please try again.";
            return;
        }

        // Getting data

        const userData = { name: username, email: email, password: password };

        // API Registering User below
    });

});