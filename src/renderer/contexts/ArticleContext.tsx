import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
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

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await window.electron?.getArticles();
      setFolders(folders);
    };
    fetchFolders();
  }, []);
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