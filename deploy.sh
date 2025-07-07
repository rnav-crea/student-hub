#!/bin/bash

# Student Collaboration Hub - Deployment Script
echo "🚀 Deploying Student Collaboration Hub..."

# Step 1: Build frontend for production
echo "📦 Building frontend..."
cd /c/Users/rnave/OneDrive/Documents/folder
npm run build

# Step 2: Create production environment file
echo "⚙️ Setting up environment..."
cat > server/.env.production << EOL
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student-collaboration-hub
JWT_SECRET=your_production_jwt_secret_here
EOL

# Step 3: Install production dependencies
echo "📥 Installing backend dependencies..."
cd server
npm install --production

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. 💾 Set up MongoDB Atlas database"
echo "2. ⚙️ Deploy backend to Railway/Render"
echo "3. 🌐 Deploy frontend to Netlify/Vercel"
echo "4. 🔗 Update URLs in both services"
echo ""
echo "📚 See DEPLOYMENT_GUIDE.md for detailed instructions"
