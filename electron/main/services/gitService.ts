import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs/promises';
import { logger } from './logService';
import { getRootPath } from '../utils';
const execAsync = promisify(exec);

export async function getIsInitialed() {
  const buildDir = path.join(getRootPath(), '.contentlayer/.git');
  return fs.access(buildDir).then(() => true).catch(() => false);
}

export async function initRepo(repoUrl: string) {
  try {
    const buildDir = path.join(getRootPath(), '.contentlayer');
    logger.info('buildDir', buildDir)
    // 检查目录是否存在，不存在则创建
    await fs.mkdir(buildDir, { recursive: true });
    
    // 初始化 Git 仓库
    await execAsync('git init', { cwd: buildDir });
    
    // 添加远程仓库
    await execAsync(`git remote add origin ${repoUrl}`, { cwd: buildDir });
    
    return { success: true };
  } catch (error) {
    logger.error('Git init error:', error);
    return { success: false, error };
  }
}

export async function pushRepo(force: boolean = false) {
  try {
    const buildDir = path.join(getRootPath(), '.contentlayer');
    logger.info('buildDir', buildDir)
    await execAsync('git branch -M main', { cwd: buildDir });
    // 添加所有更改
    await execAsync('git add .', { cwd: buildDir });
    
    try {
      // 提交更改
      await execAsync('git commit -m "Update content on ' + new Date().toISOString() + '"', { cwd: buildDir });
    } catch (error) {
      logger.error('Git commit error:', error);
    }
    
    // 根据 force 参数决定是否强制推送
    const pushCommand = force 
      ? 'git push -u origin main --force'
      : 'git push -u origin main';
    
    await execAsync(pushCommand, { cwd: buildDir });
    
    return { success: true };
  } catch (error) {
    logger.error('Git push error:', error);
    return { success: false, error };
  }
} 