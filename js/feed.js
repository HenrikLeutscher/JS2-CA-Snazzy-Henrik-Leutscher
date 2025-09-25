import { getPosts } from "./api/posts.js";

document.addEventListener("DOMContentLoaded", async () => {
  const feedContainer = document.getElementById("feed");
  const searchInput = document.getElementById("searchInput");

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
    console.log("Fetched posts:", posts);
    function displayPosts(postList) {
      feedContainer.innerHTML = postList
        .map(
          (post) => `
            <div class="post m-2 p-3 w-100 mx-auto cursor-pointer Feed-Card" data-id="${
              post.id
            }">
                <h6 class="card-subtitle mb-2 text-muted">
                <a href="viewProfile.html?username=${post.author?.name}">@${
            post.author?.name
          }</a>
                </h6>
                <h2>${post.title}</h2>
                <picture>
                  ${
                    post.media?.url
                      ? `<img src="${post.media.url}" alt="${
                          post.media.alt || "Post image"
                        }" class="img-thumbnail rounded mt-3 w-25" />`
                      : ""
                  }
                </picture>
                <p>${post.body}</p>
                <p class="card-subtitle text-muted small mt-3">
                  Date Posted: ${new Date(
                    post.created
                  ).toLocaleDateString()} <br> Time Posted: ${new Date(
            post.created
          ).toLocaleTimeString()}
                </p>
            </div>
        `
        )
        .join("");

      postClick();
    }

    displayPosts(posts.data);

    // Filter posts when inputting in search input
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = posts.data.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.body.toLowerCase().includes(query)
        );
        displayPosts(filtered);
      });
    }
  } catch (error) {
    console.error(error);
    feedContainer.textContent = "Failed to load posts.";
  }
});
