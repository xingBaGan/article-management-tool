import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ArticleInfo, Folder } from '../../../packages/types';

interface ArticleContextType {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  selectedFolder: Folder | null;
  setSelectedFolder: (folder: Folder | null) => void;
  selectedArticle: ArticleInfo | null;
  setSelectedArticle: (article: ArticleInfo | null) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleInfo | null>(null);
  useEffect(() => {
    const fetchFolders = async () => {
      const folders = await window.electron?.getArticles();
      setFolders(folders || []);
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