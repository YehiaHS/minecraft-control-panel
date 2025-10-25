# Backend Deployment Guide

## 🚀 Deploy Backend to Railway (Free)

Railway offers a generous free tier: 512MB RAM, 1GB storage, and no request limits.

### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with your GitHub account (recommended for easy deployment)

### 2. Deploy from GitHub Repository
1. Click "New Project" → "Deploy from GitHub repo"
2. Connect your GitHub account (if not already connected)
3. Search for and select `minecraft-control-panel` repository
4. Railway will auto-detect it's a Node.js app and deploy it

### 3. Configure Environment Variables
In your Railway project dashboard:
1. Go to "Variables" tab
2. Add these environment variables:

```
PORT=3000
NODE_ENV=production
MINECRAFT_SERVER_PATH=./minecraft-server
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

### 4. Deploy
Railway will automatically build and deploy when you push changes to GitHub.

### 5. Get Your Backend URL
After deployment completes:
1. Go to your project dashboard
2. Copy the generated URL (looks like: `https://your-project-name.up.railway.app`)

## 🔧 Alternative: Render (Free)

### 1. Create Render Account
Go to [render.com](https://render.com) and sign up.

### 2. Create New Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Same as above

### 3. Deploy
Render will build and deploy automatically.

## 🌐 Update Frontend to Use Hosted Backend

After deploying the backend:

1. **Get your backend URL** from Railway/Render dashboard
2. **Update frontend API calls** in `frontend/src/App.jsx`:
   - Change `http://localhost:3000` to your hosted backend URL
3. **Rebuild frontend**:
   ```bash
   cd frontend
   npm run build
   ```
4. **Deploy updated frontend** to GitHub Pages

## 📱 Demo vs Full Version

- **GitHub Pages**: Frontend demo only (static showcase)
- **Railway/Render**: Full backend functionality (live server control)
- **Local**: Both frontend + backend for development

## ⚠️ Important Notes

- **Free tiers have limitations**: Railway/Render may sleep after inactivity
- **Security**: Change default admin credentials in production
- **Minecraft Server**: The backend expects a Minecraft server in `./minecraft-server/`
- **File Paths**: All paths are relative to the backend directory

## 🔍 Troubleshooting

- **Port issues**: Railway assigns random ports - the app uses `process.env.PORT`
- **Build failures**: Check Railway logs for dependency issues
- **CORS errors**: Backend allows all origins by default
- **File access**: Ensure Minecraft server files are in the correct path