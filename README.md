# TRACKTAKU - API DOCUMENTATION
## Base URL
```JSON
https://ip-tracktaku.web.app/
```

## Authentication
All requests that require authentication must include a Bearer token in the Authorization header.

Example:
```
Authorization: Bearer <token>
```

## Error Handling
The API uses standard HTTP status codes to indicate success and error responses:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Routes
### User Endpoints
**Base Route**: `/user`

### Register a New User
**POST** `/user/register`
- **Description**: Register a new user.
- **Body Parameters**:
    - `username` (string, optional)
    - `email` (string, required)
    - `password` (string, required)
- **Responses**:
    - `201 Created`: Welcome message with username.
    - `400 Bad Request`: Email is taken or validation error.

### Login
**POST** `/user/login`
- **Description**: Log in with email and password.
- **Body Parameters**:
    - `email` (string, required)
    - `password` (string, required)
- **Responses**:
    - `200 OK`: JSON object containing `access_token`.
    - `400 Bad Request`: Missing email or password.
    - `401 Unauthorized`: Invalid email or password.

### Google Login
**POST** `/user/google-login`
- **Description**: Log in using Google OAuth.
- **Headers**:
    - `token` (string, required) - Google ID token.
- **Responses**:
    - `200 OK`: JSON object containing `access_token`.
    - `401 Unauthorized`: Invalid token.

**Get All Users**

**GET** `/user/all`
- **Description**: Fetch all registered users.
- **Responses**:
    - `200 OK`: List of users.

### Get User by ID
**GET** `/user/:id`
- Description: Retrieve a user’s profile by ID.
- Responses:
    - `200 OK`: User profile data.
    - `404 Not Found`: User not found.
### Update User
**PUT** `/user/:id`
- **Description**: Update user profile.
- **Body Parameters**: JSON object of fields to update.
- **Responses**:
    - `200 OK`: Success message.
    - `404 Not Found`: User not found.

### Delete User
**DELETE** `/user/:id`
- **Description**: Delete a user by ID.
- **Responses**:
    - `200 OK`: Success message.
    - `404 Not Found`: User not found.

## Manga Reading List Endpoints
Base Route: `/manga`

### Get My Reading List
**GET** `/manga/mylist`
- **Description**: Retrieve the logged-in user’s manga reading list.
- **Responses**:
    - `200 OK`: List of manga entries.

### Add Manga to Reading List
**POST** `/manga/add`
- **Description**: Add a manga to the user's reading list.
- **Body Parameters**:
    - `mangaId` (integer, required) - ID of the manga.
- **Responses**:
    - `201 Created`: Manga added to reading list.
    - `400 Bad Request`: Manga is already in the reading list.

### Update Reading Progress
**PUT** `/manga/progress`
- **Description**: Update reading progress of a manga.
- **Body Parameters**:
    - `mangaId` (integer, required)
    - `progress` (integer, required) - Progress in chapters.
- **Responses**:
    - `200 OK`: Updated manga entry with progress.
    - `404 Not Found`: Manga not found in reading list.

### Rate Manga
**PUT** `/manga/rate`
- **Description**: Add or update user rating for a manga.
- **Body Parameters**:
    - `mangaId` (integer, required)
    - `rating` (integer, required) - User rating (1 to 5).
- **Responses**:
    - `200 OK`: Updated manga entry with rating.
    - `404 Not Found`: Manga not found in reading list.

### Mark Manga as Finished
**PUT** `/manga/finish`
- **Description**: Mark a manga as finished.
- **Body Parameters**:
    - `mangaId` (integer, required)
- **Responses**:
    - `200 OK`: Manga status updated to 'finished'.
    - `404 Not Found`: Manga not found in reading list.

### Remove Manga from Reading List
**DELETE** `/manga/:id`
- **Description**: Remove a manga from the user’s reading list by manga ID.
- **Responses**:
    - `200 OK`: Manga removed from reading list.
    - `404 Not Found`: Manga not found in reading list.