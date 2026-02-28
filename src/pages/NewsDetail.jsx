import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import SpotifyEmbed from '../components/SpotifyEmbed';
import HilltopMultiBanner from '../components/HilltopMultiBanner';
import HilltopMobileBanner from '../components/HilltopMobileBanner';
import Footer from '../components/Footer';
import { generateNewsUrl } from '../utils/slugify';
import { stripMarkdown } from '../utils/markdownUtils';

function NewsDetail() {
  const { id: urlId } = useParams();
  const [article, setArticle] = useState(null);
  const [moreArticles, setMoreArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  // Extract numeric ID from URL (e.g., "170-drake-new-album" -> "170")
  const id = urlId.split('-')[0];

  useEffect(() => {
    fetchArticle();
    fetchMoreArticles();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lowkeygrid/articles/${id}`);
      if (!response.ok) throw new Error('Article not found');
      const data = await response.json();
      setArticle(data);
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lowkeygrid/articles/writeups`);
      if (response.ok) {
        const data = await response.json();
        const others = data.filter(a => a.id !== parseInt(id));
        const shuffled = others.sort(() => 0.5 - Math.random());
        setMoreArticles(shuffled.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to fetch more articles:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Article not found'}
        </div>
        <Link
          to="/"
          className="mt-4 inline-block text-orange-600 hover:text-orange-800"
        >
          ← Back to Home
        </Link>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const articleDescription = article ? stripMarkdown(article.content).substring(0, 160) + '...' : '';
  const articleUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{article.title} | 2koveralls</title>
        <meta name="description" content={articleDescription} />
        <link rel="canonical" href={articleUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="article" />
        <meta property="og:url" content={articleUrl} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={articleDescription} />
        {article.image_url && <meta property="og:image" content={article.image_url} />}
        <meta property="og:site_name" content="2koveralls" />
        <meta property="article:published_time" content={article.created_at} />
        <meta property="article:author" content={article.author} />
        {article.tags && article.tags.map((tag, index) => (
          <meta key={index} property="article:tag" content={tag} />
        ))}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={articleUrl} />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={articleDescription} />
        {article.image_url && <meta name="twitter:image" content={article.image_url} />}
      </Helmet>

      {/* Article Header - full width above the content+sidebar flex */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Link
          to="/"
          className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </Link>

        <HilltopMobileBanner />

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">{article.title}</h1>

        <div className="flex items-center gap-4 mb-8">
          <p className="text-gray-600">By <span className="font-medium text-gray-900">{article.author}</span></p>
          <span className="text-gray-400">•</span>
          <p className="text-gray-600">{formatDate(article.created_at)}</p>
        </div>

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag, index) => (
              <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {article.instagram_link && (
          <div className="mb-8">
            <a
              href={article.instagram_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              View on Instagram
            </a>
          </div>
        )}
      </div>

      {/* Content + Sidebar - flex row starts here, level with image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 flex gap-8 justify-center">
      <article className="flex-1 min-w-0">
        {/* Article body — image floats left, text wraps around it */}
        <div className="mb-8">
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full sm:w-2/5 sm:float-left sm:mr-8 mb-4 rounded-lg shadow-xl"
            />
          )}

          <div className="prose prose-lg max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({node, ...props}) => <h1 {...props} className="text-3xl font-bold text-gray-900 mt-8 mb-4 border-b-2 border-orange-500 pb-2" />,
                h2: ({node, ...props}) => <h2 {...props} className="text-2xl font-bold text-gray-900 mt-6 mb-3" />,
                h3: ({node, ...props}) => <h3 {...props} className="text-xl font-bold text-gray-800 mt-5 mb-2" />,
                h4: ({node, ...props}) => <h4 {...props} className="text-lg font-semibold text-gray-800 mt-4 mb-2" />,
                p: ({node, ...props}) => <p {...props} className="text-gray-700 leading-relaxed mb-4" />,
                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:text-orange-600 font-medium underline underline-offset-2" />,
                ul: ({node, ...props}) => <ul {...props} className="list-disc pl-6 mb-4 space-y-1 text-gray-700" />,
                ol: ({node, ...props}) => <ol {...props} className="list-decimal pl-6 mb-4 space-y-1 text-gray-700" />,
                li: ({node, ...props}) => <li {...props} className="leading-relaxed" />,
                blockquote: ({node, ...props}) => <blockquote {...props} className="border-l-4 border-orange-500 pl-4 py-1 my-4 italic text-gray-600 bg-orange-50" />,
                strong: ({node, ...props}) => <strong {...props} className="font-bold text-gray-900" />,
                em: ({node, ...props}) => <em {...props} className="italic text-gray-700" />,
                hr: ({node, ...props}) => <hr {...props} className="my-6 border-gray-200" />,
                img: ({node, ...props}) => <img {...props} className="w-full rounded-lg my-4 shadow-md" />,
                code: ({node, inline, ...props}) => inline
                  ? <code {...props} className="bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded text-orange-600 text-sm font-mono" />
                  : <code {...props} className="block bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono my-4" />,
                pre: ({node, ...props}) => <pre {...props} className="bg-gray-900 rounded-lg overflow-x-auto my-4" />,
              }}
            >
              {article.content}
            </ReactMarkdown>
          </div>
          <div className="clear-both" />
        </div>

        {/* Spotify Embed */}
        {article.spotify_url && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Listen on Spotify</h2>
            <div className="overflow-hidden">
              <iframe
                src={article.spotify_url.replace('open.spotify.com', 'open.spotify.com/embed')}
                width="100%"
                height="352"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        )}

        {/* YouTube Embed */}
        {article.youtube_url && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Watch on YouTube</h2>
            <div className="overflow-hidden aspect-video">
              <iframe
                src={article.youtube_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                width="100%"
                height="100%"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>
        )}

        {/* SoundCloud Embed */}
        {article.soundcloud_url && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Listen on SoundCloud</h2>
            <div className="overflow-hidden">
              <iframe
                width="100%"
                height="166"
                scrolling="no"
                frameBorder="no"
                allow="autoplay"
                src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(article.soundcloud_url)}&color=%23f97316&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
                loading="lazy"
              ></iframe>
            </div>
          </div>
        )}

        {/* Back Button (bottom) */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </article>

      {/* Ad Sidebar - desktop only */}
      <div className="hidden lg:block w-72 flex-shrink-0">
        <div className="sticky top-24 space-y-4">
          <HilltopMultiBanner />
          <div className="overflow-hidden h-[352px]">
            <SpotifyEmbed pageType="article" />
          </div>
        </div>
      </div>

      </div>

      {/* More Write Ups */}
      {moreArticles.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t-2 border-gray-200">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">More Write Ups</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {moreArticles.map((a) => (
              <Link
                key={a.id}
                to={generateNewsUrl(a.id, a.title)}
                className="group bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
              >
                {(a.thumbnail_url || a.image_url) && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={a.thumbnail_url || a.image_url}
                      alt={a.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-base font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-1">
                    {a.title}
                  </h3>
                  <p className="text-xs text-gray-500">By {a.author} · {formatDate(a.created_at)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default NewsDetail;
