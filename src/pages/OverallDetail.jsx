import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function OverallDetail() {
  const { slug } = useParams();
  const [overall, setOverall] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOverall();
  }, [slug]);

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
          to="/overalls"
          className="mt-4 inline-block text-indigo-600 hover:text-indigo-800"
        >
          ← Back to All Overalls
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
          to="/overalls"
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
          Back to All Overalls
        </Link>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {overall.title}
        </h1>

        {/* Date */}
        <p className="text-gray-600 mb-8">
          Posted on {formatDate(overall.created_at)}
        </p>

        {/* Image */}
        <div className="mb-8">
          <img
            src={overall.image_url}
            alt={overall.title}
            className="w-full rounded-lg shadow-xl"
          />
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {overall.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Back Button (bottom) */}
        <div className="mt-12 text-center">
          <Link
            to="/overalls"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View More Overalls
          </Link>
        </div>
      </article>
    </div>
  );
}

export default OverallDetail;
