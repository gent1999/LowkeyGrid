import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import SpotifyEmbed from '../components/SpotifyEmbed';
import twoKBackground from '../assets/2kbackground.png';
import { generateNewsUrl } from '../utils/slugify';
import { stripMarkdown } from '../utils/markdownUtils';

const API_URL = import.meta.env.VITE_API_URL;

export default function Home() {
  const [heroOverall, setHeroOverall] = useState(null);
  const [squareOveralls, setSquareOveralls] = useState([]);
  const [overalls, setOveralls] = useState([]);
  const [writeUps, setWriteUps] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
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

        // Fetch featured article from Cry808
        const featuredResponse = await fetch(`${API_URL}/api/articles/featured/article`);
        const featuredData = await featuredResponse.json();
        setFeaturedArticle(featuredData.article || null);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const latestOveralls = overalls.slice(0, 4);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const SkeletonHero = () => (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0 lg:pb-8">
      <div className="lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
        <div className="flex flex-col gap-4 w-full max-w-[336px] sm:max-w-[556px] mx-auto lg:contents">
          <div className="flex gap-4 lg:contents">
            <div className="flex-1 bg-gray-200 animate-pulse"></div>
            <div className="flex flex-col gap-2 w-[80px] sm:w-[140px]">
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
              <div className="aspect-square bg-gray-200 animate-pulse"></div>
            </div>
          </div>
          <div className="h-[196px] bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonOveralls = () => (
    <div className="bg-white pt-0 pb-16 lg:pt-16 lg:pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-9 w-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="border-2 border-gray-100">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="relative min-h-[300px] lg:min-h-0 bg-gray-200 animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const SkeletonWriteUps = () => (
    <div className="py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-9 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="flex flex-col gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex gap-4 border-2 border-gray-100">
              <div className="w-32 sm:w-48 flex-shrink-0 h-32 sm:h-36 bg-gray-200 animate-pulse"></div>
              <div className="flex-1 p-4">
                <div className="h-5 bg-gray-200 animate-pulse rounded mb-2"></div>
                <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2 mb-3"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded mb-1"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
      {loading ? (
        <>
          <SkeletonHero />
          <SkeletonOveralls />
          <SkeletonWriteUps />
        </>
      ) : (
        <>
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-0 lg:pb-8">
        {/* On desktop: 3-column grid. On mobile/tablet: centered flex column. */}
        <div className="lg:grid lg:grid-cols-[1fr_auto_1fr] lg:gap-4">
          {/* lg:contents dissolves this wrapper so hero/squares/spotify become direct grid items on desktop */}
          <div className="flex flex-col gap-4 w-full max-w-[336px] sm:max-w-[556px] mx-auto lg:contents">
            {/* lg:contents dissolves this row wrapper on desktop */}
            <div className="flex gap-4 lg:contents">
              {/* Hero Featured Overall */}
              {heroOverall ? (
                <Link
                  to={`/overalls/${heroOverall.slug}`}
                  className="group flex-1 relative overflow-hidden bg-white border-2 border-gray-200 hover:border-orange-500 transition-all"
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
                <div className="flex-1 bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                  <p className="text-gray-500 text-sm">No featured overall yet</p>
                </div>
              )}

              {/* 3 Square Featured Overalls - always stacked */}
              <div className="flex flex-col gap-2 w-[80px] sm:w-[140px]">
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
            </div>

            {/* Spotify - same width as hero+squares on mobile (parent max-w-[556px]), own column on desktop */}
            <div className="overflow-hidden h-[196px] lg:h-auto">
              <SpotifyEmbed pageType="home" />
            </div>
          </div>
        </div>
      </div>

      {/* 2K Overalls Section */}
      <div className="relative bg-white pt-0 pb-16 lg:pt-16 lg:pb-16">
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: 2x2 grid of 4 overalls */}
            <div className="grid grid-cols-2 gap-4">
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

            {/* Right: Featured article from Cry808 */}
            {featuredArticle ? (
              <div className="relative min-h-[300px] lg:min-h-0">
                <Link
                  to={generateNewsUrl(featuredArticle.id, featuredArticle.title)}
                  className="group absolute inset-0 overflow-hidden block"
                >
                  {featuredArticle.image_url && (
                    <img
                      src={featuredArticle.image_url}
                      alt={featuredArticle.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20"></div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold uppercase tracking-wider">
                      CRY808
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-white/20 text-white uppercase tracking-wider mb-3">
                      {featuredArticle.category === 'interview' ? 'Interview' : 'Article'}
                    </span>
                    <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg leading-tight line-clamp-3">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-white/70 text-sm">
                      By {featuredArticle.author} · {new Date(featuredArticle.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="relative min-h-[300px] lg:min-h-0 bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                <p className="text-gray-500 text-sm">No featured article yet</p>
              </div>
            )}
          </div>

          {overalls.length === 0 && (
            <div className="bg-gray-50 border-2 border-gray-200 p-12 text-center rounded-lg mt-6">
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

          <div className="flex flex-col gap-4">
            {writeUps.map((article) => (
              <Link
                key={article.id}
                to={generateNewsUrl(article.id, article.title)}
                className="group flex gap-4 bg-white border-2 border-gray-200 hover:border-orange-500 transition-all overflow-hidden"
              >
                {(article.thumbnail_url || article.image_url) ? (
                  <div className="w-32 sm:w-48 flex-shrink-0 relative overflow-hidden self-stretch">
                    <img
                      src={article.thumbnail_url || article.image_url}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-32 sm:w-48 flex-shrink-0 bg-gray-100"></div>
                )}
                <div className="flex-1 py-4 pr-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    By {article.author} · {formatDate(article.created_at)}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {stripMarkdown(article.content)}
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
        </>
      )}

      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
}
