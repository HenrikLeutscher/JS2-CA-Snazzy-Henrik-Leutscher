import { createPost } from "./api/posts.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("createForm");
  const errorMessage = document.getElementById("error-message");
  const imgUrlInput = document.getElementById("imageUrl");
  const imgPreview = document.getElementById("imagePreview");
  const imgPreviewContainer = document.getElementById("imagePreviewContainer");

  imgUrlInput.addEventListener("input", () => {
    const url = imgUrlInput.value;
    if (url) {
      imgPreview.src = url;
      imgPreviewContainer.classList.remove("d-none");
    } else {
      imgPreview.src = "";
      imgPreview.alt = "Image preview will be displayed here";
    }
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("title").value;
    const imgUrl = document.getElementById("imageUrl").value;
    const body = document.getElementById("body").value;
    const publishBtn = document.getElementById("publishBtn");
    publishBtn.disabled = true;
    publishBtn.textContent = "Publishing...";

    if (!title || !body) {
      errorMessage.textContent =
        "Please add a title and body text to your post.";
      return;
    }

    const postData = {
      title,
      media: imgUrl ? { url: imgUrl, alt: "Post Image" } : undefined,
      body,
    };

    try {
      const newPost = await createPost(postData);
      errorMessage.classList.remove("text-danger");
      errorMessage.classList.add("text-success");
      errorMessage.textContent = `Post created successfully: "${newPost.title}"`;

      form.reset();
      setTimeout(() => {
        window.location.href = "feed.html";
      }, 3000);
    } catch (err) {
      errorMessage.textContent = err.message;
    }
  });
});
