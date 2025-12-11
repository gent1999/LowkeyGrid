import Footer from '../components/Footer';

export default function About() {
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
          <h1 className="text-4xl font-bold mb-6 text-orange-600">About LowkeyGrid</h1>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Welcome to <strong>LowkeyGrid</strong>, your premier destination for underground hip hop news, culture, and music discovery.
            </p>

            <p>
              We're dedicated to shining a spotlight on the artists, producers, and creators who operate outside the mainstream. The ones pushing boundaries, breaking conventions, and keeping hip hop culture authentic.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Our Mission</h2>
            <p>
              LowkeyGrid exists to bridge the gap between underground talent and dedicated hip hop fans. We believe the best music often comes from artists who haven't been discovered by the masses yet, and we're here to change that.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black">What We Cover</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Breaking news from the underground hip hop scene</li>
              <li>Exclusive artist interviews and features</li>
              <li>Album and mixtape reviews</li>
              <li>Producer spotlights and beat breakdowns</li>
              <li>Hip hop culture and lifestyle</li>
              <li>Music production tips and resources</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Join Our Community</h2>
            <p>
              Whether you're an artist trying to get your music out there, a producer looking for inspiration, or a fan who's tired of the same old sounds, this is your spot.
            </p>

            <p>
              Stay locked in with us. Subscribe to our newsletter and follow us on social to stay updated on what's popping in the underground scene.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
