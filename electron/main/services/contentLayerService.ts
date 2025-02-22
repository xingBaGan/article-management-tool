import { DocumentTypes as Document } from '../../../packages/types'
import { exec } from 'child_process'
import path, { join } from 'path'
import { app } from 'electron'
import { access } from 'fs/promises'
import { logger } from './logService'
import { getRootPath } from '../utils'

const isDev = !app.isPackaged
const relativePath = '.contentlayer/generated';

logger.info('isDev', isDev)
logger.info('process.resourcesPath', process.resourcesPath)
logger.info('getRootPath', getRootPath())
const contentLayerPath = isDev
  ? join(getRootPath(), relativePath)
  : join(process.resourcesPath, relativePath)


// 获取所有文档
function getAllDoucment() {
  logger.info('contentLayerPath', contentLayerPath)
  const allPosts = require(path.join(contentLayerPath, 'Post/_index.json'))
  const allArticles = require(path.join(contentLayerPath, 'Article/_index.json'))
  const allAuthors = require(path.join(contentLayerPath, 'Authors/_index.json'))
  return [...allPosts, ...allArticles, ...allAuthors]
}

export async function getDocuments(): Promise<Document[]> {
  try {

    // Check if the file exists
    try {
      await access(contentLayerPath)
    } catch (error) {
      logger.info('Content layer not generated yet')
    }


    // Use dynamic import instead of require
    const allDocuments = getAllDoucment()
    return allDocuments
  } catch (error) {
    logger.error('Error loading documents:', error)
    return []
  }
}

// Function to run the build:contentlayer script
export async function buildContentLayer() {
  try {
    const result = await new Promise((resolve, reject) => {
      const isWin = process.platform === 'win32'
      const command = isWin ? 'npm.cmd' : 'npm'
      const configPath = path.join(getRootPath(), 'contentlayer.config.js')
      exec(`npx contentlayer2 build --config ${configPath}`, {
        cwd: app.isPackaged ? process.resourcesPath : process.cwd()
      }, (error, stdout, stderr) => {
        if (error) {
          reject(error)
          return
        }
        resolve({ stdout, stderr })
      })
    })
    logger.info('result', result)
    logger.info('Content layer built successfully')
  } catch (error) {
    logger.error('buildContentLayer error:', error)
    throw error
  }
}
