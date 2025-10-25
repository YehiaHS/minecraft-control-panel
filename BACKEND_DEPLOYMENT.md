# Backend Deployment Guide

## 🚀 Deploy Backend to Railway (Free)

### 1. Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub (recommended)

### 2. Deploy from GitHub
1. Click "New Project" → "Deploy from GitHub repo"
2. Connect your GitHub account
3. Select `minecraft-control-panel` repository
4. Railway will auto-detect it's a Node.js app

### 3. Configure Environment Variables
In Railway dashboard, go to your project → Variables:
```
PORT=3000
NODE_ENV=production
MINECRAFT_SERVER_PATH=./minecraft-server
```

### 4. Deploy
Railway will automatically deploy when you push to GitHub.

### 5. Get Your Backend URL
After deployment, copy the URL from Railway dashboard (something like `https://your-app-name.up.railway.app`)

## 🔧 Alternative: Vercel (Free)

### 1. Create Vercel Account
Go to [vercel.com](https://vercel.com) and sign up.

### 2. Deploy
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy backend
cd backend
vercel --prod
```

### 3. Configure
Vercel will ask for configuration - set entry point to `server.js`.

## 🌐 Update Frontend to Use Hosted Backend

After deploying backend, update your frontend to connect to the hosted API:

1. Edit `frontend/src/App.jsx`
2. Change the API base URL from `http://localhost:3000` to your hosted backend URL
3. Rebuild and redeploy frontend

## 📱 Demo vs Full Version

- **GitHub Pages**: Frontend demo only (what you have now)
- **Railway/Vercel**: Full backend functionality
- **Local**: Both frontend + backend for development

## ⚠️ Important Notes

- Railway has a generous free tier (512MB RAM, 1GB storage)
- Vercel is great for serverless functions
- Both support custom domains
- Backend will need to be configured with your actual Minecraft server path when deployed