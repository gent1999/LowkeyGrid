import { useState, useEffect } from 'react';
import AmazonWidget from '../components/AmazonWidget';
import AmazonMobileAd from '../components/AmazonMobileAd';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [latestArticles, setLatestArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [allRecentArticles, setAllRecentArticles] = useState([]);
  const [displayCount, setDisplayCount] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest articles
        const articlesResponse = await fetch(`${API_URL}/api/articles`);
        const articlesData = await articlesResponse.json();

        // Fetch featured article
        const featuredResponse = await fetch(`${API_URL}/api/articles/featured/article`);
        const featuredData = await featuredResponse.json();
        setFeaturedArticle(featuredData.article);

        // Get latest 5 original articles (1of1 Originals)
        const sortedArticles = articlesData.articles
          .filter(article => article.is_original === true)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5);

        setLatestArticles(sortedArticles);

        // Get recent articles (excluding featured, the top 5 originals, and evergreen guides)
        const topOriginalIds = sortedArticles.map(a => a.id);
        const recentList = articlesData.articles
          .filter(article =>
            article.id !== featuredData.article?.id &&
            !topOriginalIds.includes(article.id) &&
            article.is_evergreen !== true
          )
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setAllRecentArticles(recentList);
        setRecentArticles(recentList.slice(0, displayCount));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Update displayed articles when displayCount changes
  useEffect(() => {
    setRecentArticles(allRecentArticles.slice(0, displayCount));
  }, [displayCount, allRecentArticles]);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 10);
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
      {/* Latest Articles Section */}
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {latestArticles.map((article) => (
                <div
                  key={article.id}
                  className="bg-white border-2 border-gray-200 hover:border-orange-400 transition-all cursor-pointer group"
                >
                  {/* Article Image */}
                  {article.image_url && (
                    <div className="h-24 overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  {/* Article Content */}
                  <div className="p-2">
                    <h3 className="font-semibold text-xs line-clamp-2 mb-1 group-hover:text-orange-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[10px] text-gray-500">
                      {new Date(article.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loopcloud Banner */}
          <div className="flex justify-center mt-6">
            <a
              href="https://www.loopcloud.com/cloud/subscriptions/plans?a_aid=69279c96df583&a_bid=c3bef289"
              target="_blank"
              rel="noopener noreferrer"
              className="block border-2 border-gray-200 hover:border-orange-400 transition-all overflow-hidden"
            >
              <img
                src="/loopcloud_970x90.jpg"
                alt="Loopcloud"
                className="w-full h-auto"
              />
            </a>
          </div>

          {/* Mobile Amazon Ad */}
          <AmazonMobileAd className="mt-6" />
        </div>
      </div>

      {/* Featured Article & Sidebar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Featured Article - 75% width (3 columns) */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-gray-600">Loading...</div>
            ) : featuredArticle ? (
              <div className="bg-white border-2 border-gray-200 hover:border-orange-400 transition-all overflow-hidden">
                <div className="p-6 pb-4">
                  <h2 className="text-3xl font-bold text-black hover:text-orange-600 transition-colors">
                    {featuredArticle.title}
                  </h2>
                </div>
                {featuredArticle.image_url && (
                  <div className="h-96 overflow-hidden">
                    <img
                      src={featuredArticle.image_url}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-gray-600 mb-2 text-sm">
                    By {featuredArticle.author} • {new Date(featuredArticle.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {featuredArticle.content.substring(0, 200)}...
                  </p>
                  <button className="px-6 py-2 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors">
                    Read More
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-gray-600">No featured article available</div>
            )}

            {/* Recent Articles List */}
            {!loading && recentArticles.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-black">Latest Stories</h2>
                <div className="space-y-4">
                  {recentArticles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white border-2 border-gray-200 hover:border-orange-400 transition-all cursor-pointer group overflow-hidden"
                    >
                      <div className="flex gap-4">
                        {/* Article Image */}
                        {article.image_url && (
                          <div className="w-48 h-32 flex-shrink-0 overflow-hidden">
                            <img
                              src={article.image_url}
                              alt={article.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}

                        {/* Article Content */}
                        <div className="flex-1 p-4 min-w-0">
                          <h3 className="text-lg font-bold mb-2 group-hover:text-orange-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            By {article.author} • {new Date(article.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {article.content.substring(0, 150)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {recentArticles.length < allRecentArticles.length && (
                  <div className="mt-6 text-center">
                    <button
                      onClick={handleLoadMore}
                      className="px-8 py-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors rounded-lg"
                    >
                      Load More Articles
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - 25% width (1 column) */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-4">
              <AmazonWidget page="home" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
