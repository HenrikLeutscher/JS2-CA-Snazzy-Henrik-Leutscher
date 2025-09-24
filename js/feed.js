import { getPosts } from "./api/posts.js";

document.addEventListener("DOMContentLoaded", async () => {
  const feedContainer = document.getElementById("feed");

  function postClick() {
    const postElements = document.querySelectorAll(".post");
    postElements.forEach((postEl) => {
      postEl.addEventListener("click", () => {
        const postId = postEl.getAttribute("data-id");
        window.location.href = `feedposts.html?id=${postId}`;
      });
    });
  }

  try {
    const posts = await getPosts();
    feedContainer.innerHTML = posts.data
      .map(
        (post) => `
            <div class="post m-2 p-3 border w-100 mx-auto cursor-pointer" data-id="${
              post.id
            }">
                <h6 class="card-subtitle mb-2 text-muted">@${post.author?.name || "Unknown User"}</h6>
                <h2>${post.title}</h2>
                <picture>
                  ${
                    post.media?.url
                      ? `<img src="${post.media.url}" alt="${
                          post.media.alt || "Post image"
                        }" class="img-thumbnail rounded mt-3" />`
                      : ""
                  }
                </picture>
                <p>${post.body}</p>
                <p class="card-subtitle text-muted small mt-3">
                  Publish Date: ${new Date(post.created).toLocaleDateString()}
                </p>
            </div>
        `
      )
      .join("");

    // Post click event
    postClick();
  } catch (error) {
    console.error(error);
    feedContainer.textContent = "Failed to load posts.";
  }
});
