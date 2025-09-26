import { getToken, getApiKey, getUser, saveUser } from "./utils/storage.js";
import { PROFILES_API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const profileContainer = document.getElementById("profileContainer");
  const token = getToken();
  const user = getUser();

  if (!token || !user) {
    profileContainer.innerHTML = `<p class="text-center">You must be logged in to view your profile.</p>`;
    return;
  }

  const username = user.name;

  try {
    // Fetch profile data
    const response = await fetch(`${PROFILES_API_URL}/${username}?_followers=true&_following=true&_posts=true`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": getApiKey(),
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to fetch profile");
    const { data } = await response.json();

    profileContainer.innerHTML = `
      <div class="card shadow-sm w-100 mx-auto m-2 p-3">
        ${data.banner?.url ? `<img src="${data.banner.url}" alt="${data.banner.alt}" class="img-fluid mb-3 rounded Profile-Banner">` : ""}
        <div class="d-flex align-items-center mb-3">
          ${data.avatar?.url ? `<img src="${data.avatar.url}" alt="${data.avatar.alt}" class="rounded-circle me-3 Profile-Avatar">` : ""}
          <div>
            <h2>${data.name}</h2>
            <p>Email: ${data.email}</p>
          </div>
        </div>
        <p><strong>Bio:</strong> ${data.bio || "No bio has been provided"}</p>
        <p><strong>Followers:</strong> ${data._count.followers}</p>
        <p><strong>Following:</strong> ${data._count.following}</p>
        <p><strong>Total Posts:</strong> ${data._count.posts}</p>
        <hr>
        
        <h3>Edit Your Profile:</h3>
        <form id="editProfileForm" class="d-flex flex-column gap-2">
          <label>Bio:</label>
          <textarea id="editBio" class="form-control" rows="3">${data.bio || ""}</textarea>

          <label>Avatar URL:</label>
          <input type="url" id="editAvatar" class="form-control" value="${data.avatar?.url || ""}">

          <label>Banner URL:</label>
          <input type="url" id="editBanner" class="form-control" value="${data.banner?.url || ""}">

          <button type="submit" class="btn btn-primary mt-2">Save Changes</button>
          <p id="editMessage" class="text-center mt-2"></p>
        </form>

        <hr>
        <h3>Posts</h3>
        <div id="userPosts">
          ${data.posts && data.posts.length
            ? data.posts.map(post => `
              <div class="card mb-2 p-2">
                <h5>${post.title}</h5>
                <p>${post.body}</p>
                ${post.media?.url ? `<img src="${post.media.url}" alt="${post.media.alt}" class="img-thumbnail rounded mt-2 Specific-Post-Image" />` : ""}
                <p class="text-muted small">Created: ${new Date(post.created).toLocaleDateString()}</p>
              </div>
            `).join("")
            : "<p>No posts yet.</p>"
          }
        </div>
      </div>
    `;

    // Handle profile update
    const editForm = document.getElementById("editProfileForm");
    const editMessage = document.getElementById("editMessage");

    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      editMessage.textContent = "";

      // Only send editable fields
      const updatedProfile = {
        bio: document.getElementById("editBio").value,
        avatar: { url: document.getElementById("editAvatar").value },
        banner: { url: document.getElementById("editBanner").value },
      };

      try {
        const res = await fetch(`${PROFILES_API_URL}/${username}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": getApiKey(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProfile),
        });

        if (!res.ok) throw new Error("Failed to update profile");

        const { data: newData } = await res.json();
        editMessage.classList.remove("text-danger");
        editMessage.classList.add("text-success");
        editMessage.textContent = "Profile updated successfully!";

        // Update local storage
        saveUser(newData);

        // Refresh to show updated data
        setTimeout(() => location.reload(), 1000);
      } catch (err) {
        editMessage.classList.remove("text-success");
        editMessage.classList.add("text-danger");
        editMessage.textContent = `Error updating profile: ${err.message}`;
      }
    });

  } catch (err) {
    console.error(err);
    profileContainer.innerHTML = `<p class="text-center text-danger">Error loading profile: ${err.message}</p>`;
  }
});
