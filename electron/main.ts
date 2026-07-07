import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    }
  });

  // Load the built app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the asar archive
    const indexPath = path.join(__dirname, '../dist/index.html');
    console.log('Loading app from:', indexPath);
    mainWindow.loadFile(indexPath).then(() => {
      // 桌面应用自动授予管理员权限
      mainWindow?.webContents.executeJavaScript('localStorage.setItem("quiz_admin","1")');
    }).catch(err => {
      console.error('Failed to load index.html:', err);
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

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

// ─── 查找 Node.js 可执行文件路径（兼容 fnm/nvm 等版本管理器）──────
function findNodePath(): string {
  const userProfile = process.env.USERPROFILE || process.env.HOME || '';
  const candidates: string[] = [];

  // fnm (Fast Node Manager)
  try {
    const fnmBase = path.join(userProfile, 'AppData', 'Roaming', 'fnm', 'node-versions');
    if (fs.existsSync(fnmBase)) {
      const versions = fs.readdirSync(fnmBase).sort().reverse();
      for (const v of versions) {
        candidates.push(path.join(fnmBase, v, 'installation', 'node.exe'));
      }
    }
  } catch {}

  // nvm for Windows
  try {
    const nvmHome = process.env.NVM_HOME;
    if (nvmHome && fs.existsSync(nvmHome)) {
      const versions = fs.readdirSync(nvmHome).sort().reverse();
      for (const v of versions) {
        candidates.push(path.join(nvmHome, v, 'node.exe'));
      }
    }
  } catch {}

  // 标准安装路径
  candidates.push(
    'C:\\Program Files\\nodejs\\node.exe',
    'C:\\Program Files (x86)\\nodejs\\node.exe',
  );

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return 'node'; // 最终回退到 PATH
}

// ─── IPC: 同步题库到 GitHub Pages 发布源 ──────────────────────────
ipcMain.handle('sync-published-questions', async (_event, questionsJSON: string) => {
  try {
    // 项目根目录：resources 向上三级
    const projectRoot = path.resolve(process.resourcesPath, '../../..');
    const exportPath = path.join(projectRoot, '.questions-export.json');
    const scriptPath = path.join(projectRoot, 'scripts', 'write-and-deploy.mjs');

    // 写临时 JSON 文件
    fs.writeFileSync(exportPath, questionsJSON, 'utf8');

    // 查找 node 可执行路径（兼容 fnm/nvm 等版本管理器）
    const nodeExe = findNodePath();

    // 运行 write-and-deploy 脚本
    await new Promise<void>((resolve, reject) => {
      exec(`"${nodeExe}" "${scriptPath}"`, { cwd: projectRoot, maxBuffer: 50 * 1024 * 1024 }, (err) => {
        try { fs.unlinkSync(exportPath); } catch {}
        if (err) reject(err);
        else resolve();
      });
    });

    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
});