import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import SpotifyEmbed from '../components/SpotifyEmbed';
import twoKBackground from '../assets/2kbackground.png';
import { generateNewsUrl } from '../utils/slugify';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [heroOverall, setHeroOverall] = useState(null);
  const [squareOveralls, setSquareOveralls] = useState([]);
  const [overalls, setOveralls] = useState([]);
  const [writeUps, setWriteUps] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch hero featured overall
        const heroResponse = await fetch(`${API_URL}/api/overalls/featured/hero`);
        const heroData = await heroResponse.json();
        setHeroOverall(heroData);

        // Fetch square featured overalls
        const squaresResponse = await fetch(`${API_URL}/api/overalls/featured/squares`);
        const squaresData = await squaresResponse.json();
        setSquareOveralls(squaresData);

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

  const latestOveralls = overalls.slice(0, 8);

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
        <div className="grid grid-cols-[1fr_auto] lg:grid-cols-[1fr_auto_1fr] gap-4">
          {/* Hero Featured Overall */}
          {heroOverall ? (
            <Link
              to={`/overalls/${heroOverall.slug}`}
              className="group block bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden relative"
            >
              <img
                src={heroOverall.image_url}
                alt={heroOverall.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                style={{
                  objectPosition: `${heroOverall.hero_crop_x ?? heroOverall.crop_x ?? 50}% ${heroOverall.hero_crop_y ?? heroOverall.crop_y ?? 50}%`,
                  transform: `scale(${(heroOverall.hero_crop_zoom ?? heroOverall.crop_zoom ?? 100) / 100})`,
                  transformOrigin: `${heroOverall.hero_crop_x ?? heroOverall.crop_x ?? 50}% ${heroOverall.hero_crop_y ?? heroOverall.crop_y ?? 50}%`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h1 className="text-sm font-bold text-white mb-1 drop-shadow-lg">
                  {heroOverall.title}
                </h1>
                {heroOverall.overall && (
                  <span className="inline-block px-2 py-0.5 text-[10px] bg-orange-500 text-white font-semibold">
                    {heroOverall.overall} Overall
                  </span>
                )}
              </div>
            </Link>
          ) : (
            <div className="bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
              <p className="text-gray-500 text-sm">No featured overall yet</p>
            </div>
          )}

          {/* 3 Square Featured Overalls - always stacked */}
          <div className="flex flex-col gap-2 w-[90px] lg:w-[140px]">
            {squareOveralls.length > 0 ? squareOveralls.map((overall) => (
              <Link
                key={overall.id}
                to={`/overalls/${overall.slug}`}
                className="group bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden relative aspect-square"
              >
                <img
                  src={overall.image_url}
                  alt={overall.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  style={{
                    objectPosition: `${overall.crop_x ?? 50}% ${overall.crop_y ?? 50}%`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-1.5">
                  <h3 className="text-[10px] font-bold text-white drop-shadow-md line-clamp-1">
                    {overall.title}{overall.overall ? ` - ${overall.overall}` : ''}
                  </h3>
                </div>
              </Link>
            )) : (
              <div className="bg-gray-100 border-2 border-gray-200 flex items-center justify-center flex-1">
                <p className="text-gray-500 text-sm">No square overalls yet</p>
              </div>
            )}
          </div>

          {/* Spotify - spans full width below hero+squares on mobile, own column on desktop */}
          <div className="col-span-2 lg:col-span-1 bg-white border-2 border-gray-200 overflow-hidden">
            <SpotifyEmbed pageType="home" />
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {latestOveralls.map((overall) => (
              <Link
                key={overall.id}
                to={`/overalls/${overall.slug}`}
                className="group bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
              >
                <div className="relative overflow-hidden aspect-square">
                  <img
                    src={overall.image_url}
                    alt={overall.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    style={{ objectPosition: '50% 54%' }}
                  />
                </div>
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
                {(article.thumbnail_url || article.image_url) && (
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={article.thumbnail_url || article.image_url}
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
