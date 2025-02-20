import { DocumentTypes as Document } from '../../../packages/types'
import { exec } from 'child_process'
import { join } from 'path'
import { app } from 'electron'
import { access } from 'fs/promises'

const isDev = !app.isPackaged
const relativePath = isDev
  ? '../../../../article-publisher/.contentlayer/generated'
  : '.contentlayer/generated'
const contentLayerPath = isDev
  ? join(__dirname, relativePath)
  : join(process.resourcesPath, relativePath)
console.log('contentLayerPath', contentLayerPath)

// 获取所有文档
function getAllDoucment() {
  const allPosts = require(`${contentLayerPath}/Post/_index.json`)
  const allArticles = require(`${contentLayerPath}/Article/_index.json`)
  const allAuthors = require(`${contentLayerPath}/Authors/_index.json`)
  return [...allPosts, ...allArticles, ...allAuthors]
}

export async function getDocuments(): Promise<Document[]> {
  try {

    // Check if the file exists
    try {
      await access(contentLayerPath)
    } catch (error) {
      console.log('Content layer not generated yet, building...')
      await buildContentLayer()
    }

    // Use dynamic import instead of require
    const allDocuments = getAllDoucment()
    return allDocuments
  } catch (error) {
    console.error('Error loading documents:', error)
    return []
  }
}

// Function to run the build:contentlayer script
export async function buildContentLayer() {
  try {
    const result = await new Promise((resolve, reject) => {
      const isWin = process.platform === 'win32'
      const command = isWin ? 'npm.cmd' : 'npm'
      
      exec(`${command} run build:contentlayer`, {
        cwd: app.isPackaged ? process.resourcesPath : process.cwd()
      }, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }
        resolve({ stdout, stderr })
      })
    })
    console.log('Content layer built successfully')
  } catch (error) {
    console.error('buildContentLayer error:', error)
    throw error
  }
}