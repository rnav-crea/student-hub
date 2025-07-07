# 🔧 Render Configuration Quick Reference

## 📋 Exact Render Settings

### **Basic Configuration:**
- **Name**: `student-hub-backend`
- **Root Directory**: `server`
- **Environment**: `Node`
- **Region**: Choose closest to you
- **Branch**: `main`
- **Build Command**: `npm install` (NOT `npm run build`)
- **Start Command**: `npm start`

### **Environment Variables:**
Click "Add Environment Variable" for each:

1. **NAME_OF_VARIABLE**: `PORT`  
   **value**: `5000`

2. **NAME_OF_VARIABLE**: `NODE_ENV`  
   **value**: `production`

3. **NAME_OF_VARIABLE**: `MONGODB_URI`  
   **value**: `mongodb+srv://student-hub-user:yourpassword@student-hub-cluster.xxxxx.mongodb.net/student-collaboration-hub?retryWrites=true&w=majority`

4. **NAME_OF_VARIABLE**: `JWT_SECRET`  
   **value**: `your_super_secure_jwt_secret_minimum_32_characters_long`

5. **NAME_OF_VARIABLE**: `FRONTEND_URL`  
   **value**: `https://your-app-name.netlify.app`

### **Advanced Settings:**
- **Health Check Path**: `/api/health`
- **Pre-Deploy Command**: (leave empty)
- **Auto-Deploy**: ✅ On Commit (enabled)
- **Secret Files**: (not needed)
- **Disk**: (not needed for this app)
- **Build Filters**: (leave empty)

### **CORS Configuration:**
After getting your Netlify URL, update the `FRONTEND_URL` environment variable to match your actual Netlify domain.

### **Testing Your Deployment:**
Once deployed, test these URLs:
- Health Check: `https://student-hub-backend.onrender.com/api/health`
- Auth Endpoint: `https://student-hub-backend.onrender.com/api/auth/register`

---

## 🚨 Important Notes:

1. **Cold Starts**: Free Render services sleep after 15 minutes of inactivity
2. **First Request**: May take 30+ seconds to wake up
3. **Health Check**: Automatically configured at `/api/health`
4. **Logs**: Check Render Dashboard → Your Service → Logs for debugging

---

## ✅ Ready to Deploy!

1. Fill in the MongoDB Atlas connection string
2. Generate a strong JWT secret (32+ characters)
3. Click "Create Web Service"
4. Wait 5-10 minutes for deployment
5. Save your backend URL: `https://student-hub-backend.onrender.com`
