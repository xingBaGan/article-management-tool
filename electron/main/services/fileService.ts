import { copyFile, mkdir, readdir, readFile } from 'fs/promises'
import { join, extname } from 'path'
import { ArticleInfo, FileInfo } from '../../../packages/types'
import { generateFileId } from '../../../packages/utils'
import { existsSync } from 'fs'
import { writeFile } from 'fs/promises'
import { app } from 'electron'
import { Folder } from '../../../packages/types'
import { getDocuments } from './contentLayerService'
import { Document } from '../../../packages/types'
// 支持的文件类型
const SUPPORTED_EXTENSIONS = ['.md', '.mdx', '.txt']

export async function readTextFiles(dirPath: string): Promise<FileInfo[]> {
  const files: FileInfo[] = []

  try {
    // 读取目录下的所有文件
    const entries = await readdir(dirPath, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = join(dirPath, entry.name)

      if (entry.isDirectory()) {
        // 递归读取子目录
        const subFiles = await readTextFiles(fullPath)
        files.push(...subFiles)
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase()
        
        // 检查文件扩展名是否支持
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          try {
            const content = await readFile(fullPath, 'utf-8')
            const id = await generateFileId(fullPath, entry.name)
            let newPath = join(app.getPath('userData'), 'content', entry.name)
            if (existsSync(newPath)) {
              const newName = `${entry.name}${Date.now()}${ext}`
              newPath = join(app.getPath('userData'), 'content', newName)
            }
            files.push({
              id,
              path: fullPath,
              title: entry.name,
              content,
              newPath
            })
            // copy file to content folder
            const contentDirPath = join(app.getPath('userData'), 'content')
            console.log('contentDirPath', contentDirPath)
            if (!existsSync(contentDirPath)) {
              await mkdir(contentDirPath, { recursive: true })
            }
            const contentFilePath = join(contentDirPath, entry.name)
            await copyFile(fullPath, contentFilePath)
          } catch (error) {
            console.error(`Error reading file ${fullPath}:`, error)
          }
        }
      }
    }
    return files
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error)
  }

  return files
} 


export async function saveFoldsJsonData(folders: Folder[], outputPath: string): Promise<void> {
  try {
    // Remove the 'content' field from each file object
    const filesWithoutContent = folders.map(folder => ({
      ...folder,
      articles: folder?.articles?.map(ArticleInfo => ({
        ...ArticleInfo,
        content: ''
      }))
    }))
    // Convert the array to JSON
    const jsonData = JSON.stringify(filesWithoutContent, null, 2)
    // Write the JSON data to the specified output path
    await writeFile(outputPath, jsonData, 'utf-8')
  } catch (error) {
    console.error(`Error saving files to JSON:`, error)
  }
}

export async function getArticleContent(ArticleInfo: ArticleInfo): Promise<string> {
  const filePath = ArticleInfo.newPath
  const content = await readFile(filePath, 'utf-8')
  return content
}

export async function getContentLayer(ArticleInfo: ArticleInfo): Promise<Document> {
  const documents = await getDocuments()
  const contentLayer = documents.find((document: Document) => document._id === ArticleInfo.title)
  return contentLayer || {} as Document
}

export async function readFoldsData(): Promise<Folder[]> {
  const filePath = join(app.getPath('userData'), 'files.json')
  try {
    // Read the JSON file
    const data = await readFile(filePath, 'utf-8')
    // Parse the JSON data
    const folds: Folder[] = JSON.parse(data)
    const folders = await Promise.all(folds.map(async (fold) => ({
      ...fold,
      articles: await Promise.all(fold.articles.map(async (ArticleInfo) => ({
        ...ArticleInfo,
        content: await getArticleContent(ArticleInfo),
        contentLayer: await getContentLayer(ArticleInfo)
      })))
    })))
    return folders
  } catch (error) {
    console.error(`Error reading folds data from ${filePath}:`, error)
    return []
  }
}