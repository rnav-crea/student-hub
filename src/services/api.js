import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://student-hub-backend.onrender.com/api'  // Production backend URL (update this after deployment)
  : 'http://localhost:5000/api';  // Development backend URL

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Import post manager for consistent data handling
const getPostManager = () => {
  if (typeof window !== 'undefined') {
    // Check if postManager is available
    const storedPosts = localStorage.getItem('mockPosts');
    return storedPosts ? JSON.parse(storedPosts) : [];
  }
  return [];
};

const saveToPostManager = (posts) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockPosts', JSON.stringify(posts));
  }
};

// Environment-based mode switching
const MOCK_MODE = !import.meta.env.PROD; // Use real API in production, mock in development

// Initialize mock data with localStorage persistence
const initializeMockData = () => {
  // Initialize users
  const storedUsers = localStorage.getItem('mockUsers');
  if (!storedUsers) {
    localStorage.setItem('mockUsers', JSON.stringify([]));
  }

  // Initialize posts with default posts
  const storedPosts = localStorage.getItem('mockPosts');
  if (!storedPosts) {
    const defaultPosts = [
      {
        id: '1',
        title: 'Welcome to Student Hub',
        description: 'This is a sample post to demonstrate the platform. Share your knowledge and connect with fellow students!',
        tags: ['welcome', 'demo', 'student-hub'],
        postedBy: { 
          id: '0',
          name: 'Admin', 
          avatar: 'https://ui-avatars.com/api/?name=Admin&background=007bff&color=fff&size=128',
          course: 'Administrator'
        },
        likes: 5,
        date: new Date().toISOString(),
        isLiked: false
      },
      {
        id: '2',
        title: 'Study Group for React Development',
        description: 'Looking for students interested in forming a React study group. We\'ll meet weekly to work on projects and share knowledge.',
        tags: ['react', 'javascript', 'study-group'],
        postedBy: { 
          id: '0',
          name: 'John Doe', 
          avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=28a745&color=fff&size=128',
          course: 'Computer Science'
        },
        likes: 12,
        date: new Date(Date.now() - 86400000).toISOString(),
        isLiked: false
      }
    ];
    localStorage.setItem('mockPosts', JSON.stringify(defaultPosts));
  }
};

// Initialize on module load
initializeMockData();

// Mock data getters
const getMockUsers = () => JSON.parse(localStorage.getItem('mockUsers') || '[]');
const getMockPosts = () => JSON.parse(localStorage.getItem('mockPosts') || '[]');
const setMockUsers = (users) => localStorage.setItem('mockUsers', JSON.stringify(users));
const setMockPosts = (posts) => localStorage.setItem('mockPosts', JSON.stringify(posts));

// Mock API functions
const mockAPI = {
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    if (url.includes('/auth/register')) {
      // Simulate registration
      const getDefaultAvatar = (name) => {
        const colors = ['007bff', '28a745', 'dc3545', 'ffc107', '17a2b8', '6f42c1', 'fd7e14', '20c997'];
        const colorIndex = name.length % colors.length;
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[colorIndex]}&color=fff&size=128&font-size=0.5`;
      };
      
      const newUser = {
        id: Date.now().toString(),
        name: data.name,
        email: data.email,
        avatar: getDefaultAvatar(data.name),
        course: data.course || 'Computer Science',
        collaborations: 0
      };
      
      const users = getMockUsers();
      users.push({ ...newUser, password: data.password });
      setMockUsers(users);
      
      return {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: newUser
        }
      };
    }
    
    if (url.includes('/auth/login')) {
      // Simulate login
      const users = getMockUsers();
      const user = users.find(u => u.email === data.email && u.password === data.password);
      if (!user) {
        throw { response: { data: { message: 'Invalid credentials' } } };
      }
      
      // Ensure user has default avatar if not set
      const getDefaultAvatar = (name) => {
        const colors = ['007bff', '28a745', 'dc3545', 'ffc107', '17a2b8', '6f42c1', 'fd7e14', '20c997'];
        const colorIndex = name.length % colors.length;
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${colors[colorIndex]}&color=fff&size=128&font-size=0.5`;
      };
      
      const userWithAvatar = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar || getDefaultAvatar(user.name),
        course: user.course || 'Computer Science',
        collaborations: user.collaborations || 0
      };
      
      return {
        data: {
          token: 'mock-jwt-token-' + Date.now(),
          user: userWithAvatar
        }
      };
    }
    
    if (url.includes('/posts') && !url.includes('/like')) {
      // Create new post
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const newPost = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        tags: data.tags || [],
        postedBy: currentUser || {
          id: '999',
          name: 'Anonymous',
          avatar: 'https://ui-avatars.com/api/?name=Anonymous&background=6c757d&color=fff&size=128',
          course: 'Student'
        },
        likes: 0,
        date: new Date().toISOString(),
        isLiked: false
      };
      
      const posts = getPostManager();
      posts.unshift(newPost);
      saveToPostManager(posts);
      
      return { data: newPost };
    }
    
    if (url.includes('/like')) {
      // Like post
      return { data: { message: 'Post liked' } };
    }
    
    throw { response: { data: { message: 'Mock API: Endpoint not implemented' } } };
  },
  
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    
    if (url.includes('/posts/user')) {
      // Get user's posts
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const posts = getPostManager();
      return { 
        data: posts.filter(p => p.postedBy.id === currentUser?.id) 
      };
    }
    
    if (url.includes('/posts')) {
      // Get all posts
      return { data: getPostManager() };
    }
    
    throw { response: { data: { message: 'Mock API: Endpoint not implemented' } } };
  }
};

// Create axios instance with base configuration
const api = MOCK_MODE ? mockAPI : axios.create({
  baseURL: 'http://localhost:5000/api', // Update this to match your backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token (only for real API)
if (!MOCK_MODE) {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle auth errors (only for real API)
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
}

export default api;
