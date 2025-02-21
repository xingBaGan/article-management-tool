import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { logger } from './logService';
const execAsync = promisify(exec);

export async function initRepo(repoUrl: string) {
  try {
    const buildDir = path.join(process.cwd(), '.contentlayer');
    logger.info('buildDir', buildDir)
    // 检查目录是否存在，不存在则创建
    await fs.mkdir(buildDir, { recursive: true });
    
    // 初始化 Git 仓库
    await execAsync('git init', { cwd: buildDir });
    
    // 添加远程仓库
    await execAsync(`git remote add origin ${repoUrl}`, { cwd: buildDir });
    
    return { success: true };
  } catch (error) {
    console.error('Git init error:', error);
    return { success: false, error };
  }
}

export async function pushRepo() {
  try {
    const buildDir = path.join(process.cwd(), '.contentlayer');
    
    await execAsync('git branch -M main', { cwd: buildDir });
    // 添加所有更改
    await execAsync('git add .', { cwd: buildDir });
    
    try {
      // 提交更改
      await execAsync('git commit -m "Update content"', { cwd: buildDir });
    } catch (error) {
      console.error('Git commit error:', error);
    }
    
    // 推送到远程
    await execAsync('git push -u origin main', { cwd: buildDir });
    
    return { success: true };
  } catch (error) {
    console.error('Git push error:', error);
    return { success: false, error };
  }
} 