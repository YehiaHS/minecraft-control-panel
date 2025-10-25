# Minecraft Server Control Panel

A beautiful and powerful web-based control panel for managing a Minecraft server on macOS. Features remote access, file management, console control, and no port forwarding required thanks to ngrok tunneling.

## Features

- 🖥️ **Web-based Control Panel**: Modern, intuitive UI built with React and Material-UI
- 🎮 **Server Management**: Start, stop, and monitor your Minecraft server
- 💻 **Live Console**: Real-time console output and command input
- 📁 **File Manager**: Browse and edit server files directly from the web
- 🌐 **Remote Access**: Access your control panel from anywhere without port forwarding
- 🔒 **Secure**: Built-in authentication and secure tunneling

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