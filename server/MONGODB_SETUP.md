# MongoDB Setup Guide

The Student Collaboration Hub backend requires MongoDB to function properly. Here are several options to set up MongoDB:

## Option 1: MongoDB Atlas (Cloud - Recommended for Development)

1. **Sign up for MongoDB Atlas** (free tier available):
   - Go to https://www.mongodb.com/atlas
   - Create a free account
   - Create a new cluster (M0 Sandbox is free)

2. **Get Connection String**:
   - In your Atlas dashboard, click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

3. **Update .env file**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student-collaboration-hub
   ```

## Option 2: Local MongoDB Installation

### Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Install using the installer (choose "Complete" installation)
3. During installation, make sure to install "MongoDB as a Service"
4. MongoDB will start automatically as a Windows service

### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

### Linux (Ubuntu/Debian):
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

## Option 3: Docker

```bash
# Pull and run MongoDB container
docker run --name mongodb -d -p 27017:27017 mongo:latest

# Or with persistent data
docker run --name mongodb -d -p 27017:27017 -v /your/local/path:/data/db mongo:latest
```

## Verification

After setting up MongoDB, restart your server:

```bash
npm run dev
```

Check the health endpoint:
```bash
curl http://localhost:5000/api/health
```

You should see:
```json
{
  "message": "Server is running!",
  "status": "online",
  "database": "connected",
  "timestamp": "2025-07-06T17:34:03.591Z"
}
```

## Troubleshooting

### Connection Issues:
- Make sure MongoDB service is running
- Check firewall settings (port 27017)
- Verify connection string in .env file
- For Atlas: ensure IP whitelist includes your IP

### Authentication Issues:
- Verify username/password in connection string
- Check database user permissions in Atlas

### Network Issues:
- For Atlas: ensure stable internet connection
- For local: check if MongoDB is bound to correct interface

## Environment Variables

Make sure your `.env` file contains:

```env
# Server Configuration
PORT=5000

# MongoDB Configuration (choose one)
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/student-collaboration-hub

# MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student-collaboration-hub

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# Environment
NODE_ENV=development
```

## Testing the Connection

Run the API test script to verify everything works:

```bash
node test-api.js
```

This will test all endpoints including user registration, login, post creation, likes, and comments.
