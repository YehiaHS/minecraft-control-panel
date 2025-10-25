#!/bin/bash

# Download Minecraft server jar

VERSION="1.20.1"  # Change to desired version
DOWNLOAD_URL="https://piston-data.mojang.com/v1/objects/8f3112a1049751cc472ec13e397eade5336ca7ae/server.jar"

cd minecraft-server

if [ ! -f server.jar ]; then
    echo "Downloading Minecraft server $VERSION..."
    curl -o server.jar $DOWNLOAD_URL
    echo "Download complete."
    
    # Accept EULA
    echo "eula=true" > eula.txt
    echo "EULA accepted."
else
    echo "Server jar already exists."
fi