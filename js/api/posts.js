import { getToken, getApiKey } from "../utils/storage.js";
import { API_KEY, POST_API_URL } from "../config.js";

export async function getPosts() {
  const accessToken = getToken();
  if (!accessToken) throw new Error("Please log in to view posts");

  const response = await fetch(`${POST_API_URL}?_author=true`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.json();
    throw new Error(`Failed to fetch posts: ${response.status} ${text}`);
  }

  return await response.json();
}

/**
 * Create post
 * @param {object} postData - Data of the input fields for the new post
 * @returns {Promise<Object>} - Creates a new post and returns the created post data
 * @throws {Error} - Throws an error if creating the post fails
 * @example
 * ```js
 * const newPost = { title: "My New Post", body: "This is the content of my new post.", media: { url: "https://example.com/image.jpg" } };
 * const wasCreated = await createPost(newPost);
 * // Expect wasCreated to return the created post object
 * // Expect wasCreated to be false if the post creation failed
 * ```
 */

export async function createPost(postData) {
  const token = getToken();
  const apiKey = getApiKey();

  if (!token) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = "Please login to create a post";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
    return;
  }

  const response = await fetch(POST_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    return false;
  }

  const { data } = await response.json();
  return data;
}

export function postClick() {
  const postElements = document.querySelectorAll(".post");
  postElements.forEach((postEl) => {
    postEl.addEventListener("click", () => {
      const postId = postEl.getAttribute("data-id");
      window.location.href = `feedposts.html?id=${postId}`;
    });
  });
}
