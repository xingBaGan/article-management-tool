import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import initIpcMain from './services/index.js'


// Update path configurations for production
const isDev = !app.isPackaged
process.env.DIST_ELECTRON = join(__dirname, '..')
process.env.DIST = isDev ? join(process.env.DIST_ELECTRON, '../dist') : join(process.env.DIST_ELECTRON, '../dist')
process.env.PUBLIC = isDev ? join(process.env.DIST_ELECTRON, '../public') : join(process.env.DIST_ELECTRON, '../public')

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
      preload: join(__dirname, '../preload/index.mjs')
    }
  })

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(process.env.DIST!, 'index.html'))
  }

  initIpcMain(mainWindow)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})