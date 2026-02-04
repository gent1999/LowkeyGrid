import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { stripMarkdown } from '../utils/markdownUtils';
import { setSEO, resetSEO } from '../utils/seo';

function OverallDetail() {
  const { slug } = useParams();
  const [overall, setOverall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOverall();
    return () => resetSEO();
  }, [slug]);

  // Set SEO meta tags when overall loads
  useEffect(() => {
    if (overall) {
      setSEO({
        title: overall.title,
        description: stripMarkdown(overall.content).substring(0, 160) + '...',
        url: window.location.href,
        image: overall.image_url,
        publishedTime: overall.created_at,
      });
    }
  }, [overall]);

  const fetchOverall = async () => {
    try {
      const response = await fetch(`${API_URL}/api/overalls/slug/${slug}`);

      if (!response.ok) {
        throw new Error('Overall not found');
      }

      const data = await response.json();
      setOverall(data);
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

  if (error || !overall) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Overall not found'}
        </div>
        <Link
          to="/"
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
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

  return (
    <div className="min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
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
          Back to Home
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {overall.title}
        </h1>

        {/* Date */}
        <p className="text-gray-600 mb-8">
          Posted on {formatDate(overall.created_at)}
        </p>

        {/* Instagram Link */}
        {overall.instagram_link && (
          <div className="mb-8">
            <a
              href={overall.instagram_link}
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

        {/* Two Column Layout: Image Left, Content Right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image - Left */}
          <div>
            <img
              src={overall.image_url}
              alt={overall.title}
              className="w-full rounded-lg shadow-xl sticky top-8"
            />
          </div>

          {/* Content - Right */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="prose prose-lg max-w-none prose-p:mb-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({node, ...props}) => <p className="mb-4" {...props} />
                }}
              >
                {overall.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Back Button (bottom) */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </article>
    </div>
  );
}

export default OverallDetail;
