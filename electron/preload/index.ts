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
  removeUnmaximize: (callback: () => void) => ipcRenderer.removeListener('window-unmaximized', callback)
}

// 使用contextBridge暴露API给渲染进程
contextBridge.exposeInMainWorld('electron', api)

// 添加类型定义
declare global {
  interface Window {
    electron: typeof api
  }
}

// 不需要导出，因为这是preload脚本 