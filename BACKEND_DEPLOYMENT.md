# Backend Deployment Guide

## 🚀 Deploy Backend to Render (Recommended - Free & Always On)

Render offers a **free tier that never sleeps** and provides 750 hours/month of compute time.

### 1. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account (recommended)

### 2. Create New Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub account
3. Search for and select `minecraft-control-panel` repository
4. Configure the service:
   - **Name**: `minecraft-control-panel-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 3. Configure Environment Variables
In the "Environment" section, add these variables:
```
NODE_ENV=production
MINECRAFT_SERVER_PATH=./minecraft-server
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

### 4. Deploy
Click "Create Web Service" - Render will build and deploy automatically.

### 5. Get Your Backend URL
After deployment, copy the generated URL from your service dashboard (looks like: `https://your-service-name.onrender.com`)

## �️ Alternative: Fly.io (Excellent Performance)

Fly.io offers great performance with a generous free tier.

### 1. Install Fly CLI
```bash
# macOS
brew install flyctl

# Or download from: https://fly.io/docs/getting-started/installing-flyctl/
```

### 2. Create Fly Account & Deploy
```bash
# Login to Fly
fly auth login

# Deploy from your repository
fly launch --from https://github.com/YehiaHS/minecraft-control-panel

# Set environment variables
fly secrets set NODE_ENV=production
fly secrets set MINECRAFT_SERVER_PATH=./minecraft-server
fly secrets set ADMIN_USERNAME=admin
fly secrets set ADMIN_PASSWORD=your_secure_password

# Deploy
fly deploy
```

### 3. Get Your URL
Fly will provide a URL like: `https://your-app-name.fly.dev`

## 🌐 Update Frontend to Use Hosted Backend

After deploying the backend:

1. **Get your backend URL** from Render/Fly dashboard
2. **Update frontend API calls** in `frontend/src/App.jsx`:
   - Change `http://localhost:3000` to your hosted backend URL
3. **Rebuild frontend**:
   ```bash
   cd frontend
   npm run build
   ```
4. **Deploy updated frontend** to GitHub Pages

## � Comparison: Hosting Options

| Service | Free Tier | Sleeps? | Performance | Setup Difficulty |
|---------|-----------|---------|-------------|------------------|
| **Render** | 750 hrs/month | ❌ Never | Excellent | Easy |
| **Fly.io** | 3 VMs, 160GB outbound | ❌ Never | Excellent | Medium |
| Railway | 512MB RAM | ⚠️ After 30min | Good | Easy |
| Vercel | 100GB bandwidth | ❌ Never | Good | Medium |

## ⚠️ Important Notes

- **Free tiers have limits**: Monitor usage to avoid unexpected charges
- **Security**: Always change default admin credentials
- **WebSockets**: Both Render and Fly support WebSocket connections
- **File Storage**: Backend expects Minecraft server files in `./minecraft-server/`

## 🔍 Troubleshooting

- **Port issues**: Apps use `process.env.PORT` automatically
- **Build failures**: Check deployment logs for errors
- **CORS errors**: Backend allows all origins by default
- **WebSocket issues**: Ensure your hosting provider supports WebSockets