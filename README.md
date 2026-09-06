# Student Collaboration Hub

A comprehensive React frontend for a student collaboration platform where students can connect, share knowledge, and collaborate on projects.

## 🚀 Features

### 🔐 Authentication System
- JWT token-based authentication
- User registration and login
- Protected routes for authenticated users
- Automatic logout on token expiration

### 📝 Post Management
- Create posts with title, description, and tags
- View all posts in an interactive feed
- Like/unlike posts with real-time updates
- Search posts by title or tags
- Tag-based categorization

### 🎯 Interactive Components
- **SearchBar**: Real-time filtering of posts
- **QuickPostForm**: In-line post creation
- **PostFeed**: Responsive post display with enhanced cards
- **SuggestedUsers**: Connect with recommended students
- **Leaderboard**: Top contributors ranking

### 🎨 Modern UI/UX
- Responsive design for mobile and desktop
- Gradient backgrounds and modern styling
- Smooth animations and hover effects
- Loading states and user feedback
- Professional component layouts

## 🛠️ Technology Stack

- **React 18** - Frontend framework
- **Vite** - Fast development build tool
- **React Router** - Client-side routing
- **Axios** - HTTP requests
- **CSS3** - Custom styling with Flexbox/Grid
- **Mock API** - Development-ready data layer

## 📁 Project Structure

```
src/
├── pages/
│   ├── Login.jsx         # Authentication login page
│   ├── Register.jsx      # User registration page
│   ├── Home.jsx          # Main dashboard with all features
│   ├── CreatePost.jsx    # Dedicated post creation page
│   └── Profile.jsx       # User profile and posts
├── components/
│   ├── Navbar.jsx        # Navigation with auth state
│   ├── SearchBar.jsx     # Post search functionality
│   ├── PostFeed.jsx      # Main post display component
│   ├── PostCard.jsx      # Individual post display
│   ├── QuickPostForm.jsx # Inline post creation
│   ├── SuggestedUsers.jsx# User recommendations
│   ├── Leaderboard.jsx   # Top contributors display
│   └── PrivateRoute.jsx  # Route protection
├── data/
│   ├── mockPosts.js      # Sample post data
│   └── mockUsers.js      # Sample user data
└── services/
    └── api.js            # API service with mock/real toggle
```

## 🚀 Quick Start

### Development Mode (Mock API)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

4. **Test the features**:
   - Register with any email/password
   - Browse posts and use search
   - Create new posts
   - Like posts and connect with users

### Production Mode (Real API)

1. **Configure API**: Set `MOCK_MODE = false` in `src/services/api.js`
2. **Update API URL**: Change `baseURL` to your backend server
3. **Build for production**: `npm run build`

## 🔧 API Endpoints Expected

When connecting to a real backend, the app expects these endpoints:

```
POST /api/auth/register   # User registration
POST /api/auth/login      # User authentication
GET  /api/posts          # Fetch all posts
POST /api/posts          # Create new post
GET  /api/posts/user     # Get user's posts
POST /api/posts/:id/like # Like/unlike post
```

## 🎯 Key Features Demonstrated

- **State Management**: useState and useEffect hooks
- **Component Architecture**: Reusable, focused components
- **Data Filtering**: Real-time search functionality
- **UI/UX Design**: Modern, responsive interface
- **Mock Data**: Comprehensive development environment
- **Responsive Design**: Mobile-first approach

## 📱 Mobile Responsiveness

- Adaptive grid layouts
- Touch-friendly buttons
- Optimized spacing for small screens
- Collapsible navigation on mobile

## 🔄 Development vs Production

The application includes a smart toggle system:
- **Development**: Uses mock API with sample data
- **Production**: Connects to real backend API
- **Visual Indicator**: Development banner shows mock mode

This allows for rapid frontend development and testing without requiring a backend server.

## 🎨 Design Philosophy

- Clean, modern interface
- Consistent color scheme and typography
- Intuitive user interactions
- Performance-optimized components
- Accessibility-friendly design

Perfect for students learning modern React development patterns and building portfolio projects!
