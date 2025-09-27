import { API_URL } from "../config.js";

/**
 * @param {object} userData - { username, email, password }
 * @returns {Promise<Object>} - Returns registered user data along access token
 */

export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Registration Failed");
  }

  return data;
}

/**
 * Login a user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} - Returns login data with an access token
 */

export async function loginUser(email, password) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.errors?.[0]?.message || "Login Failed");
  }

  return data;
}
