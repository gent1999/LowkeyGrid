import { Link } from 'react-router-dom';
import logo from '../assets/logo_2k.png';

export default function Footer() {
  return (
    <footer className="bg-white border-t-4 border-orange-500 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <Link
            to="/about"
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-xs text-center"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-xs text-center"
          >
            Contact
          </Link>
          <Link
            to="/privacy"
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-xs text-center"
          >
            Privacy Policy
          </Link>
          <Link
            to="/submit-music"
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-xs text-center"
          >
            Submit Music
          </Link>
          <Link
            to="/dmca"
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-xs text-center"
          >
            DMCA
          </Link>
          <Link
            to="/terms"
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium text-xs text-center"
          >
            Terms of Use
          </Link>
        </div>

        {/* Copyright with Logo */}
        <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-center gap-2">
          <Link to="/">
            <img src={logo} alt="2koveralls" className="h-5" />
          </Link>
          <p className="text-gray-500 text-xs">
            &copy; {new Date().getFullYear()} 2koveralls. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
