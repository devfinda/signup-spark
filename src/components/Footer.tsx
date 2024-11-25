import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <nav className="flex items-center gap-6">
            <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/blog" className="text-sm text-gray-600 hover:text-gray-900">
              Blog
            </Link>
            <Link to="/help" className="text-sm text-gray-600 hover:text-gray-900">
              Help
            </Link>
            <Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">
              Contact Us
            </Link>
          </nav>
          <div className="text-sm text-gray-500 text-center">
            © {currentYear} SignupSpark. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}