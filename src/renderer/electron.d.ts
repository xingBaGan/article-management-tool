interface ElectronAPI {
  versions: NodeJS.ProcessVersions
  minimize: () => void
  maximize: () => void
  close: () => void
  onMaximize: (callback: () => void) => void
  onUnmaximize: (callback: () => void) => void
  removeMaximize: (callback: () => void) => void
  removeUnmaximize: (callback: () => void) => void
}

declare interface Window {
  electron: ElectronAPI
} 