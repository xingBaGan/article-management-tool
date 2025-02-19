import { allDocuments } from '../../../.contentlayer/generated/index'
import { Document } from '../../../packages/types'

export async function getDocuments(): Promise<Document[]> {
  return allDocuments
}


