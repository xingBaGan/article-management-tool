import { app, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import initIpcMain from './services'

// The built directory structure
//
// ├─┬ dist
// │ ├─┬ main
// │ │ └── index.js    > compiled main code
// │ ├─┬ preload
// │ │ └── index.js    > compiled preload code
// │ └─┬ renderer
// │   └── index.html  > compiled renderer code

// 设置环境变量
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = join(process.env.DIST_ELECTRON, '../renderer')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST_ELECTRON, '../public')

let mainWindow: BrowserWindow | null = null

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    titleBarStyle: 'hidden',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  // 开发环境下加载本地服务
  if (!app.isPackaged) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(process.env.DIST!, 'index.html'))
  }

  mainWindow.setMenuBarVisibility(false)
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