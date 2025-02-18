import React from 'react';
import { FileText } from 'lucide-react';
import { Article, Folder } from '../types';
import clsx from 'clsx';

interface ArticleListProps {
  folder: Folder | null;
  selectedArticle: Article | null;
  onSelectArticle: (article: Article) => void;
}

export function ArticleList({ folder, selectedArticle, onSelectArticle }: ArticleListProps) {
  if (!folder) {
    return (
      <div className="h-full w-72 bg-white p-4 border-r border-gray-200 flex items-center justify-center text-gray-500 overflow-y-auto">
        Select a folder to view articles
      </div>
    );
  }

  return (
    <div className="h-full w-72 bg-white p-4 border-r border-gray-200 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Articles</h2>
      <div className="space-y-2">
        {folder.articles.map((article) => (
          <button
            key={article.id}
            onClick={() => onSelectArticle(article)}
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
    </div>
  );
}