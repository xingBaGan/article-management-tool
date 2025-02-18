import { ipcMain, dialog } from "electron"
import type { BrowserWindow } from "electron"
import { readTextFiles } from "./fileService"
import type { FileInfo } from "../../../packages/types"
function initIpcMain(mainWindow: BrowserWindow) {
  // 添加在createWindow函数之后
  ipcMain.handle('window-minimize', () => {
    console.log('window-minimize')
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
}

export default initIpcMain
