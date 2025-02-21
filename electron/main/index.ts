import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import initIpcMain from './services/index.js'

const isDev = !app.isPackaged
const getAssetPath = (...paths: string[]): string => {
  return app.isPackaged
    ? join(process.resourcesPath, 'app.asar', 'out/electron/renderer', ...paths)
    : join(__dirname, '../renderer', ...paths)
}

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
      preload: join(__dirname, '../preload/index.js'),
      webSecurity: false
    }
  })

  if (process.env.ELECTRON_RENDERER_URL) {
    await mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    await mainWindow.loadFile(getAssetPath('index.html'))
  }

  mainWindow.webContents.openDevTools({
    mode: 'detach'
  })

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