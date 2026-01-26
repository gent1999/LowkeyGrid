import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Overalls() {
  const [overalls, setOveralls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOveralls();
  }, []);

  const fetchOveralls = async () => {
    try {
      const response = await fetch(`${API_URL}/api/overalls`);
      const data = await response.json();
      setOveralls(data);
    } catch (error) {
      setError('Failed to fetch overalls');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading overalls...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">2K Overalls</h1>
          <p className="text-xl text-indigo-100">
            Ranking your favorite rappers with NBA 2K-style overall ratings
          </p>
        </div>
      </div>

      {/* Overalls Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {overalls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No overalls available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {overalls.map((overall) => (
              <Link
                key={overall.id}
                to={`/overalls/${overall.slug}`}
                className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={overall.image_url}
                    alt={overall.title}
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {overall.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {overall.content.substring(0, 150)}...
                  </p>
                  <div className="mt-4 flex items-center text-indigo-600 font-medium">
                    <span>Read more</span>
                    <svg
                      className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Overalls;
