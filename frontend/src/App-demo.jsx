import { useState } from 'react';
import {
  Container, Typography, Button, Box, Paper, Grid,
  TextField, List, ListItem, ListItemText, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Alert, Card, CardContent,
  LinearProgress, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Accordion, AccordionSummary,
  AccordionDetails, ListItemButton, Divider
} from '@mui/material';
import {
  PlayArrow, Stop, Terminal, Folder, Settings,
  Backup, Restore, People, BarChart, ExpandMore,
  Memory, Storage, Schedule, Extension, Chat
} from '@mui/icons-material';

function App() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        Minecraft Server Control Panel
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <strong>Demo Version:</strong> This is a frontend-only demo hosted on GitHub Pages.
        For full functionality, run the backend locally and connect to it.
      </Alert>

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
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Server Status</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label="Demo Mode" color="warning" variant="outlined" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Backend required for live server control
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>Performance</Typography>
              <Typography variant="body2" color="text.secondary">
                Real-time metrics available when connected to backend
              </Typography>
              <LinearProgress variant="determinate" value={65} sx={{ mt: 2 }} />
              <Typography variant="caption">Demo: CPU Usage - 65%</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3, height: 500, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h5" gutterBottom>Console</Typography>
          <Box sx={{ flexGrow: 1, overflow: 'auto', bgcolor: 'black', color: 'white', p: 1, fontFamily: 'monospace', fontSize: '0.875rem' }}>
            <div>[Demo] Server console output would appear here...</div>
            <div>[Demo] Type commands below to interact with server</div>
          </Box>
          <Box sx={{ display: 'flex', mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter command..."
              disabled
            />
            <Button variant="contained" disabled sx={{ ml: 1 }}>
              Send
            </Button>
          </Box>
        </Paper>
      )}

      {tabValue === 2 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400 }}>
              <Typography variant="h5" gutterBottom>Server Files</Typography>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                <ListItem>
                  <ListItemText primary="server.properties" secondary="Configuration file" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="logs/" secondary="Directory" />
                </ListItem>
                <ListItem>
                  <ListItemText primary="plugins/" secondary="Directory" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h5" gutterBottom>File Editor</Typography>
              <Typography variant="body2" color="text.secondary">
                Select a file to edit (requires backend connection)
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {tabValue === 3 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Player Management</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Online players and management tools available with backend
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Player Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>DemoPlayer1</TableCell>
                  <TableCell>
                    <Button size="small" disabled>Kick</Button>
                    <Button size="small" color="error" disabled sx={{ ml: 1 }}>Ban</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 4 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Backup Management</Typography>
          <Button variant="contained" startIcon={<Backup />} disabled sx={{ mb: 3 }}>
            Create New Backup
          </Button>
          <Typography variant="body2" color="text.secondary">
            Backup functionality requires backend server
          </Typography>
        </Paper>
      )}

      {tabValue === 5 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Server Configuration</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Edit server.properties and other configuration files
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="server-name" value="Demo Server" disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField fullWidth label="max-players" value="20" disabled />
            </Grid>
          </Grid>
        </Paper>
      )}

      {tabValue === 6 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Plugin Management</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Install and manage server plugins
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>DemoPlugin</TableCell>
                  <TableCell><Chip label="Demo" variant="outlined" /></TableCell>
                  <TableCell>
                    <Button size="small" disabled>Remove</Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 7 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Server Chat</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Send messages to all players on the server
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              label="Send message to server"
              disabled
            />
            <Button variant="contained" disabled>
              Send
            </Button>
          </Box>
        </Paper>
      )}

      {tabValue === 8 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>Scheduled Tasks</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Automate server restarts, backups, and announcements
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Demo Restart</TableCell>
                  <TableCell>Daily 2:00 AM</TableCell>
                  <TableCell>Server maintenance</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>🚀 How to Use Full Functionality</Typography>
        <Typography variant="body2" paragraph>
          This demo shows the UI only. For full server management capabilities:
        </Typography>
        <ol>
          <li>Run the backend server locally: <code>cd backend && npm start</code></li>
          <li>Start the frontend: <code>cd frontend && npm run dev</code></li>
          <li>Use ngrok for remote access: <code>ngrok http 5173</code></li>
          <li>Connect your Minecraft server to the control panel</li>
        </ol>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <strong>GitHub:</strong> <a href="https://github.com" target="_blank" rel="noopener noreferrer">View source code</a>
        </Typography>
      </Paper>
    </Container>
  );
}

export default App;