import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import {
  Container, Typography, Button, Box, Paper, Grid,
  TextField, List, ListItem, ListItemText, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, CircularProgress, Alert, Card, CardContent,
  LinearProgress, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Accordion, AccordionSummary,
  AccordionDetails, ListItemButton, Divider
} from '@mui/material';
import {
  PlayArrow, Stop, Terminal, Folder, Settings,
  Backup, Restore, People, BarChart, ExpandMore,
  Memory, Cpu, Storage, Schedule, Extension, Chat
} from '@mui/icons-material';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
function App() {
  const [serverStatus, setServerStatus] = useState({ running: false, pid: null });
  const [performance, setPerformance] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [command, setCommand] = useState('');
  const [files, setFiles] = useState([]);
  const [backups, setBackups] = useState([]);
  const [players, setPlayers] = useState([]);
  const [config, setConfig] = useState({});
  const [logs, setLogs] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [plugins, setPlugins] = useState([]);
  const [chatMessage, setChatMessage] = useState('');
  const [schedules, setSchedules] = useState([]);
  const [preferences, setPreferences] = useState({ theme: 'dark', language: 'en', notifications: true });  // Set up axios auth
  useEffect(() => {
    if (authenticated) {
      axios.defaults.auth = {
        username: loginData.username,
        password: loginData.password
      };
      const socket = io('http://localhost:3001');
      
      checkStatus();
      loadFiles();
      loadBackups();
      loadPlayers();
      loadConfig();
      loadLogs();
      loadPerformance();
      loadPlugins();
      loadSchedules();

      socket.on('console-output', (data) => {
        setConsoleOutput(prev => [...prev, data]);
      });

      socket.on('server-stopped', () => {
        setServerStatus({ running: false, pid: null });
      });

      // Update performance every 5 seconds
      const performanceInterval = setInterval(loadPerformance, 5000);

      return () => {
        socket.off('console-output');
        socket.off('server-stopped');
        clearInterval(performanceInterval);
      };
    }
  }, [authenticated]);

  const handleLogin = async () => {
    try {
      axios.defaults.auth = {
        username: loginData.username,
        password: loginData.password
      };
      await axios.get('/api/status');
      setAuthenticated(true);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const checkStatus = async () => {
    try {
      const response = await axios.get('/api/status');
      setServerStatus(response.data);
    } catch (err) {
      setError('Failed to check server status');
    }
  };

  const loadFiles = async () => {
    try {
      const response = await axios.get('/api/files');
      setFiles(response.data);
    } catch (err) {
      setError('Failed to load files');
    }
  };

  const startServer = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/start');
      setTimeout(checkStatus, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start server');
    }
    setLoading(false);
  };

  const stopServer = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post('/api/stop');
    } catch (err) {
      setError('Failed to stop server');
    }
    setLoading(false);
  };

  const sendCommand = async () => {
    if (!command.trim()) return;
    try {
      await axios.post('/api/command', { command });
      setCommand('');
    } catch (err) {
      setError('Failed to send command');
    }
  };

  const openFile = async (file) => {
    if (file.isDirectory) return;
    try {
      const response = await axios.get(`/api/files/${file.name}`);
      setFileContent(response.data);
      setSelectedFile(file);
    } catch (err) {
      setError('Failed to load file');
    }
  };

  const saveFile = async () => {
    try {
      await axios.put(`/api/files/${selectedFile.name}`, { content: fileContent });
      setError('');
      alert('File saved successfully');
    } catch (err) {
      setError('Failed to save file');
    }
  };

  const loadPerformance = async () => {
    try {
      const response = await axios.get('/api/performance');
      setPerformance(response.data);
    } catch (err) {
      console.error('Failed to load performance data');
    }
  };

  const loadBackups = async () => {
    try {
      const response = await axios.get('/api/backups');
      setBackups(response.data);
    } catch (err) {
      setError('Failed to load backups');
    }
  };

  const createBackup = async () => {
    try {
      await axios.post('/api/backup');
      loadBackups();
      alert('Backup created successfully');
    } catch (err) {
      setError('Failed to create backup');
    }
  };

  const restoreBackup = async (backupName) => {
    if (!confirm(`Are you sure you want to restore backup: ${backupName}? This will stop the server and replace all files.`)) return;
    try {
      await axios.post(`/api/backup/restore/${backupName}`);
      alert('Backup restored successfully');
      checkStatus();
      loadFiles();
    } catch (err) {
      setError('Failed to restore backup');
    }
  };

  const loadPlayers = async () => {
    try {
      const response = await axios.get('/api/players');
      setPlayers(response.data.players || []);
    } catch (err) {
      console.error('Failed to load players');
    }
  };

  const kickPlayer = async (player) => {
    try {
      await axios.post('/api/players/kick', { player });
      alert(`Kicked player: ${player}`);
    } catch (err) {
      setError('Failed to kick player');
    }
  };

  const banPlayer = async (player) => {
    try {
      await axios.post('/api/players/ban', { player });
      alert(`Banned player: ${player}`);
    } catch (err) {
      setError('Failed to ban player');
    }
  };

  const loadConfig = async () => {
    try {
      const response = await axios.get('/api/config');
      setConfig(response.data);
    } catch (err) {
      console.error('Failed to load config');
    }
  };

  const saveConfig = async () => {
    try {
      await axios.put('/api/config', config);
      alert('Configuration saved successfully');
    } catch (err) {
      setError('Failed to save configuration');
    }
  };

  const loadLogs = async () => {
    try {
      const response = await axios.get('/api/logs');
      setLogs(response.data.logs || []);
    } catch (err) {
      console.error('Failed to load logs');
    }
  };

  const loadPlugins = async () => {
    try {
      const response = await axios.get('/api/plugins');
      setPlugins(response.data.plugins || []);
    } catch (err) {
      console.error('Failed to load plugins');
    }
  };

  const loadSchedules = async () => {
    try {
      const response = await axios.get('/api/schedules');
      setSchedules(response.data.schedules || []);
    } catch (err) {
      console.error('Failed to load schedules');
    }
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim()) return;
    try {
      await axios.post('/api/chat', { message: chatMessage });
      setChatMessage('');
      alert('Message sent to server chat');
    } catch (err) {
      setError('Failed to send chat message');
    }
  };

  if (!authenticated) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Card sx={{ minWidth: 300 }}>
          <CardContent>
            <Typography variant="h5" component="h1" gutterBottom align="center">
              Minecraft Control Panel
            </Typography>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <TextField
              fullWidth
              label="Username"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<Login />}
              onClick={handleLogin}
            >
              Login
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Minecraft Server Control Panel
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab icon={<BarChart />} label="Dashboard" />
          <Tab icon={<Terminal />} label="Console" />
          <Tab icon={<Folder />} label="Files" />
          <Tab icon={<People />} label="Players" />
          <Tab icon={<Backup />} label="Backups" />
          <Tab icon={<Settings />} label="Settings" />
          <Tab icon={<Extension />} label="Plugins" />
          <Tab icon={<Chat />} label="Chat" />
          <Tab icon={<Schedule />} label="Schedules" />
        </Tabs>
      </Box>

      {tabValue === 0 && (
        <Grid container spacing={3}>
          {/* Server Status */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Server Status</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip
                  label={serverStatus.running ? 'Running' : 'Stopped'}
                  color={serverStatus.running ? 'success' : 'default'}
                  variant="outlined"
                />
                {serverStatus.pid && (
                  <Chip label={`PID: ${serverStatus.pid}`} variant="outlined" />
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={loading ? <CircularProgress size={20} /> : <PlayArrow />}
                  onClick={startServer}
                  disabled={loading || serverStatus.running}
                  fullWidth
                >
                  Start Server
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Stop />}
                  onClick={stopServer}
                  disabled={loading || !serverStatus.running}
                  fullWidth
                >
                  Stop Server
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Performance */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Performance</Typography>
              {performance ? (
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Cpu color="primary" />
                      <Box>
                        <Typography variant="body2">CPU Usage</Typography>
                        <Typography variant="h6">{performance.cpu.usage}%</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Memory color="primary" />
                      <Box>
                        <Typography variant="body2">Memory</Typography>
                        <Typography variant="h6">{performance.memory.usage}%</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <LinearProgress variant="determinate" value={performance.cpu.usage} sx={{ mb: 1 }} />
                    <Typography variant="caption">CPU: {performance.cpu.brand} ({performance.cpu.cores} cores)</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <LinearProgress variant="determinate" value={performance.memory.usage} sx={{ mb: 1 }} />
                    <Typography variant="caption">
                      Memory: {(performance.memory.used / 1024 / 1024 / 1024).toFixed(1)}GB / {(performance.memory.total / 1024 / 1024 / 1024).toFixed(1)}GB
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Typography>Loading performance data...</Typography>
              )}
            </Paper>
          </Grid>

          {/* Players */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Online Players ({players.length})</Typography>
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {players.length > 0 ? players.map((player, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={player} />
                    <IconButton size="small" onClick={() => kickPlayer(player)}>
                      <Stop />
                    </IconButton>
                  </ListItem>
                )) : (
                  <ListItem>
                    <ListItemText primary="No players online" />
                  </ListItem>
                )}
              </List>
            </Paper>
          </Grid>

          {/* Recent Backups */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Recent Backups</Typography>
              <List sx={{ maxHeight: 200, overflow: 'auto' }}>
                {backups.slice(0, 5).map((backup) => (
                  <ListItem key={backup.name}>
                    <ListItemText
                      primary={backup.name}
                      secondary={new Date(backup.created).toLocaleString()}
                    />
                    <IconButton size="small" onClick={() => restoreBackup(backup.name)}>
                      <Restore />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                startIcon={<Backup />}
                onClick={createBackup}
                sx={{ mt: 2 }}
                fullWidth
              >
                Create Backup
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 500, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom>Live Console</Typography>
              <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'black', color: 'white', p: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {consoleOutput.map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </Box>
              <Box sx={{ display: 'flex', mt: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter command..."
                  value={command}
                  onChange={(e) => setCommand(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendCommand()}
                  disabled={!serverStatus.running}
                />
                <Button
                  variant="contained"
                  onClick={sendCommand}
                  disabled={!serverStatus.running}
                  sx={{ ml: 1 }}
                >
                  Send
                </Button>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 500, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom>Server Logs</Typography>
              <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: '#f5f5f5', p: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
                {logs.map((line, index) => (
                  <div key={index} style={{ marginBottom: '2px' }}>{line}</div>
                ))}
              </Box>
              <Button
                variant="outlined"
                onClick={loadLogs}
                sx={{ mt: 2 }}
                fullWidth
              >
                Refresh Logs
              </Button>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h5" gutterBottom>Server Files</Typography>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {files.map((file) => (
                  <ListItem
                    key={file.name}
                    button
                    onClick={() => openFile(file)}
                    sx={{ cursor: file.isDirectory ? 'default' : 'pointer' }}
                  >
                    <ListItemText
                      primary={file.name}
                      secondary={file.isDirectory ? 'Directory' : `${(file.size / 1024).toFixed(1)} KB`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom>
                File Editor {selectedFile && `- ${selectedFile.name}`}
              </Typography>
              {selectedFile ? (
                <>
                  <TextField
                    multiline
                    fullWidth
                    rows={15}
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    sx={{ flexGrow: 1, mb: 2 }}
                  />
                  <Button variant="contained" onClick={saveFile}>
                    Save File
                  </Button>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select a file to edit
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Player Management</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Player Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {players.map((player, index) => (
                  <TableRow key={index}>
                    <TableCell>{player}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => kickPlayer(player)}>Kick</Button>
                      <Button size="small" color="error" onClick={() => banPlayer(player)} sx={{ ml: 1 }}>Ban</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 4 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Backup Management</Typography>
          <Button
            variant="contained"
            startIcon={<Backup />}
            onClick={createBackup}
            sx={{ mb: 3 }}
          >
            Create New Backup
          </Button>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Backup Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.name}>
                    <TableCell>{backup.name}</TableCell>
                    <TableCell>{(backup.size / 1024 / 1024).toFixed(1)} MB</TableCell>
                    <TableCell>{new Date(backup.created).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button size="small" onClick={() => restoreBackup(backup.name)}>Restore</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 5 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Server Configuration</Typography>
          <Grid container spacing={2}>
            {Object.entries(config).map(([key, value]) => (
              <Grid item xs={12} md={6} key={key}>
                <TextField
                  fullWidth
                  label={key}
                  value={value}
                  onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                />
              </Grid>
            ))}
          </Grid>
          <Button
            variant="contained"
            onClick={saveConfig}
            sx={{ mt: 3 }}
          >
            Save Configuration
          </Button>
        </Paper>
      )}

        {/* Console */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>Console</Typography>
            <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'black', color: 'white', p: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {consoleOutput.map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </Box>
            <Box sx={{ display: 'flex', mt: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter command..."
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendCommand()}
                disabled={!serverStatus.running}
              />
              <Button
                variant="contained"
                onClick={sendCommand}
                disabled={!serverStatus.running}
                sx={{ ml: 1 }}
              >
                Send
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* File Manager */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h5" gutterBottom>Server Files</Typography>
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {files.map((file) => (
                <ListItem
                  key={file.name}
                  button
                  onClick={() => openFile(file)}
                  sx={{ cursor: file.isDirectory ? 'default' : 'pointer' }}
                >
                  <ListItemText
                    primary={file.name}
                    secondary={file.isDirectory ? 'Directory' : `${(file.size / 1024).toFixed(1)} KB`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* File Editor */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom>
              File Editor {selectedFile && `- ${selectedFile.name}`}
            </Typography>
            {selectedFile ? (
              <>
                <TextField
                  multiline
                  fullWidth
                  rows={15}
                  value={fileContent}
                  onChange={(e) => setFileContent(e.target.value)}
                  sx={{ flexGrow: 1, mb: 2 }}
                />
                <Button variant="contained" onClick={saveFile}>
                  Save File
                </Button>
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Select a file to edit
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {tabValue === 6 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Plugin Management</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plugins.map((plugin) => (
                  <TableRow key={plugin.name}>
                    <TableCell>{plugin.name}</TableCell>
                    <TableCell>{(plugin.size / 1024).toFixed(1)} KB</TableCell>
                    <TableCell>
                      <Chip label={plugin.enabled ? 'Enabled' : 'Disabled'} color={plugin.enabled ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell>
                      <Button size="small" color="error">Remove</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 7 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Server Chat</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Send message to server"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <Button variant="contained" onClick={sendChatMessage}>
              Send
            </Button>
          </Box>
        </Paper>
      )}

      {tabValue === 8 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Scheduled Tasks</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {schedules.map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell>{schedule.type}</TableCell>
                    <TableCell>{new Date(schedule.time).toLocaleString()}</TableCell>
                    <TableCell>{schedule.message}</TableCell>
                    <TableCell>
                      <Button size="small" color="error">Remove</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Container>
  );
}

export default App;