import { getToken, getApiKey } from "../utils/storage.js";
import { API_KEY, POST_API_URL } from "../config.js";

export async function getPosts() {
    const accessToken = getToken();
    if (!accessToken) throw new Error("Please log in to view posts");

    const response = await fetch(`${POST_API_URL}?_author=true`, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "X-Noroff-API-Key": API_KEY,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        const text = await response.json();
        throw new Error(`Failed to fetch posts: ${response.status} ${text}`);
    }

    return await response.json();
}

/**
 * Create post
 * @param {object} postData
 * @returns {Promise<Object>}
 */

export async function createPost(postData) {
    const token = getToken();
    const apiKey = getApiKey();

    if (!token) {
        errorMessage.textContent = "Please login to create a post";
        setTimeout(() => {
            window.location.href = "index.html";
        }, 3000);
        return;
    }

    const response = await fetch(POST_API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "X-Noroff-API-Key": apiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
    });

    if (!response.ok) {
        errorMessage.textContent = "Failed to create post. Please try again.";
        throw new Error(`Failed to create post: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
}