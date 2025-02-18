interface ElectronAPI {
  versions: NodeJS.ProcessVersions
  minimize: () => void
  maximize: () => void
  close: () => void
  onMaximize: (callback: () => void) => void
  onUnmaximize: (callback: () => void) => void
  removeMaximize: (callback: () => void) => void
  removeUnmaximize: (callback: () => void) => void
  readDirectoryFiles: (dirPath: string) => Promise<{ success: boolean, data: FileInfo[] }>
  saveFoldsJsonData: (folders: Folder[]) => Promise<void>
  getArticles: () => Promise<Folder[]>
}

declare interface Window {
  electron: ElectronAPI
} 