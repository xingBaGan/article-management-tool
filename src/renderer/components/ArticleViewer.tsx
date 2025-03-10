import React from 'react';
import { MDXLayoutRenderer } from 'pliny/src/mdx-components';
import { ArticleInfo } from '../../../packages/types';
import { useLocale } from '../contexts/LanguageContext';

interface ArticleViewerProps {
  article: ArticleInfo | null;
}

export function ArticleViewer({ article }: ArticleViewerProps) {
  const { t } = useLocale();

  if (!article) {
    return (
      <div className="h-full flex-1 p-4 flex items-center justify-center text-gray-500 overflow-y-auto">
        {t('viewer.select')}
      </div>
    );
  }
  const post = article.contentLayer;

  const content = post?.body?.html || article.content;
  
  return (
    <div className="h-full flex-1 p-6 overflow-auto">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <div className="prose max-w-none">
        {post?.body?.code ? (
          <MDXLayoutRenderer code={post?.body?.code} toc={post?.toc} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        )}
      </div>
    </div>
  );
}