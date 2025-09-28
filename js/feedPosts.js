import { getToken, getApiKey, getUser } from "./utils/storage.js";
import { deletePost } from "./deletePost.js";
import { POST_API_URL } from "./config.js";

/**
 * Fetch a single post by ID
 * @param {number} postId
 * @returns {Promise<{Object}>} - Returns the post data for the provided postId
 * @example
 * ```js
 * const postId = 12345;
 * const wasFetched = await getSinglePost(postId);
 * // Expect wasFetched to return false if not found
 * // Expect wasFetched to return post data if found
 * ```
 */
async function getSinglePost(postId) {
  const token = getToken();
  const apiKey = getApiKey();

  const response = await fetch(`${POST_API_URL}/${postId}?_author=true`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return false;
  }

  const { data } = await response.json();
  return data;
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");
  const feedPost = document.getElementById("feedPost");

  if (!postId) {
    feedPost.innerHTML = `
      <div class="alert alert-danger">❌ No post ID provided</div>
    `;
    return;
  }

  try {
    const post = await getSinglePost(postId);
    document.title = `${post.title || "Post"} - Snazzy`;

    const loggedInUser = getUser();
    const isAuthor = loggedInUser && loggedInUser.name === post.author?.name;

    feedPost.innerHTML = `
      <div class="card shadow-sm w-100 mx-auto m-2 p-3 Feed-Card">
        <div class="card-body">
          <h6 class="card-subtitle mb-2 text-muted">
            <a href="viewProfile.html?username=${post.author?.name}">@${
      post.author?.name
    }</a>
          </h6>
          <h1 class="card-title">${post.title}</h1>
          ${
            post.media?.url
              ? `<img src="${post.media.url}" alt="${
                  post.media.alt || "Post image"
                }" class="img-thumbnail rounded mt-3 Specific-Post-Image" />`
              : ""
          }
          <p class="card-text">${post.body}</p>
          <p class="card-subtitle text-muted small mt-3">
            Date Posted: ${new Date(
              post.created
            ).toLocaleDateString()} <br> Time Posted: ${new Date(
      post.created
    ).toLocaleTimeString()}
          </p>
          <div>
            ${
              isAuthor
                ? `
              <a href="editPost.html?id=${post.id}">
              <button class="btn btn-primary mt-3 fixed" id="EditPostBtn">Edit</button>
              </a>`
                : ""
            }
            ${
              isAuthor
                ? `<button class="btn btn-danger mt-3 fixed" id="deletePostBtn">Delete</button>`
                : ""
            }
          </div>
          <p id="error-message" class="text-danger text-center"></p>
        </div>
      </div>
    `;

    const errorMessage = document.getElementById("error-message");

    if (isAuthor) {
      document
        .getElementById("deletePostBtn")
        .addEventListener("click", async () => {
          deletePostBtn.disabled = true;
          deletePostBtn.textContent = "Deleting...";
          try {
            await deletePost(postId);
            errorMessage.classList.remove("text-danger");
            errorMessage.classList.add("text-success");
            errorMessage.textContent = "Post deleted successfully";
            setTimeout(() => {
              window.location.href = "feed.html";
            }, 3000);
          } catch (error) {
            errorMessage.textContent = `Failed to delete post: ${error.message}`;
          }
        });
    }
  } catch (error) {
    feedPost.innerHTML = `
      <div class="alert alert-danger">${error.message}</div>
    `;
  }
});
