import { app, BrowserWindow } from 'electron'
import { join } from 'path'

// 确保路径正确
const ROOT = join(__dirname, '../../..')  // 修改这里，向上三级到项目根目录
const DIST_RENDERER = join(ROOT, 'dist/renderer')  // 从根目录进入dist/renderer

// 设置环境变量
process.env.DIST_RENDERER = DIST_RENDERER
process.env.PUBLIC = app.isPackaged ? DIST_RENDERER : join(ROOT, 'public')

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: join(__dirname, '../preload/index.js')
    }
  })

  // 开发环境下加载本地服务
  if (!app.isPackaged && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools({
      mode: 'detach'
    })
  } else {
    // 生产环境下加载打包后的文件
    const indexHtml = join(DIST_RENDERER, 'index.html')
    console.log('Loading:', indexHtml)  // 添加日志以便调试
    mainWindow.loadFile(indexHtml)
  }
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