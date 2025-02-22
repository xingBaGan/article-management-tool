import { Folder } from '../../packages/types'

interface IpcRenderer {
  on(channel: string, func: (...args: unknown[]) => void): void;
  removeAllListeners(channel: string): void;
}

interface FileData {
  path: string;
  content: string;
}

interface Settings {
  repoUrl?: string;
  theme?: string;
  // 其他设置属性
}

interface ElectronAPI {
  versions: NodeJS.ProcessVersions;
  ipcRenderer: IpcRenderer;
  getArticles: () => Promise<Folder[]>;
  readDirectoryFiles: (path: string) => Promise<FileData[]>;
  saveFoldsJsonData: (data: Folder[]) => Promise<void>;
  getDocuments: () => Promise<Document[]>;
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
  getSettings: () => Promise<Settings>
  saveSettings: (settings: Settings) => Promise<void>
  initContentLayer: () => Promise<any>
  initRepo: (repoUrl: string) => Promise<any>
  pushRepo: (force?: boolean) => Promise<{ success: boolean; error?: any }>
  getIsInitialed: () => Promise<any>
  log: {
    info: (message: string, meta?: any) => void;
    error: (message: string, meta?: any) => void;
    warn: (message: string, meta?: any) => void;
    debug: (message: string, meta?: any) => void;
  }
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {} 