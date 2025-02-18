import { contextBridge, ipcRenderer } from 'electron'

// 在这里定义你需要暴露给渲染进程的API
const api = {
  versions: process.versions,
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
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