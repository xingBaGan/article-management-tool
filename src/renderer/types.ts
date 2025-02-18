export interface Article {
  id: string;
  title: string;
  content: string;
}

export interface Folder {
  id: string;
  name: string;
  articles: Article[];
}