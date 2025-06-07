import { Link } from 'react-router-dom';
import { Menu, Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  
  return (
    <header className="bg-white border-b border-gray-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-gray-medium hover:text-gray-dark hover:bg-gray-light"
              onClick={onMenuClick}
              aria-label="Open sidebar"
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/logo.svg"
                alt="Home Service Platform"
              />
              <span className="ml-2 text-lg font-semibold text-primary hidden sm:block">
                Home Service Platform
              </span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-medium hover:text-gray-dark hover:bg-gray-light"
              aria-label="View notifications"
            >
              <Bell size={20} />
            </button>
            
            <div className="ml-3 relative">
              <div className="flex items-center">
                <Link
                  to="/settings/profile"
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-dark hidden md:block">
                    {user?.email || 'User'}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

