// Function to load posts from API
async function loadPosts(sortField = '', sortDirection = '') {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    let url = `${apiBaseUrl}/posts`;
    
    // Add sorting parameters if provided
    if (sortField) {
        url += `?sort=${sortField}&direction=${sortDirection}`;
    }
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const posts = await response.json();
        displayPosts(posts);
        hideError(); // Hide any previous errors
    } catch (error) {
        console.error('Error loading posts:', error);
        showError('Error loading posts. Check console for details.');
    }
}

// Function to apply sorting based on user selection
function applySorting() {
    const sortField = document.getElementById('sort-field').value;
    const sortDirection = document.getElementById('sort-direction').value;
    
    if (sortField) {
        loadPosts(sortField, sortDirection);
    } else {
        loadPosts();
    }
}

// Function to add a new post
async function addPost() {
    const title = document.getElementById('post-title').value;
    const content = document.getElementById('post-content').value;
    const apiBaseUrl = document.getElementById('api-base-url').value;

    // Clear any previous errors
    hideError();

    try {
        const response = await fetch(`${apiBaseUrl}/posts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                title: title || undefined, 
                content: content || undefined 
            })
        });

        // If response is not ok, parse the error JSON
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error adding post:', errorData);
            showError(`Error (${response.status}): ${errorData.error || 'Unknown error'}`);
            return;
        }

        const result = await response.json();
        console.log('Post added:', result);
        
        // Clear the form
        document.getElementById('post-title').value = '';
        document.getElementById('post-content').value = '';
        
        // Reload posts
        loadPosts();
    } catch (error) {
        console.error('Error adding post:', error);
        showError('Error adding post. Check console for details.');
    }
}

// Function to delete a post
async function deletePost(postId) {
    const apiBaseUrl = document.getElementById('api-base-url').value;
    if (confirm('Are you sure you want to delete this post?')) {
        try {
            const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                const errorData = await response.json();
                showError(`Error (${response.status}): ${errorData.error || 'Unknown error'}`);
                return;
            }

            const result = await response.json();
            console.log('Post deleted:', result);
            
            // Reload posts
            loadPosts();
        } catch (error) {
            console.error('Error deleting post:', error);
            showError('Error deleting post. Check console for details.');
        }
    }
}

/*
// Function to test delete error handling - Commented out as not part of original requirements
async function testDeleteErrorHandling() {
    const postId = document.getElementById('nonexistent-post-id').value;
    const apiBaseUrl = document.getElementById('api-base-url').value;
    
    try {
        const response = await fetch(`${apiBaseUrl}/posts/${postId}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        
        if (!response.ok) {
            showError(`Status: ${response.status}, Error: ${data.error || 'Unknown error'}`);
            console.log('Full error response:', data);
        } else {
            showError(`Expected an error but got status ${response.status}: ${JSON.stringify(data)}`);
        }
    } catch (error) {
        console.error('Error testing delete:', error);
        showError('Error during test. Check console for details.');
    }
}
*/

// Function to display error messages
function showError(message) {
    const errorDisplay = document.getElementById('error-display');
    errorDisplay.textContent = message;
    errorDisplay.style.display = 'block';
}

// Function to hide error messages
function hideError() {
    const errorDisplay = document.getElementById('error-display');
    errorDisplay.style.display = 'none';
}

// Function to display posts
function displayPosts(posts) {
    const container = document.getElementById('post-container');
    container.innerHTML = '';

    if (posts.length === 0) {
        container.innerHTML = '<p>No posts available</p>';
        return;
    }

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.content}</p>
            <button onclick="deletePost(${post.id})">Delete</button>
        `;
        container.appendChild(postElement);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Try to load posts on page load with default API URL
    loadPosts();
});


