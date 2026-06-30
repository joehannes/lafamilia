import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useI18n } from './I18nContext';
import { BlogArticle, getBlogArticles } from '../services/blogService';

type Locale = 'en' | 'es';

interface BlogContextType {
  blogArticles: Record<Locale, BlogArticle[]>;
  loading: boolean;
  error: boolean;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

export const useBlog = (): BlogContextType => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};

interface BlogProviderProps {
  children: ReactNode;
}

export const BlogProvider: React.FC<BlogProviderProps> = ({ children }) => {
  const { locale } = useI18n();
  const [blogArticles, setBlogArticles] = useState<Record<Locale, BlogArticle[]>>({ en: [], es: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadBlogContent = async () => {
      setLoading(true);
      setError(false);

      try {
        console.log('[BlogContext] Starting blog content load...');
        const [enArticles, esArticles] = await Promise.all([getBlogArticles('en'), getBlogArticles('es')]);
        console.log('[BlogContext] Blog content loaded. EN articles:', enArticles.length, 'ES articles:', esArticles.length);
        setBlogArticles({ en: enArticles, es: esArticles });
      } catch (err) {
        console.error('[BlogContext] Blog loading error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadBlogContent();
  }, [locale]);

  return (
    <BlogContext.Provider value={{ blogArticles, loading, error }}>
      {children}
    </BlogContext.Provider>
  );
};
