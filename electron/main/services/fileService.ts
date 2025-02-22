import fs, { copyFile, mkdir, readdir, readFile, writeFile } from 'fs/promises'
import { join, extname } from 'path'
import { ArticleInfo, FileInfo } from '../../../packages/types'
import { generateFileId } from '../../../packages/utils'
import { app } from 'electron'
import { Folder } from '../../../packages/types'
import { getDocuments } from './contentLayerService'
import { DocumentTypes as Document } from '../../../packages/types'
import { existsSync } from 'fs'
// 支持的文件类型
const SUPPORTED_EXTENSIONS = ['.md', '.mdx', '.txt']
const initialSettings = {
  repoUrl: ''
}

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
              const name = entry.name.split('.')[0]
              const newName = `${name}${Date.now()}${ext}`
              newPath = join(app.getPath('userData'), 'content', newName)
              await copyFile(fullPath, newPath)
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
  return contentLayer!
}

export async function readFoldsData(): Promise<Folder[]> {
  const filePath = join(app.getPath('userData'), 'files.json')
  try {
    if (!existsSync(filePath)) {
      await writeFile(filePath, JSON.stringify([]), 'utf-8')
    }
    // Read the JSON file
    const data = await readFile(filePath, 'utf-8')
    // Parse the JSON data
    const folds: Folder[] = JSON.parse(data)
    if (folds.length === 0) {
      return []
    }
    const folders = await Promise.all(folds?.map(async (fold) => ({
      ...fold,
      articles: await Promise.all(fold?.articles?.map(async (ArticleInfo) => ({
        ...ArticleInfo,
        content: await getArticleContent(ArticleInfo),
        contentLayer: await getContentLayer(ArticleInfo)
      })))
    })))
    // @ts-ignore
    return folders;
  } catch (error) {
    console.error(`Error reading folds data from ${filePath}:`, error)
    return []
  }
}

export async function deleteArticle(folderId: string, articleId: string): Promise<void> {
  try {
    const foldersData = await readFoldsData();
    const folder = foldersData.find((f: Folder) => f.id === folderId);

    if (folder) {
      // 找到要删除的文章
      const article = folder.articles.find((a: ArticleInfo) => a.id === articleId);
      if (article && article.newPath) {
        // 删除物理文件
        await fs.unlink(article.newPath);

        // 更新文件夹数据
        folder.articles = folder.articles.filter((a: ArticleInfo) => a.id !== articleId);
        await saveFoldsJsonData(foldersData, join(app.getPath('userData'), 'files.json'));
      }
    }
  } catch (error) {
    console.error(`Error deleting article ${articleId}:`, error)
  }
}

export async function getSettings(): Promise<Record<string, any>> {
  const settingsPath = join(app.getPath('userData'), 'settings.json');
  try {
    const data = await readFile(settingsPath, 'utf-8');
    const settings = JSON.parse(data);
    return settings;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      // File does not exist, create a new one with default settings
      const defaultSettings = {};
      await fs.writeFile(settingsPath, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    } else {
      console.error(`Error reading settings from ${settingsPath}:`, error);
      throw error;
    }
  }
}

export async function saveSettings(settings: any): Promise<void> {
  const settingsPath = join(app.getPath('userData'), 'settings.json');
  await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
}