#!/bin/bash

# Setup script for Minecraft Control Panel

echo "Setting up Minecraft Control Panel..."

# Check if ngrok is installed
if ! command -v ngrok &> /dev/null; then
    echo "Installing ngrok..."
    # For Mac, use brew
    if command -v brew &> /dev/null; then
        brew install ngrok/ngrok/ngrok
    else
        echo "Please install Homebrew first: https://brew.sh/"
        echo "Then run: brew install ngrok/ngrok/ngrok"
        exit 1
    fi
fi

# Install Java if not present
if ! command -v java &> /dev/null; then
    echo "Installing Java..."
    brew install openjdk
fi

echo "Setup complete. Please configure ngrok with your auth token:"
echo "ngrok config add-authtoken YOUR_TOKEN_HERE"
echo ""
echo "To start the control panel:"
echo "1. Start backend: cd backend && npm start"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Start ngrok for frontend: ngrok http 5173"
echo "4. Start ngrok for Minecraft: ngrok tcp 25565"
echo ""
echo "Access the control panel at the ngrok URL for port 5173"