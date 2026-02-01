import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SpotifyManager = () => {
  const navigate = useNavigate();
  const [embeds, setEmbeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [pageType, setPageType] = useState('home');
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchEmbeds();
  }, []);

  const fetchEmbeds = async () => {
    try {
      const response = await fetch(`${API_URL}/api/spotify-embeds/all?site=lowkeygrid`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setEmbeds(data.embeds || []);
    } catch (error) {
      console.error('Error fetching embeds:', error);
      showMessage('Failed to fetch Spotify embeds', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!spotifyUrl) {
      showMessage('Please enter a Spotify URL', 'error');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/spotify-embeds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          spotify_url: spotifyUrl,
          page_type: pageType,
          site: 'lowkeygrid'
        })
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message, 'success');
        fetchEmbeds();
        setSpotifyUrl('');
        setPageType('home');
      } else {
        showMessage(data.message || 'Error saving embed', 'error');
      }
    } catch (error) {
      console.error('Error saving embed:', error);
      showMessage('Failed to save Spotify embed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this Spotify embed?')) return;

    try {
      const response = await fetch(`${API_URL}/api/spotify-embeds/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        showMessage(data.message, 'success');
        fetchEmbeds();
      } else {
        showMessage(data.message || 'Error deleting embed', 'error');
      }
    } catch (error) {
      console.error('Error deleting embed:', error);
      showMessage('Failed to delete Spotify embed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-900 text-xl">Loading Spotify embeds...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Spotify Embed Manager</h1>
            <button
              onClick={() => navigate('/admin/overalls')}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-50 border border-green-400 text-green-700' : 'bg-red-50 border border-red-400 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Spotify Embed</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Page Type
              </label>
              <select
                value={pageType}
                onChange={(e) => setPageType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="home">Home Page</option>
                <option value="article">Article Page</option>
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Choose which page this Spotify embed will appear on
              </p>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                Paste Spotify Link
              </label>
              <input
                type="text"
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://open.spotify.com/playlist/... or https://open.spotify.com/album/..."
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Just paste any Spotify link (playlist, album, track, or artist) - everything else is automatic!
              </p>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
            >
              Add to Sidebar
            </button>
          </form>
        </div>

        {/* List of Embeds */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Existing Embeds</h3>

          {embeds.length === 0 ? (
            <p className="text-gray-500">No Spotify embeds yet. Add one above!</p>
          ) : (
            <div className="space-y-4">
              {embeds.map((embed) => (
                <div
                  key={embed.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-gray-900 font-semibold">{embed.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded ${
                        embed.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {embed.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">
                        {embed.embed_type}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {embed.page_type === 'article' ? 'Article Page' : 'Home Page'}
                      </span>
                      <span className="text-gray-500 text-xs">Order: {embed.display_order}</span>
                    </div>
                    <p className="text-gray-500 text-sm truncate">{embed.spotify_url}</p>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => handleDelete(embed.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SpotifyManager;
