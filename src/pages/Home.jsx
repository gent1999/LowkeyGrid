import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import SpotifyEmbed from '../components/SpotifyEmbed';
import twoKBackground from '../assets/2kbackground.png';
import { generateNewsUrl, generateArticleUrl } from '../utils/slugify';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [latestArticle, setLatestArticle] = useState(null);
  const [nextFourArticles, setNextFourArticles] = useState([]);
  const [overalls, setOveralls] = useState([]);
  const [writeUps, setWriteUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);

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
        setOveralls(overallsData); // Store all overalls for carousel

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

  // Auto-carousel for overalls - advances every 4 seconds
  useEffect(() => {
    if (overalls.length <= 4) return; // No need to carousel if 4 or fewer

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % overalls.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [overalls.length]);

  // Get 4 overalls starting from carousel index, wrapping around
  const getVisibleOveralls = () => {
    if (overalls.length <= 4) return overalls;
    const visible = [];
    for (let i = 0; i < 4; i++) {
      visible.push(overalls[(carouselIndex + i) % overalls.length]);
    }
    return visible;
  };
  const visibleOveralls = getVisibleOveralls();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-900">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      backgroundColor: '#fafafa',
      backgroundImage: `
        radial-gradient(circle at 20% 30%, rgba(249, 115, 22, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 70%, rgba(234, 88, 12, 0.04) 0%, transparent 50%),
        repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(249, 115, 22, 0.02) 35px, rgba(249, 115, 22, 0.02) 70px),
        linear-gradient(180deg, #fafafa 0%, #f5f5f5 100%)
      `,
      backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%'
    }}>
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Latest Article + 3 Trends - Left (2/3 width) */}
          <div className="lg:col-span-2 space-y-3">
            {/* Featured Article */}
            {latestArticle ? (
              <Link
                to={generateNewsUrl(latestArticle.id, latestArticle.title)}
                className="group block bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
              >
                {latestArticle.image_url && (
                  <div className="relative overflow-hidden h-80">
                    <img
                      src={latestArticle.image_url}
                      alt={latestArticle.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h1 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-lg">
                        {latestArticle.title}
                      </h1>
                      <p className="text-gray-200 text-xs mb-2 drop-shadow-md">
                        By {latestArticle.author} • {formatDate(latestArticle.created_at)}
                      </p>
                      <span className="inline-block px-3 py-1 text-xs bg-orange-500 text-white font-semibold group-hover:bg-orange-600 transition-colors">
                        Read More →
                      </span>
                    </div>
                  </div>
                )}
              </Link>
            ) : (
              <div className="bg-gray-100 border-2 border-gray-200 p-12 text-center">
                <p className="text-gray-500 text-lg">No articles available yet</p>
              </div>
            )}

            {/* 3 Trend Articles Row */}
            <div className="grid grid-cols-3 gap-3">
              {nextFourArticles.slice(0, 3).map((article) => (
                <Link
                  key={article.id}
                  to={generateNewsUrl(article.id, article.title)}
                  className="group bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
                >
                  {article.image_url && (
                    <div className="relative overflow-hidden h-24">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-1.5">
                    <h3 className="text-[10px] font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Spotify Playlist - Right (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 overflow-hidden h-[450px] lg:h-full">
              <SpotifyEmbed pageType="home" />
            </div>
          </div>
        </div>
      </div>

      {/* 2K Overalls Section */}
      <div className="py-8 relative bg-white" style={{
        marginTop: '0',
        marginBottom: '0',
        paddingTop: '4rem',
        paddingBottom: '4rem'
      }}>
        {/* Background image with 50% opacity */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: `url(${twoKBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        ></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">2K Overalls</h2>
            <Link
              to="/overalls"
              className="text-orange-500 hover:text-orange-600 font-semibold transition-colors"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 transition-opacity duration-500">
            {visibleOveralls.map((overall) => (
              <Link
                key={overall.id}
                to={`/overalls/${overall.slug}`}
                className="group bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden animate-fadeIn"
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
            <div className="bg-gray-50 border-2 border-gray-200 p-12 text-center rounded-lg">
              <p className="text-gray-500 text-lg">No overalls available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Write Ups Section */}
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Write Ups</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {writeUps.map((article) => (
              <Link
                key={article.id}
                to={generateNewsUrl(article.id, article.title)}
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

      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
}
