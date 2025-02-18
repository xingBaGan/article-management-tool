import { mkdirSync } from 'fs'
import { paths } from '../../scripts/paths'

// 确保必要的目录存在
try {
  mkdirSync(paths.userData, { recursive: true })
  mkdirSync(paths.content, { recursive: true })
} catch (err) {
  console.error('Failed to create directories:', err)
} 