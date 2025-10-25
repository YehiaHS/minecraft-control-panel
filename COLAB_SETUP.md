# 🚀 Colab Backend Setup Guide

## Quick Start (5 minutes)

### 1. Open Colab Notebook
1. Go to [Google Colab](https://colab.research.google.com)
2. Upload `colab-backend.ipynb` from this repository
3. Or open directly: [Colab Backend Notebook](https://colab.research.google.com/github/YehiaHS/minecraft-control-panel/blob/main/colab-backend.ipynb)

### 2. Run Setup Cells
Execute cells in order (click play button on each):

1. **Mount Drive** - For persistent storage
2. **Clone Repository** - Downloads the backend code
3. **Install Node.js** - Sets up the runtime
4. **Install Dependencies** - Backend packages
5. **Setup ngrok** - For public access

### 3. Get Your Backend URL
After running the ngrok cell, copy the URL that looks like:
```
https://abc123.ngrok.io
```

### 4. Configure Frontend
1. Open: https://yehiah.github.io/minecraft-control-panel/
2. Click "Configure Backend URL"
3. Paste your ngrok URL
4. Login with: `admin` / `colab_server_2025`

## 🎯 What You Get

- ✅ **Free GPU/TPU access** (up to T4 GPU)
- ✅ **12GB+ RAM** (vs 512MB on free hosting)
- ✅ **Persistent storage** via Google Drive
- ✅ **No usage limits** (within Colab limits)
- ✅ **WebSocket support** for real-time features

## 📋 Colab Limits & Tips

### Session Limits:
- **12 hours max** per session
- **90 minutes** inactivity timeout
- **Reconnect** by re-running ngrok/server cells

### Pro Tips:
- **Keep tab open** to maintain server
- **Use GPU runtime** for better performance
- **Save to Drive** for persistent Minecraft worlds
- **Monitor ngrok URL** for backend access

### Cost: **FREE** (Google Colab is completely free)

## 🔧 Troubleshooting

### "ngrok URL not found":
```bash
# Check ngrok status
!curl http://localhost:4040/api/tunnels
```

### "Session crashed":
- Re-run cells from "Setup ngrok" onward
- Update frontend with new ngrok URL

### "Port already in use":
- Restart runtime: Runtime → Restart runtime
- Re-run all cells

## 🎮 Full Workflow

1. **Colab**: Run backend server
2. **Frontend**: Configure backend URL
3. **Control Panel**: Full Minecraft server management
4. **Minecraft**: Connect to your server

## 💡 Advanced Usage

- **Custom Minecraft server**: Upload your own server files to Google Drive
- **Multiple backends**: Run different servers in separate Colab tabs
- **Persistent worlds**: Store Minecraft worlds in Google Drive
- **GPU acceleration**: Enable for better server performance

---

**Ready to start?** Open the Colab notebook and run the cells! 🚀