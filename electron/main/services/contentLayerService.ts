import { allDocuments } from '../../../.contentlayer/generated/index'
import { Document } from '../../../packages/types'
import { exec } from 'child_process'
import util from 'node:util'
const execPromise = util.promisify(exec)


export async function getDocuments(): Promise<Document[]> {
  return allDocuments
}

// Function to run the build:contentlayer script
export async function buildContentLayer() {
  try {
    const result = await execPromise('npm run build:contentlayer')
  } catch (error) {
    console.error('buildContentLayer----', error)
  }
}