import { Folder } from '../../packages/types'

interface ElectronAPI {
  getArticles: () => Promise<Folder[]>
  readDirectoryFiles: (path: string) => Promise<any>
  saveFoldsJsonData: (data: any) => Promise<void>
  getDocuments: () => Promise<any>
  minimize: () => void
  maximize: () => void
  close: () => void
  onMaximize: (callback: () => void) => void
  onUnmaximize: (callback: () => void) => void
  removeMaximize: (callback: () => void) => void
  removeUnmaximize: (callback: () => void) => void
  buildContentLayer: () => Promise<any>
  deleteArticle: (folderId: string, articleId: string) => Promise<void>
  deleteFolder: (folderId: string) => Promise<void>
  ipcRenderer: {
    on: (channel: string, callback: (...args: any[]) => void) => void
    removeAllListeners: (channel: string) => void
  }
}

declare global {
  interface Window {
    electron?: ElectronAPI
  }
}

export {} 