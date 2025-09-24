import { getToken, getApiKey } from "./utils/storage.js";

const POST_API_URL = "https://v2.api.noroff.dev/social/posts";

/**
 * Fetch a single post by ID
 * @param {string} postId
 * @returns {Promise<Object>}
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
    const errorText = await response.text();
    throw new Error(`Failed to fetch post: ${response.status} ${errorText}`);
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
    console.log(post);
    feedPost.innerHTML = `
      <div class="card shadow-sm w-100 mx-auto m-2 p-3">
        <div class="card-body">
          <h6 class="card-subtitle mb-2 text-muted">@${post.author?.name || "Unknown User"}</h6>
          <h3 class="card-title">${post.title}</h3>
          ${
            post.media?.url
              ? `<img src="${post.media.url}" alt="${post.media.alt || "Post image"}" class="img-thumbnail rounded mt-3" />`
              : ""
          }
          <p class="card-text">${post.body}</p>
          <p class="card-subtitle text-muted small mt-3">
            Publish Date: ${new Date(post.created).toLocaleDateString()}
          </p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error(error);
    feedPost.innerHTML = `
      <div class="alert alert-danger">${error.message}</div>
    `;
  }
});
