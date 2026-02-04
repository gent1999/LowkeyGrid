import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function Overalls() {
  const [overalls, setOveralls] = useState([]);
  const [filteredOveralls, setFilteredOveralls] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchOveralls();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOveralls(overalls);
    } else {
      const filtered = overalls.filter((overall) =>
        overall.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (overall.overall && overall.overall.toString().includes(searchQuery))
      );
      setFilteredOveralls(filtered);
    }
  }, [searchQuery, overalls]);

  const fetchOveralls = async () => {
    try {
      const response = await fetch(`${API_URL}/api/overalls`);
      const data = await response.json();
      setOveralls(data);
      setFilteredOveralls(data);
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
      <Helmet>
        <title>Overalls | 2koveralls</title>
        <meta name="description" content="Ranking your favorite rappers with NBA 2K-style overall ratings" />
        <meta property="og:title" content="Overalls | 2koveralls" />
        <meta property="og:site_name" content="2koveralls" />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">2K Overalls</h1>
          <p className="text-xl text-indigo-100">
            Ranking your favorite rappers with NBA 2K-style overall ratings
          </p>
        </div>
      </div>

      {/* Search Panel */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or overall rating..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-600 transition-colors"
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {filteredOveralls.length} {filteredOveralls.length === 1 ? 'result' : 'results'} found
          </p>
        </div>
      </div>

      {/* Overalls Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredOveralls.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No results found. Try a different search term.' : 'No overalls available yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredOveralls.map((overall) => (
              <Link
                key={overall.id}
                to={`/overalls/${overall.slug}`}
                className="group bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-indigo-500"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={overall.image_url}
                    alt={overall.title}
                    className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                  />
                  {overall.overall && (
                    <div className="absolute top-2 right-2 bg-indigo-600 text-white font-bold text-lg px-3 py-1 rounded-full shadow-lg">
                      {overall.overall}
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {overall.title}
                  </h3>
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
