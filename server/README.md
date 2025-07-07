# Student Collaboration Hub - Backend

A Node.js + Express backend server for the Student Collaboration Hub web application.

## Features

- **Authentication & Authorization**
  - JWT-based authentication
  - User registration and login
  - Password hashing with bcrypt
  - Protected routes with middleware

- **User Management**
  - User profiles with customizable information
  - Profile picture support
  - Skills and interests tracking
  - Password change functionality

- **Post Management**
  - Create, read, update, delete posts
  - Post categories (general, study-group, project, help, announcement, discussion)
  - Tagging system
  - Post search and filtering
  - Pagination support

- **Social Features**
  - Like/unlike posts
  - Comment system
  - User post feeds
  - Category-based post feeds

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: cors middleware

## Project Structure

```
server/
├── controllers/           # Request handlers
│   ├── authController.js  # Authentication logic
│   └── postController.js  # Post management logic
├── middleware/           # Custom middleware
│   └── authMiddleware.js # JWT authentication middleware
├── models/              # Database models
│   ├── User.js          # User schema
│   └── Post.js          # Post schema
├── routes/              # API routes
│   ├── authRoutes.js    # Authentication routes
│   └── postRoutes.js    # Post management routes
├── .env                 # Environment variables
├── server.js            # Main server file
└── package.json         # Dependencies and scripts
```

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if available)
   - Update the variables in `.env`:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/student-collaboration-hub
     JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
     NODE_ENV=development
     ```

4. Make sure MongoDB is running on your system

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your .env file).

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /profile` - Get current user profile (protected)
- `PUT /profile` - Update user profile (protected)
- `PUT /change-password` - Change user password (protected)
- `GET /verify` - Verify token and get user data (protected)

### Post Routes (`/api/posts`)

- `GET /` - Get all posts (with pagination and filtering)
- `POST /` - Create a new post (protected)
- `GET /:id` - Get a single post by ID
- `PUT /:id` - Update a post (protected, author only)
- `DELETE /:id` - Delete a post (protected, author only)
- `POST /:id/like` - Like/unlike a post (protected)
- `POST /:id/comments` - Add a comment to a post (protected)
- `GET /user/:userId` - Get posts by specific user
- `GET /category/:category` - Get posts by category

### Health Check

- `GET /api/health` - Server health check

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Create Post
```bash
POST /api/posts
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": "Looking for Study Group",
  "content": "Anyone interested in forming a study group for Computer Science?",
  "category": "study-group",
  "tags": ["computer-science", "study-group", "collaboration"]
}
```

### Like a Post
```bash
POST /api/posts/POST_ID/like
Authorization: Bearer YOUR_JWT_TOKEN
```

## Database Schema

### User Schema
- `username` (String, unique, required)
- `email` (String, unique, required)
- `password` (String, required, hashed)
- `profilePicture` (String, optional)
- `bio` (String, optional)
- `skills` (Array of Strings)
- `interests` (Array of Strings)
- `createdAt` (Date)
- `lastActive` (Date)

### Post Schema
- `title` (String, required)
- `content` (String, required)
- `author` (ObjectId, ref: User)
- `authorUsername` (String)
- `category` (String, enum)
- `tags` (Array of Strings)
- `likes` (Array of Objects with user and username)
- `comments` (Array of Objects with user, username, content, createdAt)
- `likesCount` (Number)
- `commentsCount` (Number)
- `isActive` (Boolean, for soft delete)
- `createdAt` (Date)
- `updatedAt` (Date)

## Error Handling

The API uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- Password hashing with bcrypt (salt rounds: 12)
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Environment variable configuration
- Protected routes with authentication middleware

## Development Notes

- The server uses Mongoose for MongoDB object modeling
- All passwords are automatically hashed before saving to database
- JWT tokens expire in 7 days
- Soft delete is implemented for posts (posts are marked as inactive rather than deleted)
- Pagination is implemented for all list endpoints
- Search functionality is available for posts (title, content, tags)

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `NODE_ENV` - Environment (development/production)

## Contributing

1. Follow the existing code structure and naming conventions
2. Add proper error handling for all new endpoints
3. Include input validation for all user inputs
4. Add comments for complex business logic
5. Test all endpoints before committing
