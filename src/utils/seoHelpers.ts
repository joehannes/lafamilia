export const generateBlogPageMeta = (title: string, description: string, url: string): void => {
  const head = document.head;

  // Update title
  const titleElement = head.querySelector('title');
  if (titleElement) {
    titleElement.textContent = title;
  } else {
    const newTitle = document.createElement('title');
    newTitle.textContent = title;
    head.appendChild(newTitle);
  }

  // Update/create meta description
  let metaDescription = head.querySelector('meta[name="description"]') as HTMLMetaElement;
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.name = 'description';
    head.appendChild(metaDescription);
  }
  metaDescription.content = description;

  // Open Graph
  const setOrCreateMeta = (property: string, content: string, isProperty = false) => {
    let element = head.querySelector(`meta[${isProperty ? 'property' : 'name'}="${property}"]`) as HTMLMetaElement;
    if (!element) {
      element = document.createElement('meta');
      if (isProperty) {
        element.setAttribute('property', property);
      } else {
        element.setAttribute('name', property);
      }
      head.appendChild(element);
    }
    element.content = content;
  };

  setOrCreateMeta('og:title', title, true);
  setOrCreateMeta('og:description', description, true);
  setOrCreateMeta('og:url', url, true);
  setOrCreateMeta('og:type', 'website', true);
  setOrCreateMeta('twitter:title', title);
  setOrCreateMeta('twitter:description', description);
  setOrCreateMeta('twitter:card', 'summary_large_image');
};

export const generateBlogArticleStructuredData = (
  title: string,
  post: string,
  date?: string,
  author = 'Tours',
  image?: string
): void => {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'application/ld+json';
  scriptElement.textContent = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: title,
      articleBody: post.substring(0, 500),
      author: {
        '@type': 'Organization',
        name: author,
      },
      datePublished: date || new Date().toISOString(),
      ...(image && { image }),
    },
    null,
    2
  );
  document.head.appendChild(scriptElement);
};

export const generateBlogListStructuredData = (
  title: string,
  description: string,
  articles: Array<{ title: string; date?: string; post: string }>
): void => {
  const scriptElement = document.createElement('script');
  scriptElement.type = 'application/ld+json';
  scriptElement.textContent = JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'Blog',
      headline: title,
      description,
      blogPost: articles.map((article) => ({
        '@type': 'BlogPosting',
        headline: article.title,
        articleBody: article.post.substring(0, 300),
        datePublished: article.date || new Date().toISOString(),
      })),
    },
    null,
    2
  );
  document.head.appendChild(scriptElement);
};
