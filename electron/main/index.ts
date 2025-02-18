import { app, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import initIpcMain from './services'
// 确保路径正确
const ROOT = join(__dirname, '../../..')  // 修改这里，向上三级到项目根目录
const DIST_RENDERER = join(ROOT, 'dist/src/renderer')  // 从根目录进入dist/renderer

// 设置环境变量
process.env.DIST_RENDERER = DIST_RENDERER
process.env.PUBLIC = app.isPackaged ? DIST_RENDERER : join(ROOT, 'public')

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false, // 移除标题栏和边框
    titleBarStyle: 'hidden', // 隐藏标题栏
    webPreferences: {
      contextIsolation: true,
      // nodeIntegration: false,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  // 开发环境下加载本地服务
  if (!app.isPackaged && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
    mainWindow.webContents.openDevTools({
      mode: 'detach'
    })
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'))
  }

  // 添加窗口拖动功能
  mainWindow.setMenuBarVisibility(false) // 隐藏菜单栏

  initIpcMain(mainWindow)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null && app.isPackaged) {
    createWindow()
  }
}) 