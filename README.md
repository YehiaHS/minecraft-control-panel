# Minecraft Server Control Panel

A comprehensive web-based control panel for managing Minecraft servers with 20+ advanced features.

## 🚀 Deployment Options

### Frontend Demo (GitHub Pages)
The demo is live and showcases all UI features. No backend required.

### Full Backend Deployment
For complete functionality, deploy the backend to a Node.js hosting service:

#### Railway (Recommended - Free)
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub account
3. Deploy `minecraft-control-panel` repository
4. Set environment variables: `PORT=3000`, `NODE_ENV=production`
5. Get your backend URL and update frontend API calls

#### Vercel (Alternative)
```bash
cd backend
npm install -g vercel
vercel --prod
```

See `BACKEND_DEPLOYMENT.md` for detailed instructions.

## ✨ Features

## ✨ Features

### Core Server Management
- **Server Control**: Start, stop, restart, and monitor server status
- **Real-time Console**: Interactive console with command execution
- **Performance Monitoring**: CPU, memory, and network usage tracking
- **Player Management**: View online players, kick/ban management

### Advanced Features
- **File Management**: Browse and edit server files and configurations
- **Backup System**: Automated and manual world backups
- **Plugin Management**: Install, update, and configure plugins
- **Chat Integration**: Real-time chat monitoring and messaging
- **Scheduled Tasks**: Automated server maintenance and restarts

### Professional Features
- **Authentication**: Secure HTTP Basic Auth protection
- **PWA Support**: Install as a mobile app
- **Dark/Light Themes**: Modern Material-UI interface
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: WebSocket-powered live updates

## Prerequisites

- macOS
- Node.js (v16 or higher)
- Java (for Minecraft server)
- ngrok account (free tier available)

## Installation

1. Clone or download this repository
2. Run the setup script:
   ```bash
   ./setup.sh
   ```

3. Download the Minecraft server:
   ```bash
   ./scripts/download-server.sh
   ```

4. Configure ngrok:
   - Sign up at [ngrok.com](https://ngrok.com)
   - Get your auth token
   - Run: `ngrok config add-authtoken YOUR_TOKEN_HERE`

## Usage

1. **Start the Backend**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Start ngrok Tunnels**:
   - For the control panel: `ngrok http 5173`
   - For Minecraft server: `ngrok tcp 25565`

4. **Access the Control Panel**:
   - Open the ngrok URL for port 5173 in your browser
   - Use the interface to manage your server

## Architecture

- **Backend**: Node.js + Express + Socket.io for real-time communication
- **Frontend**: React + Material-UI for modern UI
- **Tunneling**: ngrok for secure remote access
- **Server**: Vanilla Minecraft server (configurable)

## Security

- The control panel includes basic authentication (expandable)
- ngrok provides secure tunneling
- All communication is encrypted

## Customization

- Modify server properties in `minecraft-server/server.properties`
- Customize the UI in `frontend/src/`
- Add more features to the backend API

## Troubleshooting

- Ensure Java is installed and in PATH
- Check ngrok tunnels are active
- Verify firewall allows the required ports
- Check console logs for errors

## License

MIT License