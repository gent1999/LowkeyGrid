/**
 * Set SEO meta tags for a page
 */
export const setSEO = ({ title, description, url, image, type = 'article', author, publishedTime, tags }) => {
  // Set page title
  document.title = `${title} | 2koveralls`;

  // Helper to set or create a meta tag
  const setMeta = (attr, key, content) => {
    if (!content) return;
    let el = document.querySelector(`meta[${attr}="${key}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Basic meta
  setMeta('name', 'description', description);

  // Open Graph
  setMeta('property', 'og:type', type);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:site_name', '2koveralls');
  if (publishedTime) setMeta('property', 'article:published_time', publishedTime);
  if (author) setMeta('property', 'article:author', author);

  // Twitter
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:url', url);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);

  // Tags
  if (tags && tags.length > 0) {
    // Remove old article:tag metas
    document.querySelectorAll('meta[property="article:tag"]').forEach(el => el.remove());
    tags.forEach(tag => {
      const el = document.createElement('meta');
      el.setAttribute('property', 'article:tag');
      el.setAttribute('content', tag);
      document.head.appendChild(el);
    });
  }
};

/**
 * Reset page title to default
 */
export const resetSEO = () => {
  document.title = '2koveralls - Underground Hip Hop News & 2K Rapper Ratings';
};
