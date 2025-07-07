const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Allow all origins for now - will fix in production
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    status: 'online',
    database: isConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 'not set',
    node_env: process.env.NODE_ENV || 'not set',
    mongodb_uri: process.env.MONGODB_URI ? 'set' : 'not set',
    jwt_secret: process.env.JWT_SECRET ? 'set' : 'not set'
  });
});

// Connect to MongoDB
let isConnected = false;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-collaboration-hub')
.then(() => {
  console.log('Connected to MongoDB');
  isConnected = true;
})
.catch((error) => {
  console.error('MongoDB connection error:', error.message);
  console.log('⚠️  MongoDB is not running. Some features will be limited.');
  console.log('💡 To use full functionality, please start MongoDB service or use MongoDB Atlas.');
  isConnected = false;
});

// Middleware to check database connection
app.use((req, res, next) => {
  if (!isConnected && req.path !== '/api/health') {
    return res.status(503).json({ 
      message: 'Database connection unavailable. Please start MongoDB service.',
      status: 'offline',
      endpoint: req.path
    });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
