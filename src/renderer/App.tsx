import { useState } from 'react';
import { FolderList } from './components/FolderList';
import { ArticleList } from './components/ArticleList';
import { ArticleViewer } from './components/ArticleViewer';
import { DropZone } from './components/DropZone';
import { SettingsModal } from './components/SettingsModal';
import { Settings } from 'lucide-react';
import { Article, Folder } from './types';

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

export function App() {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleFolderDrop = (folderEntries: any[]) => {
    // In a real implementation, we would process the folder contents here
    console.log('Processing dropped folder:', folderEntries);
  };

  return (
    <div className="h-screen flex relative">
      <FolderList
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
      />
      <ArticleList
        folder={selectedFolder}
        selectedArticle={selectedArticle}
        onSelectArticle={setSelectedArticle}
      />
      <ArticleViewer article={selectedArticle} />
      <DropZone onFolderDrop={handleFolderDrop} />

      {/* Settings Button */}
      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute bottom-4 left-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
      >
        <Settings className="w-5 h-5 text-gray-700" />
      </button>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;