import { useState, useEffect } from 'react';
import { FolderList } from './components/FolderList';
import { ArticleList } from './components/ArticleList';
import { ArticleViewer } from './components/ArticleViewer';
import { SettingsModal } from './components/SettingsModal';
import { Settings, Minus, Square, X, CopyIcon, Cog } from 'lucide-react';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { generateFileId } from '../../packages/utils';
import { ArticleProvider, useArticle } from './contexts/ArticleContext';

// 添加CSS属性类型
const dragStyle = {
  WebkitAppRegion: 'drag'
} as React.CSSProperties;

const noDragStyle = {
  WebkitAppRegion: 'no-drag'
} as React.CSSProperties;

function AppContent() {
  const {
    folders,
    setFolders,
    selectedFolder,
    setSelectedFolder,
    selectedArticle,
    setSelectedArticle,
  } = useArticle();
  const { isSettingsOpen, setIsSettingsOpen } = useSettings();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);

  // 处理文件拖放
  const { isDragging, dragHandlers } = useDragAndDrop({
    onDrop: async (files) => {
      const folder = files[0].path
      const folderName = files[0].name
      console.log('Dropped files:', files);
      const result = await window.electron?.readDirectoryFiles(folder)
      const id = await generateFileId(folder, folderName)
      const exists = folders.some(f => f.id === id)
      if (exists) {
        return
      }
      const newFolder = [...folders, {
        id: id,
        name: folderName,
        articles: result.data
      }]
      
      setFolders(newFolder)
      window.electron?.saveFoldsJsonData(newFolder)
    },
  });

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

  // 添加构建处理函数
  const handleBuild = async () => {
    setIsBuilding(true);
    try {
      await window.electron?.buildContentLayer();
    } finally {
      setIsBuilding(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col"
      {...dragHandlers}
    >
      {/* 自定义标题栏 */}
      <div
        className="h-8 flex items-center bg-gray-300 justify-between px-4 select-none"
        style={dragStyle}
        onDoubleClick={() => window.electron?.maximize()}
      >
        <div className="text-gray-700 text-bold">Article Publisher</div>
        <div className="flex items-center space-x-2" style={noDragStyle}>
          <button
            onClick={() => window.electron?.minimize()}
            className="p-1 hover:bg-gray-500 rounded"
          >
            <Minus className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => window.electron?.maximize()}
            className="p-1 hover:bg-gray-500 rounded"
          >
            {isMaximized ? (
              <CopyIcon className="w-4 h-4 text-gray-700" />
            ) : (
              <Square className="w-4 h-4 text-gray-700" />
            )}
          </button>
          <button
            onClick={() => window.electron?.close()}
            className="p-1 hover:bg-red-500 rounded"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex relative h-[calc(100vh-32px)]">
        <FolderList
          folders={folders}
          selectedFolder={selectedFolder}
          setSelectFolder={setSelectedFolder}
          setSelectedArticle={setSelectedArticle}
        />
        <ArticleList
          folder={selectedFolder}
          selectedArticle={selectedArticle}
          onSelectArticle={setSelectedArticle}
        />
        <ArticleViewer article={selectedArticle} />

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="absolute bottom-4 left-4 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <Settings className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleBuild}
          disabled={isBuilding}
          className="absolute bottom-4 left-14 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <Cog className={`w-5 h-5 text-gray-700 ${isBuilding ? 'animate-spin' : ''}`} />
        </button>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        {/* 拖拽遮罩层 */}
        {isDragging && (
          <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
              <div className="text-2xl font-bold text-gray-700 mb-2">
                松开以导入文件
              </div>
              <p className="text-gray-500">
                支持导入 Markdown 文件或文件夹
              </p>
            </div>
          </div>
        )}

        {/* 添加构建中的遮罩层 */}
        {isBuilding && (
          <div className="absolute inset-0 bg-gray-900/30 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-2">
              <Cog className="w-5 h-5 animate-spin" />
              <span>Building...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function App() {
  return (
    <ArticleProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </ArticleProvider>
  );
}

export default App;