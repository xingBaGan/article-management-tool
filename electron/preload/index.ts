const { contextBridge, ipcRenderer } = require('electron')
// 在这里定义你需要暴露给渲染进程的API
const api = {
  versions: process.versions,
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  onMaximize: (callback: () => void) => ipcRenderer.on('window-maximized', callback),
  onUnmaximize: (callback: () => void) => ipcRenderer.on('window-unmaximized', callback),
  removeMaximize: (callback: () => void) => ipcRenderer.removeListener('window-maximized', callback),
  removeUnmaximize: (callback: () => void) => ipcRenderer.removeListener('window-unmaximized', callback),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  readDirectoryFiles: (dirPath: string) => ipcRenderer.invoke('read-directory-files', dirPath),
}

// 使用contextBridge暴露API给渲染进程
contextBridge.exposeInMainWorld('electron', api)
