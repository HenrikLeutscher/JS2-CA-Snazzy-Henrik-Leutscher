import { getToken, getApiKey, getUser } from "./utils/storage.js";
import { PROFILES_API_URL } from "./config.js";
import { postClick } from "./api/posts.js";

document.addEventListener("DOMContentLoaded", async () => {
  const profileContainer = document.getElementById("profileContainer");
  const token = getToken();
  const loggedInUser = getUser();

  if (!token || !loggedInUser) {
    profileContainer.innerHTML = `<p class="text-center">You must be logged in to view profiles.</p>`;
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const username = params.get("username");

  if (!username) {
    profileContainer.innerHTML = `<p class="text-center">No username provided.</p>`;
    return;
  }

  try {
    const res = await fetch(
      `${PROFILES_API_URL}/${username}?_followers=true&_following=true&_posts=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": getApiKey(),
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch profile");
    const { data } = await res.json();

    let isFollowing = data.followers.some(
      (follower) => follower.name === loggedInUser.name
    );

    profileContainer.innerHTML = `
      <div class="card shadow-sm w-100 mx-auto m-2 p-3">
        ${
          data.banner?.url
            ? `<img src="${data.banner.url}" alt="${data.banner.alt}" class="img-fluid mb-3 rounded Profile-Banner">`
            : ""
        }
        <div class="d-flex align-items-center mb-3">
          ${
            data.avatar?.url
              ? `<img src="${data.avatar.url}" alt="${data.avatar.alt}" class="rounded-circle me-3 Profile-Avatar">`
              : ""
          }
          <div>
            <h2>${data.name}</h2>
            <p>${data.email}</p>
            ${
              username !== loggedInUser.name
                ? `<button class="btn btn-primary" id="followBtn">${
                    isFollowing ? "Unfollow" : "Follow"
                  }</button>`
                : ""
            }

          </div>
        </div>
        <p><strong>Bio:</strong> ${data.bio || "No bio provided"}</p>
        <p><strong>Followers:</strong> ${data._count.followers}</p>
        <p><strong>Following:</strong> ${data._count.following}</p>
        <p><strong>Total Posts:</strong> ${data._count.posts}</p>
        <hr>
        <h3>Posts</h3>
        <div id="userPosts">
          ${
            data.posts && data.posts.length
              ? data.posts
                  .map(
                    (post) => `
              <div class="card mb-2 p-2 cursor-pointer Feed-Card post" data-id="${post.id}">
                <h5>${post.title}</h5>
                ${
                  post.media?.url
                    ? `<img src="${post.media.url}" alt="${post.media.alt}" class="img-thumbnail rounded mt-2 Specific-Post-Image" />`
                    : ""
                }
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
                  .join("")
              : "<p>No posts yet.</p>"
          }
        </div>
      </div>
    `;
    document.title = `${data.name || "Profile"} - Snazzy`;

    postClick();

    const followBtn = document.getElementById("followBtn");
    if (followBtn) {
      followBtn.classList.toggle("btn-danger", isFollowing);
      followBtn.classList.toggle("btn-primary", !isFollowing);
      followBtn.addEventListener("click", async () => {
        const action = isFollowing ? "unfollow" : "follow";
        try {
          const response = await fetch(
            `${PROFILES_API_URL}/${username}/${action}`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": getApiKey(),
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) throw new Error(`Failed to ${action} user`);

          isFollowing
            ? (followBtn.textContent = "Follow")
            : (followBtn.textContent = "Unfollow");
          isFollowing = !isFollowing;

          location.reload();
        } catch (err) {
          console.log(err.message);
        }
      });
    }
  } catch (err) {
    profileContainer.innerHTML = `<p class="text-center text-danger">Error loading profile: ${err.message}</p>`;
  }
});
