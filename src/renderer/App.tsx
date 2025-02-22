import { useState, useEffect } from 'react';
import { FolderList } from './components/FolderList';
import { ArticleList } from './components/ArticleList';
import { ArticleViewer } from './components/ArticleViewer';
import { SettingsModal } from './components/SettingsModal';
import { Settings, Minus, Square, X, CopyIcon, Cog, CheckCircle } from 'lucide-react';
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
    fetchFolders
  } = useArticle();
  const { isSettingsOpen, setIsSettingsOpen } = useSettings();
  const [isMaximized, setIsMaximized] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [message, setMessage] = useState<{show: boolean; text: string}>({ show: false, text: '' });

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
      await fetchFolders();
      setSelectedFolder(null)
      setSelectedArticle(null)
    } finally {
      setIsBuilding(false);
    }
  };

  const showMessage = (text: string) => {
    setMessage({ show: true, text });
    setTimeout(() => {
      setMessage({ show: false, text: '' });
    }, 1500);
  };

  return (
    <div
      className="flex flex-col h-screen"
      {...dragHandlers}
    >
      {/* 自定义标题栏 */}
      <div
        className="flex justify-between items-center px-4 h-8 bg-gray-300 select-none"
        style={dragStyle}
        onDoubleClick={() => window.electron?.maximize()}
      >
        <div className="text-gray-700 text-bold">Article Publisher</div>
        <div className="flex items-center space-x-2" style={noDragStyle}>
          <button
            onClick={() => window.electron?.minimize()}
            className="p-1 rounded hover:bg-gray-500"
          >
            <Minus className="w-4 h-4 text-gray-700" />
          </button>
          <button
            onClick={() => window.electron?.maximize()}
            className="p-1 rounded hover:bg-gray-500"
          >
            {isMaximized ? (
              <CopyIcon className="w-4 h-4 text-gray-700" />
            ) : (
              <Square className="w-4 h-4 text-gray-700" />
            )}
          </button>
          <button
            onClick={() => window.electron?.close()}
            className="p-1 rounded hover:bg-red-500"
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
          className="absolute bottom-4 left-4 p-2 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200"
        >
          <Settings className="w-5 h-5 text-gray-700" />
        </button>
        <button
          onClick={handleBuild}
          disabled={isBuilding}
          className="absolute bottom-4 left-14 p-2 bg-gray-100 rounded-lg transition-colors hover:bg-gray-200 disabled:opacity-50"
        >
          <Cog className={`w-5 h-5 text-gray-700 ${isBuilding ? 'animate-spin' : ''}`} />
        </button>

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSuccess={() => {
            setIsSettingsOpen(false)
            showMessage('设置保存成功')
          }}
        />

        {/* 消息提示 */}
        {message.show && (
          <div className="fixed top-20 left-1/2 z-50 transform -translate-x-1/2">
            <div className="flex gap-2 items-center p-4 rounded-lg shadow-lg backdrop-blur-sm bg-white/90">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-gray-800">{message.text}</span>
            </div>
          </div>
        )}

        {/* 拖拽遮罩层 */}
        {isDragging && (
          <div className="flex absolute inset-0 z-50 justify-center items-center bg-gray-900/50">
            <div className="p-8 text-center bg-white rounded-lg shadow-lg">
              <div className="mb-2 text-2xl font-bold text-gray-700">
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
          <div className="flex absolute inset-0 z-50 justify-center items-center bg-gray-900/30">
            <div className="flex items-center p-4 space-x-2 bg-white rounded-lg shadow-lg">
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