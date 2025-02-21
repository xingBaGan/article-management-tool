import { contextBridge, ipcRenderer } from 'electron'
import { Folder } from "../../packages/types"

interface Settings {
  repoUrl?: string;
  // 添加其他设置属性
}

// Add logging interface
interface LogMessage {
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
  meta?: any;
}

// 在这里定义你需要暴露给渲染进程的API
const api = {
  versions: process.versions,
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  getArticles: () => ipcRenderer.invoke('get-articles'),
  getDocuments: () => ipcRenderer.invoke('get-documents'),
  onMaximize: (callback: () => void) => ipcRenderer.on('window-maximized', callback),
  onUnmaximize: (callback: () => void) => ipcRenderer.on('window-unmaximized', callback),
  removeMaximize: (callback: () => void) => ipcRenderer.removeListener('window-maximized', callback),
  removeUnmaximize: (callback: () => void) => ipcRenderer.removeListener('window-unmaximized', callback),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readDirectoryFiles: (dirPath: string) => ipcRenderer.invoke('read-directory-files', dirPath),
  saveFoldsJsonData: (folders: Folder[]) => ipcRenderer.invoke('save-folders', folders),
  buildContentLayer: () => ipcRenderer.invoke('build-content-layer'),
  deleteArticle: (folderId: string, articleId: string) => ipcRenderer.invoke('delete-article', folderId, articleId),
  deleteFolder: (folderId: string) => ipcRenderer.invoke('delete-folder', folderId),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: Settings) => ipcRenderer.invoke('save-settings', settings),
  initRepo: (repoUrl: string) => ipcRenderer.invoke('init-repo', repoUrl),
  pushRepo: () => ipcRenderer.invoke('push-repo'),
  // Add logging methods
  log: {
    info: (message: string, meta?: any) => 
      ipcRenderer.invoke('log', { level: 'info', message, meta }),
    error: (message: string, meta?: any) => 
      ipcRenderer.invoke('log', { level: 'error', message, meta }),
    warn: (message: string, meta?: any) => 
      ipcRenderer.invoke('log', { level: 'warn', message, meta }),
    debug: (message: string, meta?: any) => 
      ipcRenderer.invoke('log', { level: 'debug', message, meta }),
  }
}

// 使用contextBridge暴露API给渲染进程
contextBridge.exposeInMainWorld('electron', {
  ...api,
  ipcRenderer: {
    on: (channel: string, func: (...args: unknown[]) => void) => {
      ipcRenderer.on(channel, (_event, ...args: unknown[]) => func(...args))
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel)
    }
  }
})
