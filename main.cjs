"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const isDev = process.env.NODE_ENV === 'development';
let mainWindow = null;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            preload: path_1.default.join(__dirname, 'preload.js'),
        }
    });
    // Load the built app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        // In production, load from the asar archive
        const indexPath = path_1.default.join(__dirname, '../dist/index.html');
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
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
// ─── 查找 Node.js 可执行文件路径（兼容 fnm/nvm 等版本管理器）──────
function findNodePath() {
    const userProfile = process.env.USERPROFILE || process.env.HOME || '';
    const candidates = [];
    // fnm (Fast Node Manager)
    try {
        const fnmBase = path_1.default.join(userProfile, 'AppData', 'Roaming', 'fnm', 'node-versions');
        if (fs_1.default.existsSync(fnmBase)) {
            const versions = fs_1.default.readdirSync(fnmBase).sort().reverse();
            for (const v of versions) {
                candidates.push(path_1.default.join(fnmBase, v, 'installation', 'node.exe'));
            }
        }
    }
    catch { }
    // nvm for Windows
    try {
        const nvmHome = process.env.NVM_HOME;
        if (nvmHome && fs_1.default.existsSync(nvmHome)) {
            const versions = fs_1.default.readdirSync(nvmHome).sort().reverse();
            for (const v of versions) {
                candidates.push(path_1.default.join(nvmHome, v, 'node.exe'));
            }
        }
    }
    catch { }
    // 标准安装路径
    candidates.push('C:\\Program Files\\nodejs\\node.exe', 'C:\\Program Files (x86)\\nodejs\\node.exe');
    for (const p of candidates) {
        if (fs_1.default.existsSync(p))
            return p;
    }
    return 'node'; // 最终回退到 PATH
}
// ─── IPC: 同步题库到 Netlify ──────────────────────────────────
electron_1.ipcMain.handle('sync-to-netlify', async (_event, questionsJSON) => {
    try {
        // 项目根目录：resources 向上三级
        const projectRoot = path_1.default.resolve(process.resourcesPath, '../../..');
        const exportPath = path_1.default.join(projectRoot, '.questions-export.json');
        const scriptPath = path_1.default.join(projectRoot, 'scripts', 'write-and-deploy.mjs');
        // 写临时 JSON 文件
        fs_1.default.writeFileSync(exportPath, questionsJSON, 'utf8');
        // 查找 node 可执行路径（兼容 fnm/nvm 等版本管理器）
        const nodeExe = findNodePath();
        // 运行 write-and-deploy 脚本
        await new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`"${nodeExe}" "${scriptPath}"`, { cwd: projectRoot, maxBuffer: 50 * 1024 * 1024 }, (err) => {
                try {
                    fs_1.default.unlinkSync(exportPath);
                }
                catch { }
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
        return { success: true };
    }
    catch (e) {
        return { success: false, error: e.message };
    }
});
