/**
 * @type {import('electron-builder').Configuration}
 */
const config = {
  appId: "com.article.publisher",
  productName: "Article Publisher",
  files: [
    "out/**/*",
    "package.json"
  ],
  directories: {
    output: "out",
    buildResources: "public"
  },
  extraResources: [
    {
      from: "public",
      to: "public",
      filter: [
        "**/*"
      ]
    },
    {
      from: "contentlayer.config.js",
      to: "contentlayer.config.js",
      filter: [
        "**/*"
      ]
    },
    {
      from: "package.json",
      to: "package.json",
      filter: [
        "**/*"
      ]
    },
    {
      from: "scripts",
      to: "scripts",
      filter: [
        "**/*"
      ]
    }
  ],
  asar: true,
  asarUnpack: [
    ".contentlayer"
  ],
  win: {
    target: [
      "nsis"
    ],
    icon: "public/icon.png"
  },
  mac: {
    target: [
      "dmg"
    ],
    icon: "public/icon.png"
  },
  linux: {
    target: [
      "AppImage",
      "deb"
    ],
    icon: "public/icon.png"
  }
}

module.exports = config 