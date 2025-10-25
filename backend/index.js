#!/usr/bin/env node

// Simple health check endpoint for Railway
const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;

// Only start if this file is run directly (not required as module)
if (require.main === module) {
  const server = require('./server');
  server.listen(PORT, () => {
    console.log(`Minecraft Control Panel Backend running on port ${PORT}`);
  });
}

module.exports = app;