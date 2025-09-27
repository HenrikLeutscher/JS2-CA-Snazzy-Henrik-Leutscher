import { getToken, getApiKey } from "./utils/storage.js";
import { POST_API_URL } from "./config.js";

/**
 * Delete Post by ID
 * @param {string} postId
 * @returns {Promise<boolean>}
 * @throws {Error} - Throws an error if deleting the post fails
 */

export async function deletePost(postId) {
  const token = getToken();
  const apiKey = getApiKey();
  const errorMessage = document.getElementById("error-message");

  const response = await fetch(`${POST_API_URL}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    errorMessage.textContent = `Failed to delete post: ${response.status} ${errorText}`;
    return false;
  }

  return true;
}
