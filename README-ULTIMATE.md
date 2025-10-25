# Minecraft Server Control Panel - Ultimate Edition

A comprehensive, enterprise-grade web-based control panel for managing Minecraft servers. Features remote access, advanced monitoring, plugin management, scheduled tasks, and much more - all without port forwarding!

## 🚀 **Complete Feature Set:**

### **Core Server Management**
- ✅ **Server Control**: Start, stop, and monitor server status
- ✅ **Real-time Performance Monitoring**: CPU, RAM, and system metrics
- ✅ **Live Console**: Real-time console output with command input
- ✅ **File Management**: Browse, edit, and manage server files
- ✅ **Backup & Restore**: Automated backups with one-click restore
- ✅ **Configuration Editor**: User-friendly server.properties editor

### **Advanced Administration**
- ✅ **Player Management**: View online players, kick/ban functionality
- ✅ **Plugin Management**: Install, remove, and manage plugins
- ✅ **Chat Integration**: Send messages to server chat
- ✅ **Scheduled Tasks**: Automate restarts, backups, and announcements
- ✅ **Log Viewer**: Searchable server logs with filtering

### **User Experience**
- ✅ **Modern UI**: Beautiful Material-UI interface with dark theme
- ✅ **Tabbed Navigation**: Organized sections for easy access
- ✅ **Mobile PWA**: Install as app on mobile devices
- ✅ **Theme Customization**: Light/dark theme support
- ✅ **Responsive Design**: Works on all screen sizes

### **Security & Remote Access**
- ✅ **HTTP Basic Authentication**: Secure access control
- ✅ **No Port Forwarding**: ngrok tunneling for remote access
- ✅ **Encrypted Communication**: Secure data transmission

## 📋 **System Requirements**

- **macOS** (primary platform)
- **Node.js** v16+
- **Java** 17+ (for Minecraft server)
- **ngrok** account (free tier available)

## 🛠 **Quick Start**

```bash
# 1. Setup
./setup.sh
./scripts/download-server.sh

# 2. Configure
ngrok config add-authtoken YOUR_TOKEN
# Edit backend/.env for credentials

# 3. Start
cd backend && npm start              # Terminal 1
cd frontend && npm run dev           # Terminal 2
ngrok http 5173 && ngrok tcp 25565   # Terminal 3
```

## 🎮 **Interface Guide**

### **Dashboard**
- Server status, performance metrics, online players
- Quick action buttons for common tasks

### **Console**
- Live server output with command input
- Integrated log viewer

### **Files**
- Directory browser with file editing
- Upload/download capabilities

### **Players**
- Online player list with management actions
- Kick/ban functionality

### **Backups**
- Instant backup creation
- Restore from backup history

### **Settings**
- Server configuration editor
- Advanced server properties

### **Plugins**
- Plugin installation from URLs
- Plugin management and removal

### **Chat**
- Send messages to server chat
- Player communication

### **Schedules**
- Automated server restarts
- Scheduled backups and announcements

## 🔧 **API Reference**

```
GET  /api/status          # Server status
GET  /api/performance     # System metrics
POST /api/start           # Start server
POST /api/stop            # Stop server
POST /api/command         # Send console command
GET  /api/files           # List files
POST /api/backup          # Create backup
GET  /api/plugins         # List plugins
POST /api/chat            # Send chat message
GET  /api/schedules       # List scheduled tasks
```

## 📱 **Mobile Access**

Install as a Progressive Web App:
1. Open in Chrome/Safari
2. Tap "Add to Home Screen"
3. Use as native mobile app

## 🔒 **Security**

- HTTP Basic Authentication
- ngrok secure tunneling
- Input validation and sanitization
- Comprehensive error handling

## 🐛 **Troubleshooting**

- **Server won't start**: Check Java and server.jar
- **ngrok issues**: Verify auth token
- **Plugin problems**: Check plugins directory
- **Connection issues**: Check firewall settings

## 📈 **What's Next**

Future enhancements:
- Multi-server management
- Mod support (Forge/Fabric)
- Resource pack management
- Advanced analytics
- Webhook integrations

---

**Built with ❤️ for the Minecraft community - The ultimate server management solution!**