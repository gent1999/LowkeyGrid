import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    trends: 0,
    overalls: 0,
    spotifyEmbeds: 0
  });
  const [analyticsStats, setAnalyticsStats] = useState({
    current: 0,
    previous: 0,
    allTime: 0,
    average: 0,
    change: 0,
    realtime: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const verifyAdmin = async () => {
      const token = localStorage.getItem('adminToken');

      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        // Verify token with backend
        const response = await fetch(`${API_URL}/api/admin/dashboard`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Session expired');
        }

        const adminInfo = localStorage.getItem('adminInfo');
        if (adminInfo) {
          setAdmin(JSON.parse(adminInfo));
        }

        // Fetch stats
        await fetchStats(token);
        // Fetch analytics data
        fetchAnalytics(token);
      } catch (err) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnalytics = async (token) => {
      try {
        const analyticsResponse = await fetch(`${API_URL}/api/analytics/visitors`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (analyticsResponse.ok) {
          const analyticsData = await analyticsResponse.json();
          setAnalyticsStats({
            ...analyticsData.visitors,
            loading: false,
            error: null
          });
        } else {
          const errorData = await analyticsResponse.json();
          setAnalyticsStats(prev => ({
            ...prev,
            loading: false,
            error: errorData.message || errorData.error || 'Analytics not configured'
          }));
        }
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setAnalyticsStats(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to load analytics'
        }));
      }
    };

    const fetchStats = async (token) => {
      try {
        // Fetch articles count
        const articlesResponse = await fetch(`${API_URL}/api/lowkeygrid/articles/admin/all`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        // Fetch overalls count
        const overallsResponse = await fetch(`${API_URL}/api/overalls`);

        // Fetch spotify embeds count
        const spotifyResponse = await fetch(`${API_URL}/api/spotify-embeds/all?site=lowkeygrid`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        let articlesCount = 0;
        let overallsCount = 0;
        let spotifyCount = 0;

        if (articlesResponse.ok) {
          const articlesData = await articlesResponse.json();
          articlesCount = articlesData.length;
        }

        if (overallsResponse.ok) {
          const overallsData = await overallsResponse.json();
          overallsCount = overallsData.length;
        }

        if (spotifyResponse.ok) {
          const spotifyData = await spotifyResponse.json();
          spotifyCount = spotifyData.embeds?.length || 0;
        }

        setStats({
          trends: articlesCount,
          overalls: overallsCount,
          spotifyEmbeds: spotifyCount
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    verifyAdmin();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-red-600 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b-4 border-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">2koveralls Admin Dashboard</h1>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-md transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                View Site
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-xl p-8 mb-8 border-2 border-orange-400">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back, {admin?.username}! 🏀
              </h2>
              <p className="text-orange-100 text-sm">
                {admin?.email}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Content Stats */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Content Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Trends */}
            <div
              onClick={() => navigate('/admin/articles')}
              className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-orange-500 cursor-pointer transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Trends</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{stats.trends}</p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 2K Overalls */}
            <div
              onClick={() => navigate('/admin/overalls')}
              className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-orange-500 cursor-pointer transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">2K Overalls</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{stats.overalls}</p>
                </div>
                <div className="bg-orange-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Spotify Playlists */}
            <div
              onClick={() => navigate('/admin/spotify')}
              className="bg-white rounded-lg p-6 border-2 border-gray-200 hover:border-orange-500 cursor-pointer transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Spotify Embeds</p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">{stats.spotifyEmbeds}</p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Google Analytics */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            Google Analytics
          </h3>

          {analyticsStats.loading ? (
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200 shadow-sm">
              <div className="flex items-center justify-center">
                <div className="text-gray-500">Loading analytics...</div>
              </div>
            </div>
          ) : analyticsStats.error ? (
            <div className="bg-white rounded-lg p-8 border-2 border-gray-200 shadow-sm">
              <div className="flex items-center justify-center">
                <div className="text-gray-500">{analyticsStats.error}</div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Visitor Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* This Month */}
                <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">This Month</p>
                      <p className="text-3xl font-bold text-orange-600 mt-2">
                        {analyticsStats.current?.toLocaleString() || 0}
                      </p>
                      {analyticsStats.change !== undefined && analyticsStats.change !== 0 && (
                        <p className={`text-xs mt-1 ${analyticsStats.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {analyticsStats.change > 0 ? '+' : ''}{analyticsStats.change}%
                        </p>
                      )}
                    </div>
                    <div className="bg-orange-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Last Month */}
                <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Last Month</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analyticsStats.previous?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="bg-gray-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* All Time */}
                <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">All Time</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analyticsStats.allTime?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Average Monthly */}
                <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Avg. Monthly</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {analyticsStats.average?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div className="bg-purple-100 p-3 rounded-full">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Realtime Visitors */}
              {analyticsStats.realtime !== undefined && (
                <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border-2 border-orange-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                      </div>
                      <div>
                        <p className="text-gray-700 font-medium">Active Visitors Right Now</p>
                        <p className="text-2xl font-bold text-orange-600 mt-1">
                          {analyticsStats.realtime} {analyticsStats.realtime === 1 ? 'visitor' : 'visitors'}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur-sm p-3 rounded-full">
                      <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            Quick Actions
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Management */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>📝</span>
                Content Management
              </h4>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/articles/create')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Trend
                </button>
                <button
                  onClick={() => navigate('/admin/articles')}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Manage Trends
                </button>
              </div>
            </div>

            {/* 2K Overalls */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>🏀</span>
                2K Overalls
              </h4>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin/overalls/create')}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Overall
                </button>
                <button
                  onClick={() => navigate('/admin/overalls')}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Manage Overalls
                </button>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-white rounded-lg p-6 border-2 border-gray-200 shadow-sm lg:col-span-2">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span>⚙️</span>
                Configuration
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/admin/spotify')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                  Spotify Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
