const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
      allowRunningInsecureContent: true
    }
  });

  // Load the built app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Get path to dist folder inside asar
    const distPath = path.join(__dirname, '../dist');
    const indexPath = path.join(distPath, 'index.html');

    console.log('Loading index from:', indexPath);
    console.log('distPath:', distPath);
    console.log('__dirname:', __dirname);

    // Load with custom protocol to handle relative paths correctly
    mainWindow.loadURL(`file://${indexPath}`).catch(err => {
      console.error('Failed to load index.html:', err);
    });

    // Open DevTools automatically for debugging
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  // Log webContents events
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame) {
      console.error('Failed to load:', errorCode, errorDescription, validatedURL);
    }
  });

  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[Renderer Console] ${level}: ${message}`);
  });

  mainWindow.webContents.on('did-start-loading', () => {
    console.log('Started loading');
  });

  mainWindow.webContents.on('did-stop-loading', () => {
    console.log('Stopped loading');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  console.log('App ready, creating window...');
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});