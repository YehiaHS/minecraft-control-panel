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

# Backend Deployment Guide

## 🚀 Deploy Backend to DigitalOcean App Platform (Free $200 Credit + 4GB RAM)

DigitalOcean offers **$200 free credit** (good for 60+ days) and you can configure up to 4GB RAM.

### 1. Create DigitalOcean Account
1. Go to [digitalocean.com](https://digitalocean.com)
2. Sign up (use GitHub for easier auth)
3. You'll get **$200 free credit** automatically

### 2. Create App Platform App
1. In dashboard, click "Create" → "Apps"
2. Choose "GitHub" as source
3. Connect your GitHub account
4. Select repository: `minecraft-control-panel`
5. Choose branch: `main`

### 3. Configure Resources
1. **Service Type**: Web Service
2. **Source Directory**: `/backend` (deploy only backend)
3. **Runtime**: Node.js
4. **Build Command**: `npm install`
5. **Run Command**: `npm start`

### 4. Scale Resources (4GB RAM)
1. Go to "Resources" tab
2. Set instance size to **Professional** tier
3. Configure: **4GB RAM, 2vCPU**
4. This costs ~$25/month but you have $200 free credit

### 5. Environment Variables
Add these environment variables:
```
NODE_ENV=production
MINECRAFT_SERVER_PATH=./minecraft-server
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_secure_password_here
```

### 6. Deploy
Click "Create Resources" - DigitalOcean will build and deploy.

## ☁️ Alternative: Google Cloud Run (Free $300 Credit + High RAM)

Google Cloud offers **$300 free credit** and excellent performance.

### 1. Create Google Cloud Account
1. Go to [cloud.google.com](https://cloud.google.com)
2. Sign up and get **$300 free credit**
3. Create a new project

### 2. Enable Cloud Run API
1. Go to "APIs & Services" → "Library"
2. Search for "Cloud Run" and enable it

### 3. Deploy from GitHub
```bash
# Install Google Cloud CLI
# Follow: https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Deploy
gcloud run deploy minecraft-control-panel \
  --source https://github.com/YehiaHS/minecraft-control-panel \
  --platform managed \
  --region us-central1 \
  --memory 4Gi \
  --cpu 2 \
  --set-env-vars NODE_ENV=production,MINECRAFT_SERVER_PATH=./minecraft-server \
  --allow-unauthenticated
```

## 🐙 Alternative: Qoddi (2GB RAM Free)

Qoddi offers **2GB RAM free** with good performance.

### 1. Create Qoddi Account
Go to [qoddi.com](https://qoddi.com) and sign up.

### 2. Create App
1. Click "Create App" → "From Git Repository"
2. Connect GitHub → Select `minecraft-control-panel`
3. Configure:
   - **Runtime**: Node.js
   - **Build**: `npm install`
   - **Start**: `npm start`
   - **RAM**: 2GB (free tier max)

## 📊 High-RAM Hosting Comparison

| Service | Free Credit | Max Free RAM | Setup Difficulty | Performance |
|---------|-------------|--------------|------------------|-------------|
| **DigitalOcean** | **$200** | **4GB** | Medium | Excellent |
| **Google Cloud** | **$300** | **4GB+** | Hard | Excellent |
| Qoddi | **$0** | **2GB** | Easy | Good |
| Render | **$0** | **512MB** | Easy | Good |
| Railway | **$0** | **512MB** | Easy | Good |

## 💰 Cost Estimate

With free credits:
- **DigitalOcean**: 4GB RAM app costs ~$25/month → **8+ months free**
- **Google Cloud**: 4GB RAM costs ~$30/month → **10+ months free**

## ⚠️ Important Notes

- **Free credits expire**: DigitalOcean $200 expires in 1 year, Google $300 in 90 days
- **Credit cards required**: For verification, but won't be charged until credits expire
- **Scaling**: You can start with lower RAM and upgrade later
- **WebSockets**: All these services support WebSocket connections

## 🎯 Recommendation

**Go with DigitalOcean App Platform** - it's the easiest to set up with 4GB RAM and you get $200 free credit. The setup takes about 10 minutes and you'll have professional hosting with plenty of resources.

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