# Blog Integration Setup Guide

## Overview
A complete blog module has been added to the tours website with automatic content loading at app startup, SEO optimization, and bilingual (English/Spanish) support. The blog content is fetched from Cloudflare via VITE environment variables and displayed only in the selected language.

## New Files Created

### 1. **Services**
- **`src/services/blogService.ts`**
  - Fetches blog articles from Cloudflare VITE_JSONBIN_BLOG_EN and VITE_JSONBIN_BLOG_ES bins
  - Normalizes articles with localized values (title, tour, post)
  - Exports: `getBlogArticles(locale)` - async function to fetch articles
  - Handles fallback to empty array if bin ID is missing or request fails

### 2. **Context Provider**
- **`src/contexts/BlogContext.tsx`**
  - Provides blog state and loading status across the app
  - Fetches all articles (EN + ES) **once on app load** at the I18nProvider level
  - Exports: `useBlog()` hook to access blog articles by locale
  - Stores articles in memory with key-value structure: `{ en: [...], es: [...] }`

### 3. **Pages**
- **`src/pages/Blog.tsx`**
  - Displays articles in the selected language
  - Renders article title, related tour, content, and date
  - Shows loading/error/empty states
  - **SEO-optimized** with meta tags and structured data

### 4. **Utilities**
- **`src/utils/seoHelpers.ts`**
  - `generateBlogPageMeta()` - Sets page title, meta description, Open Graph tags
  - `generateBlogArticleStructuredData()` - Generates JSON-LD for individual articles
  - `generateBlogListStructuredData()` - Generates JSON-LD for blog list (used on blog page)
  - Cleans up structured data on component unmount

## Integration Points

### App Bootstrap (main.tsx)
```tsx
<I18nProvider>
  <BrandProvider>
    <BlogProvider>  {/* NEW */}
      <App />
    </BlogProvider>
  </BrandProvider>
</I18nProvider>
```

### Routes (App.tsx)
```tsx
<Route path="/blog" element={<Blog />} />
```

### Navigation (Header.tsx)
- New "Blog" link with MdLibraryBooks icon
- Links to `/blog#top`

### Translations
- **en.json**: `nav.blog`, `blog.title`, `blog.description`, `blog.relatedTourLabel`, `blog.error`, `blog.noArticles`
- **es.json**: Spanish equivalents

## Environment Variables Required

Add to your `.env` file:
```env
VITE_JSONBIN_BLOG_EN=<your-english-blog-bin-id>
VITE_JSONBIN_BLOG_ES=<your-spanish-blog-bin-id>
VITE_JSONBIN_MASTER_KEY=<your-jsonbin-master-key>
```

## Expected JSON Structure

Cloudflare Bin format (array of articles):
```json
[
  {
    "id": "article-1",
    "title": {
      "en": "Best Beaches in Punta Cana",
      "es": "Las Mejores Playas de Punta Cana"
    },
    "tour": {
      "en": "Beach Paradise Tour",
      "es": "Tour Paraíso de Playas"
    },
    "post": {
      "en": "Paragraph 1\n\nParagraph 2...",
      "es": "Párrafo 1\n\nPárrafo 2..."
    },
    "date": "2025-05-14",
    "slug": "best-beaches-in-punta-cana"
  }
]
```

**Or simplified bilingual format:**
```json
[
  {
    "title": "Article Title",
    "tour": "Tour Name",
    "post": "Article content...",
    "date": "2025-05-14"
  }
]
```

## How Content Loading Works

### **At App Load (BlogContext)**
1. BlogProvider mounts and calls `getBlogArticles('en')` and `getBlogArticles('es')` in parallel
2. Both requests are cached in React state
3. Content is available immediately when navigating to `/blog`
4. No extra API calls when switching languages (content already loaded)

### **Language Switching**
- User switches language → I18nContext updates
- Blog page re-renders and filters articles by `locale`
- No network request needed

### **SEO Optimization**
- `generateBlogPageMeta()` updates page title, description, and Open Graph tags
- `generateBlogListStructuredData()` adds JSON-LD schema for search engines
- Articles are rendered with semantic HTML (title, date, content)
- Cleaned up on unmount to prevent duplicate tags

## Performance Notes

✅ **Optimized for SEO & Performance:**
- Articles load **once on app startup** (not on navigation)
- Both language versions fetched in parallel
- No redundant API calls
- Structured data (JSON-LD) helps search engines understand blog content
- Meta tags improve social sharing and search rankings

## Testing the Integration

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Set environment variables** in `.env` or CI/CD platform

3. **Navigate to `/blog`** to see articles

4. **Switch languages** — articles update without network request

5. **Inspect browser DevTools:**
   - Check `<title>` and `<meta name="description">`
   - View Network tab (articles only fetch once on page load)
   - Check Console for any fetch errors

## Files Modified

- `src/App.tsx` — Added Blog route import and route definition
- `src/main.tsx` — Wrapped BlogProvider around App
- `src/components/layout/Header.tsx` — Added blog navigation link
- `src/locales/en.json` — Added blog translations
- `src/locales/es.json` — Added blog translations (Spanish)

## Notes

- If a bin ID is missing or request fails, the blog page shows "No articles available"
- Articles require `title` and `post` fields; `tour`, `date`, and `slug` are optional
- Content is rendered as plain text with paragraph breaks (split on `\n\n`)
- Articles automatically slugified if no slug provided
