import React from 'react';
import { Article } from '../types';

interface ArticleViewerProps {
  article: Article | null;
}

export function ArticleViewer({ article }: ArticleViewerProps) {
  if (!article) {
    return (
      <div className="h-full flex-1 p-4 flex items-center justify-center text-gray-500 overflow-y-auto">
        Select an article to view its content
      </div>
    );
  }

  return (
    <div className="h-full flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <div className="prose max-w-none">
        {article.content}
      </div>
    </div>
  );
}