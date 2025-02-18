import { readdir, readFile } from 'fs/promises'
import { join, extname } from 'path'
import { FileInfo } from '../../../packages/types'
import { generateFileId } from '../../../packages/utils'

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
            files.push({
              id,
              path: fullPath,
              title: entry.name,
              content
            })
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