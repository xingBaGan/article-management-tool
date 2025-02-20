// const { resolve } = require('path');
const path = require('path');
const rootDir = path.resolve(__dirname);

module.exports = {
  packagerConfig: {
    asar: true,
    dir: path.join(rootDir, 'out'),
    executableName: 'articlePublisher',
  },
  rebuildConfig: {},
  makers: [
    process.platform === 'win32' && {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: 'jacob jiang',
        description: '一个将本地markdown文件发布到各个平台的工具',
        name: 'articlePublisher',
        exe: 'articlePublisher.exe',
        setupExe: 'articlePublisherSetup.exe',
        noMsi: true
      },
    },
    process.platform === 'darwin' && {
      name: '@electron-forge/maker-dmg',
      config: {
        format: 'ULFO'
      },
    },
    process.platform === 'darwin' && {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    process.platform === 'linux' && {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'jacob jiang',
          homepage: 'https://github.com/xingBaGan'
        }
      }
    },
    process.platform === 'linux' && {
      name: '@electron-forge/maker-rpm',
      config: {
        options: {
          maintainer: 'jacob jiang',
          homepage: 'https://github.com/xingBaGan'
        }
      }
    }
  ].filter(Boolean),
}; 