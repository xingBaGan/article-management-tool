import type { Markdown, MDX, IsoDateTimeString } from 'contentlayer2/core'
import * as Local from 'contentlayer2/source-files'

export { isType } from 'contentlayer2/client'
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
/** Document types */
export type Article = {
  /** File path relative to `contentDirPath` */
  _id: string
  _raw: Local.RawDocumentData
  type: 'Article'
  title?: string | undefined
  date?: IsoDateTimeString | undefined
  tags: string[]
  lastmod?: IsoDateTimeString | undefined
  draft?: boolean | undefined
  summary?: string | undefined
  images?: any | undefined
  authors?: string[] | undefined
  layout?: string | undefined
  bibliography?: string | undefined
  canonicalUrl?: string | undefined
  /** MDX file body */
  body: MDX
  slug: string
  path: string
  filePath: string
  toc: string
  structuredData: JSON
}

export type Authors = {
  /** File path relative to `contentDirPath` */
  _id: string
  _raw: Local.RawDocumentData
  type: 'Authors'
  name: string
  avatar?: string | undefined
  occupation?: string | undefined
  company?: string | undefined
  email?: string | undefined
  twitter?: string | undefined
  linkedin?: string | undefined
  github?: string | undefined
  layout?: string | undefined
  /** MDX file body */
  body: MDX
  slug: string
  path: string
  filePath: string
  toc: string
}

export type Post = {
  /** File path relative to `contentDirPath` */
  _id: string
  _raw: Local.RawDocumentData
  type: 'Post'
  title?: string | undefined
  date?: IsoDateTimeString | undefined
  tags: string[]
  lastmod?: IsoDateTimeString | undefined
  draft?: boolean | undefined
  summary?: string | undefined
  images?: any | undefined
  authors?: string[] | undefined
  layout?: string | undefined
  bibliography?: string | undefined
  canonicalUrl?: string | undefined
  /** Markdown file body */
  body: Markdown
  slug: string
  path: string
  filePath: string
  toc: string
  structuredData: JSON
}

/** Nested types */


/** Helper types */
export type DocumentTypes = Article | Authors | Post
