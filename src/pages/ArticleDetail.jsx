import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Footer from '../components/Footer';
import AmazonWidget from '../components/AmazonWidget';
import { generateArticleUrl } from '../utils/slugify';

const API_URL = import.meta.env.VITE_API_URL;

const ArticleDetail = () => {
  const { id: urlId } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [moreArticles, setMoreArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract numeric ID from URL (e.g., "123-drake-new-album" -> "123")
  const id = urlId.split('-')[0];

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`${API_URL}/api/articles/${id}`);

        if (!response.ok) {
          throw new Error('Article not found');
        }

        const data = await response.json();
        setArticle(data.article);
      } catch (err) {
        setError(err.message || 'Failed to load article');
      } finally {
        setLoading(false);
      }
    };

    const fetchMoreArticles = async () => {
      try {
        const response = await fetch(`${API_URL}/api/articles`);
        if (response.ok) {
          const data = await response.json();
          // Filter out current article and get 3 random articles
          const otherArticles = data.articles.filter(article => article.id !== parseInt(id));
          const shuffled = otherArticles.sort(() => 0.5 - Math.random());
          setMoreArticles(shuffled.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch more articles:', err);
      }
    };

    fetchArticle();
    fetchMoreArticles();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen text-gray-900" style={{
        backgroundColor: '#f5f5f5',
        backgroundImage: `
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
          linear-gradient(135deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5),
          linear-gradient(45deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.08) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 20px 20px, 100% 100%'
      }}>
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-xl">Loading article...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen text-gray-900" style={{
        backgroundColor: '#f5f5f5',
        backgroundImage: `
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
          repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
          linear-gradient(135deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5),
          linear-gradient(45deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.08) 100%)
        `,
        backgroundSize: '100% 100%, 100% 100%, 20px 20px, 100% 100%'
      }}>
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">{error || 'Article not found'}</div>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const handleEmailShare = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(article.title)}&body=${encodeURIComponent(window.location.href)}`;
  };

  const handleTweet = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank');
  };

  return (
    <div className="min-h-screen text-gray-900" style={{
      backgroundColor: '#f5f5f5',
      backgroundImage: `
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px),
        linear-gradient(135deg, #f5f5f5 25%, transparent 25%, transparent 75%, #f5f5f5 75%, #f5f5f5),
        linear-gradient(45deg, rgba(249, 115, 22, 0.05) 0%, rgba(234, 88, 12, 0.08) 100%)
      `,
      backgroundSize: '100% 100%, 100% 100%, 20px 20px, 100% 100%'
    }}>
      <div className="relative">
        {/* Share Sidebar - Fixed to far left */}
        <div className="hidden lg:flex fixed left-8 top-1/3 flex-col items-center gap-4 z-50">
          <button
            onClick={handleCopyLink}
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 hover:border-orange-400 transition-all text-gray-600 hover:text-orange-600"
            title="Copy link"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </button>
          <button
            onClick={handleEmailShare}
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 hover:border-orange-400 transition-all text-gray-600 hover:text-orange-600"
            title="Share via email"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={handleTweet}
            className="w-12 h-12 flex items-center justify-center bg-white border-2 border-gray-200 hover:border-orange-400 transition-all text-gray-600 hover:text-orange-600"
            title="Share on Twitter"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </button>
        </div>

        {/* Main Content with Ad Sidebar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex gap-8 justify-center">
          <div className="max-w-4xl flex-1">
            {/* Back Button */}
            <button
              onClick={() => navigate('/')}
              className="mb-6 flex items-center gap-2 text-gray-700 hover:text-orange-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>

            <div className="bg-white border-2 border-gray-200 overflow-hidden">
              {/* Article Image */}
              {article.image_url && (
                <div className="overflow-hidden">
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Article Content Container */}
              <div className="p-8 md:p-12">
                {/* Article Header */}
                <div className="mb-8">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black">{article.title}</h1>

                  <div className="flex items-center gap-4 text-gray-500 text-sm mb-6">
                    <span>By {article.author}</span>
                    <span>•</span>
                    <span>{new Date(article.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-orange-100 text-orange-600 text-sm border border-orange-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-600 hover:text-orange-700 underline"
                        />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 {...props} className="text-3xl font-bold mt-8 mb-4 text-black" />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 {...props} className="text-2xl font-bold mt-6 mb-3 text-black" />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 {...props} className="text-xl font-bold mt-4 mb-2 text-black" />
                      ),
                      p: ({ node, ...props }) => (
                        <p {...props} className="text-gray-700 leading-relaxed mb-4" />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul {...props} className="list-disc list-inside mb-4 text-gray-700" />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol {...props} className="list-decimal list-inside mb-4 text-gray-700" />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote {...props} className="border-l-4 border-orange-500 pl-4 italic text-gray-600 my-4" />
                      ),
                      code: ({ node, inline, ...props }) => (
                        inline ?
                          <code {...props} className="bg-gray-100 px-1 py-0.5 text-orange-600" /> :
                          <code {...props} className="block bg-gray-100 p-4 text-orange-600 overflow-x-auto" />
                      ),
                    }}
                  >
                    {article.content}
                  </ReactMarkdown>
                </div>

                {/* Spotify Embed */}
                {article.spotify_url && (
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Listen on Spotify</h2>
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
                    <h2 className="text-2xl font-bold mb-4">Watch on YouTube</h2>
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
                    <h2 className="text-2xl font-bold mb-4">Listen on SoundCloud</h2>
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

                {/* Back Button Section */}
                <div className="mt-8 pt-8 border-t-2 border-gray-200">
                  <button
                    onClick={() => navigate('/')}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <AmazonWidget page="article" />
            </div>
          </div>
        </div>
      </div>

      {/* More Articles Section */}
      {moreArticles.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t-2 border-gray-200">
          <h2 className="text-3xl font-bold mb-8 text-black">More Articles</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {moreArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => window.location.href = generateArticleUrl(article.id, article.title)}
                className="bg-white border-2 border-gray-200 hover:border-orange-400 overflow-hidden transition cursor-pointer"
              >
                {/* Article Image */}
                {article.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Article Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-black hover:text-orange-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-500 text-xs mb-3">
                    By {article.author} • {new Date(article.created_at).toLocaleDateString()}
                  </p>

                  <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                    {article.content.substring(0, 150)}...
                  </p>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-orange-100 text-orange-600 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ArticleDetail;
