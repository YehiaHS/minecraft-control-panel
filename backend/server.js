const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs-extra');
const { spawn } = require('child_process');
const si = require('systeminformation');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Basic authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader('WWW-Authenticate', 'Basic');
    return res.status(401).send('Authentication required');
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === process.env.USERNAME && password === process.env.PASSWORD) {
    return next();
  } else {
    return res.status(401).send('Invalid credentials');
  }
};

// Apply auth to all API routes
app.use('/api', authenticate);

// Minecraft server directory
const SERVER_DIR = path.join(__dirname, '../minecraft-server');
const BACKUP_DIR = path.join(__dirname, '../backups');

// Ensure directories exist
fs.ensureDirSync(SERVER_DIR);
fs.ensureDirSync(BACKUP_DIR);

// Server status
let serverProcess = null;
let isServerRunning = false;

// API Routes
app.get('/api/status', (req, res) => {
  res.json({
    running: isServerRunning,
    pid: serverProcess ? serverProcess.pid : null
  });
});

app.get('/api/performance', async (req, res) => {
  try {
    const [cpu, mem, load] = await Promise.all([
      si.cpu(),
      si.mem(),
      si.currentLoad()
    ]);

    res.json({
      cpu: {
        usage: Math.round(load.currentLoad),
        cores: cpu.cores,
        manufacturer: cpu.manufacturer,
        brand: cpu.brand
      },
      memory: {
        total: mem.total,
        used: mem.used,
        free: mem.free,
        usage: Math.round((mem.used / mem.total) * 100)
      },
      uptime: si.time().uptime
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/start', async (req, res) => {
  if (isServerRunning) {
    return res.status(400).json({ error: 'Server is already running' });
  }

  try {
    // Check if server.jar exists
    if (!await fs.pathExists(JAR_FILE)) {
      return res.status(400).json({ error: 'Server jar not found. Please upload server.jar first.' });
    }

    // Start Minecraft server
    serverProcess = spawn('java', ['-Xmx1024M', '-Xms1024M', '-jar', 'server.jar', 'nogui'], {
      cwd: SERVER_DIR,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    isServerRunning = true;

    // Handle server output
    serverProcess.stdout.on('data', (data) => {
      io.emit('console-output', data.toString());
    });

    serverProcess.stderr.on('data', (data) => {
      io.emit('console-output', data.toString());
    });

    serverProcess.on('close', (code) => {
      isServerRunning = false;
      io.emit('server-stopped', { code });
    });

    res.json({ message: 'Server starting...' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/stop', (req, res) => {
  if (!isServerRunning || !serverProcess) {
    return res.status(400).json({ error: 'Server is not running' });
  }

  // Send stop command
  serverProcess.stdin.write('stop\n');
  res.json({ message: 'Stopping server...' });
});

app.post('/api/command', (req, res) => {
  if (!isServerRunning || !serverProcess) {
    return res.status(400).json({ error: 'Server is not running' });
  }

  const { command } = req.body;
  serverProcess.stdin.write(command + '\n');
  res.json({ message: 'Command sent' });
});

app.get('/api/players', (req, res) => {
  // This would need to be implemented by parsing server output or using RCON
  // For now, return a placeholder
  res.json({
    online: 0,
    max: 20,
    players: []
  });
});

app.post('/api/players/kick', (req, res) => {
  const { player } = req.body;
  if (!player) return res.status(400).json({ error: 'Player name required' });

  serverProcess.stdin.write(`kick ${player}\n`);
  res.json({ message: `Kicked player: ${player}` });
});

app.post('/api/players/ban', (req, res) => {
  const { player } = req.body;
  if (!player) return res.status(400).json({ error: 'Player name required' });

  serverProcess.stdin.write(`ban ${player}\n`);
  res.json({ message: `Banned player: ${player}` });
});

// File management
app.get('/api/files', async (req, res) => {
  try {
    const files = await fs.readdir(SERVER_DIR);
    const fileDetails = await Promise.all(files.map(async (file) => {
      const filePath = path.join(SERVER_DIR, file);
      const stats = await fs.stat(filePath);
      return {
        name: file,
        size: stats.size,
        isDirectory: stats.isDirectory(),
        modified: stats.mtime
      };
    }));
    res.json(fileDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/files/:filename', async (req, res) => {
  try {
    const filePath = path.join(SERVER_DIR, req.params.filename);
    const content = await fs.readFile(filePath, 'utf8');
    res.send(content);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/files/:filename', async (req, res) => {
  try {
    const filePath = path.join(SERVER_DIR, req.params.filename);
    await fs.writeFile(filePath, req.body.content);
    res.json({ message: 'File saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Backup endpoints
app.post('/api/backup', async (req, res) => {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${timestamp}`;
    const backupPath = path.join(BACKUP_DIR, backupName);

    await fs.copy(SERVER_DIR, backupPath);
    res.json({ message: 'Backup created', name: backupName });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/backups', async (req, res) => {
  try {
    const backups = await fs.readdir(BACKUP_DIR);
    const backupDetails = await Promise.all(backups.map(async (backup) => {
      const backupPath = path.join(BACKUP_DIR, backup);
      const stats = await fs.stat(backupPath);
      return {
        name: backup,
        size: stats.size,
        created: stats.birthtime
      };
    }));
    res.json(backupDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/backup/restore/:name', async (req, res) => {
  try {
    const backupName = req.params.name;
    const backupPath = path.join(BACKUP_DIR, backupName);

    if (!await fs.pathExists(backupPath)) {
      return res.status(404).json({ error: 'Backup not found' });
    }

    // Stop server if running
    if (isServerRunning) {
      serverProcess.kill();
      isServerRunning = false;
    }

    // Clear server directory and restore
    await fs.emptyDir(SERVER_DIR);
    await fs.copy(backupPath, SERVER_DIR);

    res.json({ message: 'Backup restored successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server configuration
app.get('/api/config', async (req, res) => {
  try {
    const configPath = path.join(SERVER_DIR, 'server.properties');
    if (!await fs.pathExists(configPath)) {
      return res.status(404).json({ error: 'server.properties not found' });
    }

    const content = await fs.readFile(configPath, 'utf8');
    const config = {};

    content.split('\n').forEach(line => {
      if (line.trim() && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          config[key.trim()] = valueParts.join('=').trim();
        }
      }
    });

    res.json(config);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/config', async (req, res) => {
  try {
    const configPath = path.join(SERVER_DIR, 'server.properties');
    const config = req.body;

    let content = '#Minecraft server properties\n';
    Object.entries(config).forEach(([key, value]) => {
      content += `${key}=${value}\n`;
    });

    await fs.writeFile(configPath, content);
    res.json({ message: 'Configuration saved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logs
app.get('/api/logs', async (req, res) => {
  try {
    const logsDir = path.join(SERVER_DIR, 'logs');
    const latestLog = path.join(logsDir, 'latest.log');

    if (!await fs.pathExists(latestLog)) {
      return res.json({ logs: [] });
    }

    const content = await fs.readFile(latestLog, 'utf8');
    const logs = content.split('\n').filter(line => line.trim());

    res.json({ logs: logs.slice(-1000) }); // Last 1000 lines
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Plugin management
const PLUGINS_DIR = path.join(SERVER_DIR, 'plugins');

app.get('/api/plugins', async (req, res) => {
  try {
    if (!await fs.pathExists(PLUGINS_DIR)) {
      return res.json({ plugins: [] });
    }

    const files = await fs.readdir(PLUGINS_DIR);
    const plugins = await Promise.all(files.filter(file => file.endsWith('.jar')).map(async (file) => {
      const filePath = path.join(PLUGINS_DIR, file);
      const stats = await fs.stat(filePath);
      return {
        name: file.replace('.jar', ''),
        file: file,
        size: stats.size,
        enabled: true // For now, assume all are enabled
      };
    }));

    res.json({ plugins });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/plugins/install', async (req, res) => {
  const { url, name } = req.body;
  if (!url || !name) return res.status(400).json({ error: 'URL and name required' });

  try {
    // Download plugin
    const pluginPath = path.join(PLUGINS_DIR, `${name}.jar`);
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    await fs.writeFile(pluginPath, Buffer.from(buffer));

    res.json({ message: 'Plugin installed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/plugins/:name', async (req, res) => {
  try {
    const pluginPath = path.join(PLUGINS_DIR, `${req.params.name}.jar`);
    if (!await fs.pathExists(pluginPath)) {
      return res.status(404).json({ error: 'Plugin not found' });
    }

    await fs.unlink(pluginPath);
    res.json({ message: 'Plugin removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat integration
app.post('/api/chat', (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  if (!isServerRunning || !serverProcess) {
    return res.status(400).json({ error: 'Server is not running' });
  }

  serverProcess.stdin.write(`say ${message}\n`);
  res.json({ message: 'Message sent to server chat' });
});

// Scheduled maintenance
let scheduledTasks = [];

app.get('/api/schedules', (req, res) => {
  res.json({ schedules: scheduledTasks });
});

app.post('/api/schedules', (req, res) => {
  const { type, time, message } = req.body;
  if (!type || !time) return res.status(400).json({ error: 'Type and time required' });

  const schedule = {
    id: Date.now().toString(),
    type, // 'restart', 'backup', 'message'
    time: new Date(time).toISOString(),
    message: message || '',
    enabled: true
  };

  scheduledTasks.push(schedule);

  // Schedule the task
  const delay = new Date(time) - new Date();
  if (delay > 0) {
    setTimeout(() => {
      executeScheduledTask(schedule);
    }, delay);
  }

  res.json({ message: 'Task scheduled', schedule });
});

app.delete('/api/schedules/:id', (req, res) => {
  const index = scheduledTasks.findIndex(task => task.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Schedule not found' });

  scheduledTasks.splice(index, 1);
  res.json({ message: 'Schedule removed' });
});

function executeScheduledTask(task) {
  switch (task.type) {
    case 'restart':
      if (isServerRunning) {
        serverProcess.kill();
        setTimeout(() => {
          // Restart logic would go here
          console.log('Server restart scheduled');
        }, 5000);
      }
      break;
    case 'backup':
      // Trigger backup
      console.log('Backup scheduled');
      break;
    case 'message':
      if (isServerRunning && task.message) {
        serverProcess.stdin.write(`say ${task.message}\n`);
      }
      break;
  }
}

// Theme customization
let userPreferences = {
  theme: 'dark',
  language: 'en',
  notifications: true
};

app.get('/api/preferences', (req, res) => {
  res.json(userPreferences);
});

app.put('/api/preferences', (req, res) => {
  userPreferences = { ...userPreferences, ...req.body };
  res.json({ message: 'Preferences updated', preferences: userPreferences });
});

// Socket.io for real-time console
io.on('connection', (socket) => {
  console.log('Client connected');
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});