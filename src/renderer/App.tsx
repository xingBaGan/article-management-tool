import { useState, useEffect } from 'react';
import { FolderList } from './components/FolderList';
import { ArticleList } from './components/ArticleList';
import { ArticleViewer } from './components/ArticleViewer';
import { DropZone } from './components/DropZone';
import { SettingsModal } from './components/SettingsModal';
import { Settings, Minus, Square, X, CopyIcon } from 'lucide-react';
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

// 添加CSS属性类型
const dragStyle = {
  WebkitAppRegion: 'drag'
} as React.CSSProperties;

const noDragStyle = {
  WebkitAppRegion: 'no-drag'
} as React.CSSProperties;

export function App() {
  const [folders, setFolders] = useState<Folder[]>(initialFolders);
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  // 添加最大化状态监听
  useEffect(() => {
    const handleMaximize = () => setIsMaximized(true);
    const handleUnmaximize = () => setIsMaximized(false);

    window.electron?.onMaximize(handleMaximize);
    window.electron?.onUnmaximize(handleUnmaximize);

    return () => {
      window.electron?.removeMaximize(handleMaximize);
      window.electron?.removeUnmaximize(handleUnmaximize);
    };
  }, []);

  const handleFolderDrop = (folderEntries: any[]) => {
    // In a real implementation, we would process the folder contents here
    console.log('Processing dropped folder:', folderEntries);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 自定义标题栏 */}
      <div 
        className="h-8 flex items-center bg-gray-100 justify-between px-4 select-none" 
        style={dragStyle}
        onDoubleClick={() => window.electron?.maximize()}
      >
        <div className="text-gray-500 text">Article Publisher</div>
        <div className="flex items-center space-x-2" style={noDragStyle}>
          <button 
            onClick={() => window.electron?.minimize()} 
            className="p-1 hover:bg-gray-700 rounded"
          >
            <Minus className="w-4 h-4 text-gray-300" />
          </button>
          <button 
            onClick={() => window.electron?.maximize()} 
            className="p-1 hover:bg-gray-700 rounded"
          >
            {isMaximized ? (
              <CopyIcon className="w-4 h-4 text-gray-300" />
            ) : (
              <Square className="w-4 h-4 text-gray-300" />
            )}
          </button>
          <button 
            onClick={() => window.electron?.close()} 
            className="p-1 hover:bg-red-500 rounded"
          >
            <X className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex relative">
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
    </div>
  );
}

export default App;