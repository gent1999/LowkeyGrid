import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [latestArticle, setLatestArticle] = useState(null);
  const [nextFourArticles, setNextFourArticles] = useState([]);
  const [overalls, setOveralls] = useState([]);
  const [writeUps, setWriteUps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch trends articles
        const trendsResponse = await fetch(`${API_URL}/api/lowkeygrid/articles`);
        const trendsData = await trendsResponse.json();

        if (trendsData.length > 0) {
          setLatestArticle(trendsData[0]);
          setNextFourArticles(trendsData.slice(1, 5));
        }

        // Fetch overalls
        const overallsResponse = await fetch(`${API_URL}/api/overalls`);
        const overallsData = await overallsResponse.json();
        setOveralls(overallsData.slice(0, 8)); // Show first 8 overalls

        // Fetch write ups (articles and interviews from lowkeygrid)
        const writeUpsResponse = await fetch(`${API_URL}/api/lowkeygrid/articles/writeups`);
        const writeUpsData = await writeUpsResponse.json();
        setWriteUps(writeUpsData.slice(0, 6)); // Show first 6 write ups
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                    <div className="absolute bottom-0 left-0 right-0 p-6 drop-shadow-lg">
                      <h1 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">
                        {latestArticle.title}
                      </h1>
                      <p className="text-gray-200 text-sm drop-shadow-md">
                        By {latestArticle.author} • {formatDate(latestArticle.created_at)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <p className="text-gray-700 text-xs line-clamp-2">
                    {latestArticle.content.substring(0, 150)}...
                  </p>
                  <div className="mt-2">
                    <span className="inline-block px-3 py-1 text-sm bg-orange-500 text-white font-semibold group-hover:bg-orange-600 transition-colors">
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

          {/* Next 4 Articles - Right (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="flex flex-col gap-3 h-full">
              {nextFourArticles.map((article) => (
                <Link
                  key={article.id}
                  to={`/news/${article.id}`}
                  className="group flex flex-1 bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
                >
                  {article.image_url && (
                    <div className="relative overflow-hidden w-28 flex-shrink-0">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-2 flex-1 flex flex-col justify-center">
                    <h3 className="text-xs font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatDate(article.created_at)}
                    </p>
                  </div>
                </Link>
              ))}

              {nextFourArticles.length === 0 && latestArticle && (
                <div className="bg-gray-100 border-2 border-gray-200 p-6 text-center">
                  <p className="text-gray-500 text-sm">No more articles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2K Overalls Section */}
      <div className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">2K Overalls</h2>
            <Link
              to="/overalls"
              className="text-orange-500 hover:text-orange-600 font-semibold"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {overalls.map((overall) => (
              <Link
                key={overall.id}
                to={`/overalls/${overall.slug}`}
                className="group bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
              >
                {overall.image_url && (
                  <div className="relative overflow-hidden">
                    <img
                      src={overall.image_url}
                      alt={overall.title}
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-3">
                  <h3 className="text-sm font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {overall.title}{overall.overall ? ` - ${overall.overall} Overall` : ''}
                  </h3>
                </div>
              </Link>
            ))}
          </div>

          {overalls.length === 0 && (
            <div className="bg-white border-2 border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No overalls available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Write Ups Section */}
      <div className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Write Ups</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writeUps.map((article) => (
              <Link
                key={article.id}
                to={`/news/${article.id}`}
                className="group bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
              >
                {article.image_url && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    By {article.author}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(article.created_at)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {writeUps.length === 0 && (
            <div className="bg-white border-2 border-gray-200 p-12 text-center">
              <p className="text-gray-500 text-lg">No write ups available yet</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
