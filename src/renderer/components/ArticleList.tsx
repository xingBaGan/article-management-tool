import React, { useState } from 'react';
import { FileText, Trash2 } from 'lucide-react';
import { ArticleInfo, Folder } from '../../../packages/types';
import clsx from 'clsx';
import { useLocale } from '../contexts/LanguageContext';

interface ArticleListProps {
  folder: Folder | null;
  selectedArticle: ArticleInfo | null;
  onSelectArticle: (article: ArticleInfo | null) => void;
}

export function ArticleList({ folder, selectedArticle, onSelectArticle }: ArticleListProps) {
  const { t } = useLocale();
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    articleId: string;
  }>({ show: false, x: 0, y: 0, articleId: '' });
  const articles = folder?.articles || []

  const handleClick = () => {
    onSelectArticle(null)
  }

  // 处理右键点击
  const handleContextMenu = (e: React.MouseEvent, article: ArticleInfo) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      articleId: article.id
    });
  };

  // 处理删除
  const handleDelete = async (articleId: string) => {
    if (folder) {
      // 调用electron删除文件
      await window.electron?.deleteArticle(folder.id, articleId);
      setContextMenu({ show: false, x: 0, y: 0, articleId: '' });
      
      // 如果删除的是当前选中的文章，清除选中状态
      if (selectedArticle?.id === articleId) {
        onSelectArticle(null);
      }
    }
  };

  // 点击其他地方关闭菜单
  React.useEffect(() => {
    const handleClick = () => setContextMenu({ show: false, x: 0, y: 0, articleId: '' });
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!folder) {
    return (
      <div className="h-full w-72 bg-white p-4 border-r border-gray-200 overflow-hidden" onClick={handleClick}>
        <h2 className="text-lg font-semibold mb-4">{t('articles.title')}</h2>
        <div className="h-full w-72 bg-white p-4 border-r border-gray-200 flex items-center justify-center text-gray-500 overflow-y-auto">
          {t('articles.select')}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-72 bg-white p-4 border-r border-gray-200 overflow-y-auto" onClick={handleClick}>
      <h2 className="text-lg font-semibold mb-4">{t('articles.title')}</h2>
      <div className="space-y-2">
        {articles.map((article) => (
          <button
            key={article.id}
            onClick={(e) => {
              onSelectArticle(article)
              e.stopPropagation()
            }}
            onContextMenu={(e) => handleContextMenu(e, article)}
            className={clsx(
              "w-full flex items-center space-x-2 p-2 rounded-lg transition-colors",
              selectedArticle?.id === article.id
                ? "bg-blue-100 text-blue-700"
                : "hover:bg-gray-200"
            )}
          >
            <FileText className="w-5 h-5" />
            <span className="truncate">{article.title}</span>
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
            onClick={() => handleDelete(contextMenu.articleId)}
          >
            <Trash2 className="w-4 h-4" />
            <span>{t('articles.delete')}</span>
          </button>
        </div>
      )}
    </div>
  );
}