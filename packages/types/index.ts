import { DocumentTypes, Article } from '../../.contentlayer/generated/types'

export interface FileInfo {
  id: string
  path: string
  title: string
  content: string
  newPath: string
} 

export interface ArticleInfo {
  id: string;
  title: string;
  content: string;
  newPath: string;
  builded: boolean;
  contentLayer?: Document;
}

export interface Folder {
  id: string;
  name: string;
  articles: ArticleInfo[];
}

export type Document = DocumentTypes
export type { Article }