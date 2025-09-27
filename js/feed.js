import { getPosts } from "./api/posts.js";
import { postClick } from "./api/posts.js";

document.addEventListener("DOMContentLoaded", async () => {
  const feedContainer = document.getElementById("feed");
  const searchInput = document.getElementById("searchInput");

  try {
    const posts = await getPosts();
    function displayPosts(postList) {
      feedContainer.innerHTML = postList
        .map(
          (post) => `
            <div class="post m-2 p-3 w-50 col mx-auto cursor-pointer Feed-Card" data-id="${
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
                        }" class="img-thumbnail rounded mt-3 Post-Image w-100" />`
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
    const resultCount = document.getElementById("resultCount");
    
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        const filtered = posts.data.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.body.toLowerCase().includes(query)
        );
        displayPosts(filtered);

        if (resultCount) {
          resultCount.textContent = `${filtered.length} post(s) matches your search`;
        }
      });
    }
  } catch (error) {
    feedContainer.textContent = `Failed to load posts. ${error.message}`;
  }

  const backToTopBtn = document.getElementById("goBackToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.remove("d-none");
    } else {
      backToTopBtn.classList.add("d-none");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0});
  });
});
