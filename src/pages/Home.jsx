import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [latestArticle, setLatestArticle] = useState(null);
  const [nextThreeArticles, setNextThreeArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch(`${API_URL}/api/lowkeygrid/articles`);
        const data = await response.json();

        if (data.length > 0) {
          setLatestArticle(data[0]);
          setNextThreeArticles(data.slice(1, 4));
        }
      } catch (error) {
        console.error('Error fetching trends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest Article - Left (2/3 width) */}
          <div className="lg:col-span-2">
            {latestArticle ? (
              <Link
                to={`/news/${latestArticle.id}`}
                className="group block bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden h-full"
              >
                {latestArticle.image_url && (
                  <div className="relative overflow-hidden h-96">
                    <img
                      src={latestArticle.image_url}
                      alt={latestArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                        {latestArticle.title}
                      </h1>
                      <p className="text-gray-200 text-sm">
                        By {latestArticle.author} • {formatDate(latestArticle.created_at)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="p-6">
                  <p className="text-gray-700 line-clamp-3">
                    {latestArticle.content.substring(0, 200)}...
                  </p>
                  <div className="mt-4">
                    <span className="inline-block px-4 py-2 bg-orange-500 text-white font-semibold group-hover:bg-orange-600 transition-colors">
                      Read More →
                    </span>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="bg-gray-100 border-2 border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">No articles available yet</p>
              </div>
            )}
          </div>

          {/* Next 3 Articles - Right (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="flex flex-col h-full gap-4">
              {nextThreeArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="group flex-1 flex flex-col bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
                >
                  {article.image_url && (
                    <div className="relative overflow-hidden flex-1">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(article.created_at)}
                    </p>
                  </div>
                </Link>
              ))}

              {nextThreeArticles.length === 0 && latestArticle && (
                <div className="bg-gray-100 border-2 border-gray-200 p-6 text-center">
                  <p className="text-gray-500 text-sm">No more articles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
