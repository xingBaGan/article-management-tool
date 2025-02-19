import { ipcMain, dialog, app } from "electron"
import type { BrowserWindow } from "electron"
import { readFoldsData, readTextFiles, saveFoldsJsonData } from "./fileService"
import type { Folder } from "../../../packages/types"
import { join } from "path"
import { getDocuments, buildContentLayer } from "./contentLayerService"
function initIpcMain(mainWindow: BrowserWindow) {
  // 添加在createWindow函数之后
  ipcMain.handle('window-minimize', () => {
    mainWindow?.minimize()
  })

  ipcMain.handle('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      mainWindow.unmaximize()
      mainWindow.webContents.send('window-unmaximized')
    } else {
      mainWindow?.maximize()
      mainWindow?.webContents.send('window-maximized')
    }
  })

  ipcMain.handle('window-close', () => {
    mainWindow?.close()
  })

  // 文件处理相关
  ipcMain.handle('read-directory', async (_, dirPath: string) => {
    try {
      const files = await readTextFiles(dirPath)
      return { success: true, data: files }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // 选择文件夹
  ipcMain.handle('select-directory', async (_) => {
    try {
      const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
      })
      
      if (!result.canceled && result.filePaths.length > 0) {
        const files = await readTextFiles(result.filePaths[0])
        return { success: true, data: files }
      }
      return { success: false, error: 'No directory selected' }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // 读取文件夹路径下所有文件
  ipcMain.handle('read-directory-files', async (_, dirPath: string) => {
    try {
      const files = await readTextFiles(dirPath)
      return { success: true, data: files }
    } catch (error) {
      return { success: false, error: (error as Error).message }
    }
  })

  // save folders
  ipcMain.handle('save-folders', async (_, folders: Folder[]) => {
    await saveFoldsJsonData(folders, join(app.getPath('userData'), 'files.json'))
  })

  // load articles
  ipcMain.handle('get-articles', async () => {
    const folders = await readFoldsData()
    return folders
  })

  // get documents
  ipcMain.handle('get-documents', async () => {
    const documents = await getDocuments()
    return documents
  })

  // build content layer
  ipcMain.handle('build-content-layer', async () => {
    const result = await buildContentLayer()
    return result
  })
}

export default initIpcMain
