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
}

declare interface Window {
  electron: ElectronAPI
} 