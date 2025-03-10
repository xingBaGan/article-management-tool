import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { ArticleInfo, Folder } from '../../../packages/types';

interface ArticleContextType {
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  selectedFolder: Folder | null;
  setSelectedFolder: (folder: Folder | null) => void;
  selectedArticle: ArticleInfo | null;
  setSelectedArticle: (article: ArticleInfo | null) => void;
  fetchFolders: () => Promise<void>;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

export function ArticleProvider({ children }: { children: ReactNode }) {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleInfo | null>(null);
  const fetchFolders = async () => {
    const folders = await window.electron?.getArticles();
    setFolders(folders || []);
  };
  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    window.electron?.ipcRenderer.on('reload-articles', async () => {
      const folders = await window.electron?.getArticles();
      setFolders([...(folders || [])])
      setSelectedFolder( fd =>{
        const folder = folders?.find(f=>f.id === fd?.id)
        return folder || null
      })
    })
    return () => {
      window.electron?.ipcRenderer.removeAllListeners('reload-articles')
    }
  }, [])
  
  return (
    <ArticleContext.Provider
      value={{
        folders,
        setFolders,
        selectedFolder,
        setSelectedFolder,
        selectedArticle,
        setSelectedArticle,
        fetchFolders,
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