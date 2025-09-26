import { getToken, getApiKey, getUser } from "./utils/storage.js";
import { POST_API_URL } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
    const token = getToken();
    const loggedInUser = getUser();
    const params = new URLSearchParams(window.location.search);
    const postId = params.get("id");

    const form = document.getElementById("editForm");
    const titleInput = document.getElementById("title");
    const bodyInput = document.getElementById("body");
    const imageUrlInput = document.getElementById("imageUrl");
    const imagePreviewContainer = document.getElementById("imagePreviewContainer");
    const previewImage = document.getElementById("imagePreview");

    const errorMessage = document.getElementById("error-message");

    if (!postId) {
        errorMessage.textContent = "No post ID provided.";
        return;
    }

    try {
        const response = await fetch(`${POST_API_URL}/${postId}?_author=true`, {
            headers: {
                authorization: `Bearer ${token}`,
                "X-Noroff-API-Key": getApiKey(),
                "Content-Type": "application/json",
            },
        });

        const resData = await response.json();
        const post = resData.data;

        // If you are author, you can edit
        if (loggedInUser.name !== post.author.name) {
            errorMessage.textContent = "You are not authorized to edit this post.";
            form.style.display = "none";
            return;
        }

        // Form Prefilling
        titleInput.value = post.title;
        imageUrlInput.value = post.media?.url || "";
        bodyInput.value = post.body;

        if (post.media?.url) {
            previewImage.src = post.media.url;
            imagePreviewContainer.classList.remove("d-none");
        }

        // Image Preview
        imageUrlInput.addEventListener("input", () => {
            if (imageUrlInput.value) {
                previewImage.src = imageUrlInput.value;
                imagePreviewContainer.classList.remove("d-none");
            } else {
                imagePreviewContainer.classList.add("d-none");
            }
        });

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const updatedPost = {
                title: titleInput.value,
                body: bodyInput.value,
                media: imageUrlInput.value ? { url: imageUrlInput.value, alt: titleInput.value } : null,
            };

            try {
                const updateResponse = await fetch(`${POST_API_URL}/${postId}`, {
                    method: "PUT",
                    headers: {
                        authorization: `Bearer ${token}`,
                        "X-Noroff-API-Key": getApiKey(),
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedPost),
                });

                if (!updateResponse.ok) {
                    throw new Error("Failed to update post");
                }

                errorMessage.classList.remove("text-danger");
                errorMessage.classList.add("text-success");
                errorMessage.textContent = "Post updated successfully!";
                setTimeout(() => {
                    window.location.href = `feedposts.html?id=${postId}`;
                }, 3000);
            } catch (error) {
                console.error("Error updating post:", error);
            }
        });
    } catch (error) {
        errorMessage.textContent = `Error fetching post: ${error.message}`;
    }
});