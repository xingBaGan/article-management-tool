import React, { useState } from 'react';
import { FolderIcon, Trash2 } from 'lucide-react';
import { Folder, ArticleInfo } from '../../../packages/types';
import clsx from 'clsx';
import { useLocale } from '../contexts/LanguageContext';

interface FolderListProps {
  folders: Folder[];
  selectedFolder: Folder | null;
  setSelectFolder: (folder: Folder | null) => void;
  setSelectedArticle: (article: ArticleInfo | null) => void;
}

export function FolderList({ folders, selectedFolder, setSelectFolder, setSelectedArticle }: FolderListProps) {
  const { t } = useLocale();
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    folderId: string;
  }>({ show: false, x: 0, y: 0, folderId: '' });

  const handleClick = () => {
    setSelectFolder(null)
    setSelectedArticle(null)
  }

  // 处理右键点击
  const handleContextMenu = (e: React.MouseEvent, folder: Folder) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      folderId: folder.id
    });
  };

  // 处理删除
  const handleDelete = async (folderId: string) => {
    await window.electron?.deleteFolder(folderId);
    setContextMenu({ show: false, x: 0, y: 0, folderId: '' });
    if (selectedFolder?.id === folderId) {
      setSelectFolder(null);
      setSelectedArticle(null);
    }
  };

  // 点击其他地方关闭菜单
  React.useEffect(() => {
    const handleClick = () => setContextMenu({ show: false, x: 0, y: 0, folderId: '' });
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  return (
    <div className="h-full w-64 bg-gray-100 p-4 border-r border-gray-200 overflow-y-auto" onClick={handleClick}>
      <h2 className="text-lg font-semibold mb-4">{t('folders.title')}</h2>
      <div className="space-y-2">
        {folders.map((folder) => (
          <button
            key={folder.id}
            onClick={(e) => {
              setSelectFolder(folder)
              e.stopPropagation()
            }}
            onContextMenu={(e) => handleContextMenu(e, folder)}
            className={clsx(
              "w-full flex items-center space-x-2 p-2 rounded-lg transition-colors",
              selectedFolder?.id === folder.id
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200"
            )}
          >
            <FolderIcon className="w-5 h-5" />
            <span className="truncate">{folder.name}</span>
          </button>
        ))}
      </div>

      {/* 右键菜单 */}
      {contextMenu.show && (
        <div
          className="fixed bg-white rounded-lg shadow-lg py-1 z-50"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`
          }}
        >
          <button
            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
            onClick={() => handleDelete(contextMenu.folderId)}
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('folders.delete')}</span>
          </button>
        </div>
      )}
    </div>
  );
}