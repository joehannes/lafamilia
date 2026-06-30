import { apiGet } from './apiClient';

type Locale = 'en' | 'es';

export interface RawBlogArticle {
  id?: string | number;
  title?: string | { en?: string; es?: string };
  tour?: string | { en?: string; es?: string };
  post?: string | { en?: string; es?: string };
  description?: string | { en?: string; es?: string };
  date?: string;
  language?: Locale;
  slug?: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  tour: string;
  post: string;
  date?: string;
  slug: string;
  locale: Locale;
}

const getLocalizedValue = (value: unknown, locale: Locale): string => {
  if (!value) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  if (typeof value === 'object' && value !== null) {
    const localeValue = (value as Record<string, unknown>)[locale];
    if (typeof localeValue === 'string' && localeValue.trim()) {
      return localeValue.trim();
    }

    const fallback = (value as Record<string, unknown>).en || (value as Record<string, unknown>).es;
    return typeof fallback === 'string' ? fallback.trim() : '';
  }

  return '';
};

const normalizeBlogArticle = (rawArticle: RawBlogArticle, locale: Locale): BlogArticle | null => {
  const title = getLocalizedValue(rawArticle.title, locale);
  const tour = getLocalizedValue(rawArticle.tour, locale);
  const post = getLocalizedValue(rawArticle.post || rawArticle.description, locale);
  const date = rawArticle.date?.trim();
  const id = String(rawArticle.id ?? `${title}-${tour}-${date || 'unknown'}`).trim();
  const slug = rawArticle.slug?.trim() || `${title.toLowerCase().replace(/[^a-z0-9]+/gi, '-')}`.replace(/(^-|-$)/g, '');

  if (!title || !post) {
    return null;
  }

  return {
    id,
    title,
    tour,
    post,
    date,
    slug: slug || id,
    locale,
  };
};

const findFirstArray = (data: unknown): unknown[] | undefined => {
  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data !== 'object' || data === null) {
    return undefined;
  }

  for (const value of Object.values(data as Record<string, unknown>)) {
    const found = findFirstArray(value);
    if (found) {
      return found;
    }
  }

  return undefined;
};

const extractRecord = (data: unknown): unknown[] => {
  if (Array.isArray(data)) {
    return data;
  }

  if (typeof data === 'object' && data !== null) {
    const recordData = (data as Record<string, unknown>).record ?? data;
    const arrayData = findFirstArray(recordData);
    return arrayData ?? [];
  }

  return [];
};

const fetchRawBlogArticles = async (locale: Locale): Promise<unknown[]> => {
  try {
    const data = await apiGet<unknown[]>('blog', { locale });
    return extractRecord(data);
  } catch (error) {
    console.warn('[Blog] API fetch failed:', error);
    return [];
  }
};

export const getBlogArticles = async (locale: Locale): Promise<BlogArticle[]> => {
  const rawArticles = await fetchRawBlogArticles(locale);

  return rawArticles
    .map((rawArticle) => normalizeBlogArticle(rawArticle as RawBlogArticle, locale))
    .filter((article): article is BlogArticle => article !== null);
};
