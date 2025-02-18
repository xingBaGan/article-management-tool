import { createContext, useContext, useState, ReactNode } from 'react';
import { Article, Folder } from '../types';

interface ArticleContextType {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  selectedFolder: Folder | null;
  setSelectedFolder: (folder: Folder | null) => void;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

// Mock data for demonstration
const initialFolders: Folder[] = [
  {
    id: '1',
    name: 'Technical Articles',
    articles: [
      {
        id: '1',
        title: 'Getting Started with React',
        content: 'React is a popular JavaScript library for building user interfaces...',
      },
      {
        id: '2',
        title: 'TypeScript Best Practices',
        content: 'TypeScript adds static typing to JavaScript, making it easier to write and maintain large applications...',
      },
    ],
  },
  {
    id: '2',
    name: 'Blog Posts',
    articles: [
      {
        id: '3',
        title: 'My First Blog Post',
        content: 'Welcome to my blog! In this post, we will explore...',
      },
    ],
  },
];

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <ArticleContext.Provider
      value={{
        folders,
        setFolders,
        selectedFolder,
        setSelectedFolder,
        selectedArticle,
        setSelectedArticle,
      }}
    >
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticle() {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error('useArticle must be used within an ArticleProvider');
  }
  return context;
} 