# Blog API

A RESTful blog API built with Flask that allows for creating, reading, updating, and deleting blog posts, with advanced features like search and sorting.

## Project Overview

This project implements a complete blog management system with a Flask backend API and a simple frontend interface. It demonstrates RESTful API design principles and Client-Server architecture with cross-origin requests.

### Features

- **RESTful API Endpoints**: Full CRUD functionality for blog posts
- **Search Capability**: Filter posts by title or content
- **Sorting**: Order posts by title or content (ascending/descending)
- **Error Handling**: Proper HTTP status codes and error messages
- **Frontend Interface**: Simple UI for interacting with the API

## Project Structure

```
master_blog_api/
├── backend/
│   ├── backend_app.py  # Main backend API with all endpoints
│   └── posts.py        # Data store for blog posts
├── frontend/
│   ├── frontend_app.py # Frontend server
│   ├── static/
│   │   ├── main.js     # Frontend JavaScript for API interaction
│   │   └── styles.css  # CSS styling
│   └── templates/
│       └── index.html  # Main HTML interface
├── requirements.txt    # Python dependencies
└── README.md           # This file
```

## Prerequisites

- Python 3.6 or higher
- Flask
- Flask-CORS (for cross-origin requests)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blog-api.git
cd blog-api
```

2. Install the required packages:
```bash
pip install -r requirements.txt
```

## Running the Application

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the backend server:
```bash
python backend_app.py
```

The API will be available at http://localhost:5002/api

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Run the frontend server:
```bash
python frontend_app.py
```

The frontend will be available at http://localhost:5001

## Testing the API

### Using the Frontend

The frontend provides a simple interface to:
- View all posts
- Add new posts
- Delete posts
- Sort posts by title or content (ascending/descending)

### Using Postman

For testing all API endpoints, including those not available in the frontend, you can use Postman:

#### 1. List Posts (GET)
- URL: `http://localhost:5002/api/posts`
- Optional query parameters: 
  - `sort`: Field to sort by (`title` or `content`)
  - `direction`: Sort direction (`asc` or `desc`)
- Example: `GET http://localhost:5002/api/posts?sort=title&direction=desc`

#### 2. Add Post (POST)
- URL: `http://localhost:5002/api/posts`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "title": "New Post Title",
    "content": "Post content goes here"
  }
  ```
- Response: 201 Created with the new post data

#### 3. Update Post (PUT)
- URL: `http://localhost:5002/api/posts/<id>`
- Headers: `Content-Type: application/json`
- Body:
  ```json
  {
    "title": "Updated Title",
    "content": "Updated content"
  }
  ```
- Response: 200 OK with the updated post data

#### 4. Delete Post (DELETE)
- URL: `http://localhost:5002/api/posts/<id>`
- Response: 200 OK with success message

#### 5. Search Posts (GET)
- URL: `http://localhost:5002/api/posts/search`
- Query parameters:
  - `title`: Search term for post titles
  - `content`: Search term for post contents
- Example: `GET http://localhost:5002/api/posts/search?title=flask`
- Response: Posts matching the search criteria

### Testing Error Handling

Error handling can be tested by:

1. **Missing Fields Error (400 Bad Request)**:
   - Send a POST request without required fields:
   ```bash
   curl -X POST http://localhost:5002/api/posts \
     -H "Content-Type: application/json" \
     -d '{"content": "Missing title field"}'
   ```

2. **Not Found Error (404)**:
   - Try to update or delete a non-existent post:
   ```bash
   curl -X DELETE http://localhost:5002/api/posts/999
   ```

3. **Invalid Sort Parameters (400 Bad Request)**:
   - Request with invalid sort direction:
   ```bash
   curl "http://localhost:5002/api/posts?sort=title&direction=invalid"
   ```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/posts | List all posts |
| POST | /api/posts | Create a new post |
| PUT | /api/posts/{id} | Update a post |
| DELETE | /api/posts/{id} | Delete a post |
| GET | /api/posts/search | Search posts by title or content |

## Code Documentation

The backend code is thoroughly documented with clear function docstrings and code comments explaining the functionality of each endpoint and its error handling.

## License

[MIT License](LICENSE)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request