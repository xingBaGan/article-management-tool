import { Folder } from "../../packages/types"

const { contextBridge, ipcRenderer } = require('electron')
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
}

// 使用contextBridge暴露API给渲染进程
contextBridge.exposeInMainWorld('electron', {
  ...api,
  ipcRenderer: {
    on: (channel: string, func: (...args: any[]) => void) => {
      ipcRenderer.on(channel, (...args: any[]) => func(...args))
    },
    removeAllListeners: (channel: string) => {
      ipcRenderer.removeAllListeners(channel)
    }
  }
})
