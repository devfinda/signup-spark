import { Sparkles, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import UserMenu from './UserMenu';
import GoogleSignInButton from './GoogleSignInButton';

export default function Header() {
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-amber-500 bg-clip-text text-transparent">
            SignupSpark
          </span>
        </Link>
        <div className="flex items-center space-x-6">
          <nav className="flex items-center space-x-6">
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-purple-600 hover:text-purple-700"
                  title="Home"
                >
                  <Home className="w-5 h-5" />
                </Link>
                <Link 
                  to="/contacts" 
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  My Contacts
                </Link>
                <Link 
                  to="/profile" 
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  Profile
                </Link>
              </>
            )}
          </nav>
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <GoogleSignInButton variant="outline" size="sm" />
          )}
        </div>
      </div>
    </header>
  );
}