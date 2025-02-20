import { allDocuments } from '../../../.contentlayer/generated/index'
import { Document } from '../../../packages/types'
import { exec } from 'child_process'

export async function getDocuments(): Promise<Document[]> {
  return allDocuments
}

// Function to run the build:contentlayer script
export async function buildContentLayer() {
  try {
    const result = await new Promise((resolve, reject) => {
      exec('npm run build:contentlayer', (error, stdout, stderr) => {
        if (error) {
          reject(error);
          return;
        }
        resolve({ stdout, stderr });
      });
    });
  } catch (error) {
    console.error('buildContentLayer----', error)
  }
}