import { useState } from 'react';
import Footer from '../components/Footer';

export default function SubmitMusic() {
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    trackTitle: '',
    genre: '',
    soundcloudLink: '',
    spotifyLink: '',
    description: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement music submission
    setStatus('Submission received! We\'ll check out your music and get back to you.');
    setFormData({
      artistName: '',
      email: '',
      trackTitle: '',
      genre: '',
      soundcloudLink: '',
      spotifyLink: '',
      description: ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border-2 border-gray-200 p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-6 text-orange-600">Submit Your Music</h1>

          <div className="mb-8 p-4 bg-orange-50 border-2 border-orange-200">
            <h3 className="font-bold text-black mb-2">Submission Guidelines:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>We accept all subgenres of hip hop</li>
              <li>Must be original work or have proper licensing</li>
              <li>Include links to streaming platforms (SoundCloud, Spotify, etc.)</li>
              <li>Provide a brief description of your sound and story</li>
              <li>We'll get back to you in 1-2 weeks</li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="artistName" className="block text-sm font-medium text-gray-700 mb-2">
                  Artist/Group Name *
                </label>
                <input
                  type="text"
                  id="artistName"
                  name="artistName"
                  value={formData.artistName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="trackTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Track/Album Title *
                </label>
                <input
                  type="text"
                  id="trackTitle"
                  name="trackTitle"
                  value={formData.trackTitle}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-2">
                  Subgenre
                </label>
                <input
                  type="text"
                  id="genre"
                  name="genre"
                  value={formData.genre}
                  onChange={handleChange}
                  placeholder="e.g., Boom Bap, Lo-fi, Trap"
                  className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="soundcloudLink" className="block text-sm font-medium text-gray-700 mb-2">
                SoundCloud Link *
              </label>
              <input
                type="url"
                id="soundcloudLink"
                name="soundcloudLink"
                value={formData.soundcloudLink}
                onChange={handleChange}
                required
                placeholder="https://soundcloud.com/..."
                className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="spotifyLink" className="block text-sm font-medium text-gray-700 mb-2">
                Spotify Link (Optional)
              </label>
              <input
                type="url"
                id="spotifyLink"
                name="spotifyLink"
                value={formData.spotifyLink}
                onChange={handleChange}
                placeholder="https://open.spotify.com/..."
                className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Tell Us About Your Music *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="6"
                placeholder="Tell us your story, what inspires you, and what makes your sound different..."
                className="w-full px-4 py-2 border-2 border-gray-300 focus:border-orange-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
            >
              Submit Music
            </button>

            {status && (
              <div className="mt-4 p-4 bg-green-50 border-2 border-green-500 text-green-700">
                {status}
              </div>
            )}
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
