# Deployment Guide - Student Collaboration Hub

## 🚀 Deploy Your Site Online

### Prerequisites
- GitHub account
- Netlify/Vercel account (for frontend)
- Railway/Render account (for backend)  
- MongoDB Atlas account (for database)

## 📋 Deployment Checklist

### 1. 💾 Database Setup (MongoDB Atlas)
- [ ] Create MongoDB Atlas account
- [ ] Create new cluster (free tier)
- [ ] Get connection string
- [ ] Update backend .env file

### 2. ⚙️ Backend Deployment (Railway/Render)
- [ ] Push code to GitHub
- [ ] Connect Railway/Render to repository
- [ ] Set environment variables
- [ ] Deploy backend API

### 3. 🌐 Frontend Deployment (Netlify/Vercel)
- [ ] Update API URLs in frontend
- [ ] Build production version
- [ ] Deploy to hosting platform
- [ ] Configure custom domain (optional)

### 4. 🔗 Connect Everything
- [ ] Update CORS settings
- [ ] Test all functionality
- [ ] Monitor deployment

## 🛠️ Detailed Steps

### MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com
2. Create free account
3. Create new project
4. Create cluster (M0 - Free)
5. Create database user
6. Whitelist IP addresses (0.0.0.0/0 for development)
7. Get connection string

### Backend Deployment (Railway)
1. Go to https://railway.app
2. Connect GitHub account
3. Import your repository
4. Add environment variables:
   - MONGODB_URI
   - JWT_SECRET
   - NODE_ENV=production
5. Deploy automatically

### Frontend Deployment (Netlify)
1. Go to https://netlify.com
2. Connect GitHub account
3. Import frontend repository
4. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Deploy automatically

## 🔧 Configuration Updates

### Backend Changes
```javascript
// Add to server.js
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-url.netlify.app'],
  credentials: true
}));
```

### Frontend Changes
```javascript
// Update src/services/api.js
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-url.railway.app/api'
  : 'http://localhost:5000/api';
```

## 🌟 Expected Results
- Frontend: https://your-site.netlify.app
- Backend API: https://your-api.railway.app
- Database: MongoDB Atlas cloud

## 💰 Cost Estimate
- MongoDB Atlas: FREE (up to 512MB)
- Railway: FREE (up to $5/month credit)
- Netlify: FREE (unlimited static sites)
- **Total: FREE** for development/small projects
