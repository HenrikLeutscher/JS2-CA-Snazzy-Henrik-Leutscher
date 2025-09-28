import { getToken, getApiKey } from "./utils/storage.js";
import { POST_API_URL } from "./config.js";

/**
 * Delete Post by ID
 * @param {number} postId - Deletes a post based of its given ID
 * @returns {Promise<boolean>} - Returns true if deletion was successful, otherwise false
 * @example
 * // Delete a post by its ID, in this case: 12345 and handle its result
 * ```js
 * const postId = 12345;
 * const wasDeleted = await deletePost(postId);
 * // Expect wasDeleted to be true if deletion was successful
 * // Expect wasDeleted to be false if deletion failed
 * ```
 */

export async function deletePost(postId) {
  const token = getToken();
  const apiKey = getApiKey();

  const response = await fetch(`${POST_API_URL}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return false;
  }

  return true;
}
