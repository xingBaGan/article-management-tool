import { ipcMain, dialog, app } from "electron"
import type { BrowserWindow } from "electron"
import { getSettings, readFoldsData, readTextFiles, saveFoldsJsonData, saveSettings } from "./fileService"
import type { ArticleInfo, Folder } from "../../../packages/types"
import { join } from "path"
import { getDocuments, buildContentLayer } from "./contentLayerService"
import fs from "fs/promises"
import { getIsInitialed, initRepo, pushRepo } from './gitService'
import { logger } from './logService'
import { TemplatesService } from './templatesService'

function initIpcMain(mainWindow: BrowserWindow) {
  // 将 项目 data 下的书，拷贝到 userData  content目录下
  
  // 添加在createWindow函数之后
  ipcMain.handle('window-minimize', () => {
    logger.debug('Window minimized')
    mainWindow?.minimize()
  })

  ipcMain.handle('window-maximize', () => {
    if (mainWindow?.isMaximized()) {
      logger.debug('Window unmaximized')
      mainWindow.unmaximize()
      mainWindow.webContents.send('window-unmaximized')
    } else {
      logger.debug('Window maximized')
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

  // delete article
  ipcMain.handle('delete-article', async (_, folderId: string, articleId: string) => {
    try {
      // 获取文件夹数据
      const foldersData = await readFoldsData();
      const folder = foldersData.find((f: Folder) => f.id === folderId);
      
      if (folder) {
        // 找到要删除的文章
        const article = folder.articles.find((a: ArticleInfo) => a.id === articleId);
        if (article && article.newPath) {
          // 删除物理文件
          await fs.unlink(article.newPath);
          
          // 更新文件夹数据
          folder.articles = folder.articles.filter((a: ArticleInfo) => a.id !== articleId);
          await saveFoldsJsonData(foldersData, join(app.getPath('userData'), 'files.json'));
          mainWindow?.webContents.send('reload-articles')
          return { success: true };
        }
      }
      return { success: false, error: 'Article not found' };
    } catch (error) {
      return { success: false, error };
    }
  });

  // delete folder
  ipcMain.handle('delete-folder', async (_, folderId: string) => {
    try {
      const foldersData = await readFoldsData();
      const folder = foldersData.find((f: Folder) => f.id === folderId);
      
      if (folder) {
        // 删除文件夹下的所有文件
        for (const article of folder.articles) {
          if (article.newPath) {
            await fs.unlink(article.newPath);
          }
        }
        
        // 更新文件夹数据
        const updatedFolders = foldersData.filter((f: Folder) => f.id !== folderId);
        await saveFoldsJsonData(updatedFolders, join(app.getPath('userData'), 'files.json'));
        mainWindow?.webContents.send('reload-articles');
        return { success: true };
      }
      return { success: false, error: 'Folder not found' };
    } catch (error) {
      return { success: false, error };
    }
  });

  ipcMain.handle('get-settings', async () => {
    const settings = await getSettings()
    return settings
  })

  ipcMain.handle('save-settings', async (_, settings: any) => {
    await saveSettings(settings)
  })

  ipcMain.handle('init-repo', async (_, repoUrl: string) => {
    return await initRepo(repoUrl);
  });

  ipcMain.handle('push-repo', async (_, force: boolean = false) => {
    return await pushRepo(force);
  });

  ipcMain.handle('get-is-initialed', async () => {
    return await getIsInitialed();
  });

  // Add logging handler
  ipcMain.handle('log', async (_, { level, message, meta }) => {
    switch (level) {
      case 'info':
        await logger.info(message, meta);
        break;
      case 'error':
        await logger.error(message, meta);
        break;
      case 'warn':
        await logger.warn(message, meta);
        break;
      case 'debug':
        await logger.debug(message, meta);
        break;
    }
  });

  const templatesService = new TemplatesService()

  // 注册模板相关的处理程序
  ipcMain.handle('template:initialize', async (_, templateName: string, templateUrl: string) => {
    return await templatesService.initializeBlogTemplate(templateName, templateUrl)
  })

  ipcMain.handle('template:update', async (_, templateName: string) => {
    return await templatesService.updateBlogTemplate(templateName)
  })

  ipcMain.handle('template:is-exists', async (_, templateName: string) => {
    return await templatesService.isTemplateExists(templateName)
  })
}

export default initIpcMain
