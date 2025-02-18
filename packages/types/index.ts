export interface FileInfo {
  id: string
  path: string
  title: string
  content: string
  newPath: string
} 

export interface Article {
  id: string;
  title: string;
  content: string;
  newPath: string;
}

export interface Folder {
  id: string;
  name: string;
  articles: Article[];
}