from flask import Flask, jsonify, request
try:
    from flask_cors import CORS
    cors_available = True
except ImportError:
    cors_available = False
from posts import POSTS

app = Flask(__name__)
if cors_available:
    CORS(app)  # This will enable CORS for all routes
    print("CORS is enabled")
else:
    print("CORS is not available. Install with: pip install flask-cors")

# ------------------------------------------------------------------
# LIST POSTS - Get all blog posts with optional sorting
# ------------------------------------------------------------------
@app.route('/api/posts', methods=['GET'])
def list_posts():
    """
    Get all blog posts with optional sorting.
    
    Query Parameters:
        sort (string): Field to sort by ('title' or 'content')
        direction (string): Sort direction ('asc' or 'desc')
        
    Returns:
        JSON: List of all blog posts
    """
    sort = request.args.get('sort')
    direction = request.args.get('direction', 'asc')
    
    # If sort parameter is provided, sort the posts
    if sort in ['title', 'content']:
        if direction not in ['asc', 'desc']:
            return jsonify({"error": "Direction must be 'asc' or 'desc'"}), 400
        
        sorted_posts = sorted(POSTS, key=lambda x: x[sort], reverse=(direction == 'desc'))
        return jsonify(sorted_posts)
    
    # If no sort parameter or invalid sort parameter, return posts in original order
    return jsonify(POSTS)

# ------------------------------------------------------------------
# CREATE POST - Add a new blog post
# ------------------------------------------------------------------
@app.route('/api/posts', methods=['POST'])
def add_post():
    """
    Create a new blog post.
    
    Request Body:
        title (string): Title of the post (required)
        content (string): Content of the post (required)
        
    Returns:
        JSON: The created post with status code 201 (Created)
        or error message with status code 400 (Bad Request)
    """
    new_post = request.get_json()
    if 'title' not in new_post or 'content' not in new_post:
        return jsonify({"error": "Title and content are required."}), 400

    new_post['id'] = len(POSTS) + 1  # Simple ID generation
    POSTS.append(new_post)
    return jsonify(new_post), 201

# ------------------------------------------------------------------
# UPDATE POST - Update an existing blog post by ID
# ------------------------------------------------------------------
@app.route('/api/posts/<int:post_id>', methods=['PUT'])
def update_post(post_id):
    """
    Update an existing blog post by ID.
    
    Parameters:
        post_id (int): The ID of the post to update
        
    Request Body:
        title (string, optional): New title for the post
        content (string, optional): New content for the post
        
    Returns:
        JSON: The updated post
        or error message with status code 404 (Not Found)
    """
    post = next((p for p in POSTS if p['id'] == post_id), None)
    if post is None:
        return jsonify({"error": "Post not found."}), 404

    data = request.get_json()
    post['title'] = data.get('title', post['title'])
    post['content'] = data.get('content', post['content'])
    return jsonify(post)

# ------------------------------------------------------------------
# DELETE POST - Delete a blog post by ID
# ------------------------------------------------------------------
@app.route('/api/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id):
    """
    Delete a blog post by ID.
    
    Parameters:
        post_id (int): The ID of the post to delete
        
    Returns:
        JSON: Success message
        or error message with status code 404 (Not Found)
    """
    global POSTS
    post = next((p for p in POSTS if p['id'] == post_id), None)
    if post is None:
        return jsonify({"error": "Post not found."}), 404
        
    POSTS = [p for p in POSTS if p['id'] != post_id]
    return jsonify({"message": f"Post with id {post_id} has been deleted successfully."})

# ------------------------------------------------------------------
# SEARCH POSTS - Search for blog posts by title or content
# ------------------------------------------------------------------
@app.route('/api/posts/search', methods=['GET'])
def search_posts():
    """
    Search for blog posts by title or content.
    
    Query Parameters:
        title (string, optional): Search term for post titles
        content (string, optional): Search term for post contents
        
    Returns:
        JSON: List of matching blog posts
    """
    title_query = request.args.get('title', '')
    content_query = request.args.get('content', '')
    
    results = []
    for post in POSTS:
        if (title_query and title_query.lower() in post['title'].lower()) or \
           (content_query and content_query.lower() in post['content'].lower()):
            results.append(post)
    
    return jsonify(results)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5002, debug=True)
