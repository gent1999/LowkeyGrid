import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function NewsDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`${API_URL}/api/lowkeygrid/articles/${id}`);

      if (!response.ok) {
        throw new Error('Article not found');
      }

      const data = await response.json();
      setArticle(data);
    } catch (error) {
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
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
          to="/news"
          className="mt-4 inline-block text-orange-600 hover:text-orange-800"
        >
          ← Back to News
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

  return (
    <div className="min-h-screen bg-white">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/news"
          className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-6"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to News
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>

        {/* Metadata */}
        <div className="flex items-center gap-4 mb-8">
          <p className="text-gray-600">
            By <span className="font-medium text-gray-900">{article.author}</span>
          </p>
          <span className="text-gray-400">•</span>
          <p className="text-gray-600">{formatDate(article.created_at)}</p>
        </div>

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Featured Image */}
        {article.image_url && (
          <div className="mb-8">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full rounded-lg shadow-xl"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>

        {/* Back Button (bottom) */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            to="/news"
            className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors"
          >
            View More Articles
          </Link>
        </div>
      </article>
    </div>
  );
}

export default NewsDetail;
