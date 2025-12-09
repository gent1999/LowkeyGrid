import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/lowkey_logo.png';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  return (
    <nav className="bg-white border-b-4 border-yellow-400 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="LowkeyGrid" className="h-10 md:h-12" />
            </Link>
          </div>

          {/* Nav Links - Center */}
          <div className="flex items-center space-x-4 md:space-x-8">
            <Link
              to="/news"
              className="text-gray-700 hover:text-yellow-600 transition-colors font-medium text-sm md:text-base"
            >
              News
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-yellow-600 transition-colors font-medium text-sm md:text-base"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-yellow-600 transition-colors font-medium text-sm md:text-base"
            >
              Contact
            </Link>
          </div>

          {/* Search Bar - Right */}
          <div className="flex-shrink-0">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-32 md:w-64 px-3 py-2 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
