import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Settings,
  HelpCircle,
  Moon,
  Sun,
  ChevronDown
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const notifications = [
    {
      id: 1,
      title: 'New lead received',
      message: 'John Smith requested a plumbing quote',
      time: '2 min ago',
      unread: true
    },
    {
      id: 2,
      title: 'Landing page published',
      message: 'Your "Emergency Plumbing" page is now live',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Monthly report ready',
      message: 'Your November analytics report is available',
      time: '3 hours ago',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <header className="bg-card border-b border-primary h-16 flex items-center justify-between px-6 sticky top-0 z-40">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search leads, customers, pages..."
            className="form-input pl-10 pr-4 py-2 w-full bg-elevated border-secondary focus:border-cool"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-lg hover:bg-elevated transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-secondary" />
          ) : (
            <Moon className="w-5 h-5 text-secondary" />
          )}
        </button>

        {/* Help */}
        <button
          className="p-2 rounded-lg hover:bg-elevated transition-colors"
          title="Help & Support"
        >
          <HelpCircle className="w-5 h-5 text-secondary" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-elevated transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5 text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-card border border-primary rounded-lg shadow-xl z-50">
              <div className="p-4 border-b border-primary">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-primary">Notifications</h3>
                  <span className="text-xs text-secondary">{unreadCount} unread</span>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-primary hover:bg-elevated transition-colors cursor-pointer ${
                      notification.unread ? 'bg-elevated/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-primary">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-secondary mt-1">
                          {notification.message}
                        </p>
                        <span className="text-xs text-muted mt-2 block">
                          {notification.time}
                        </span>
                      </div>
                      {notification.unread && (
                        <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-primary">
                <button className="text-sm text-cool hover:text-accent transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-elevated transition-colors"
          >
            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-primary">
                {user?.email?.split('@')[0]}
              </p>
              <p className="text-xs text-secondary">Business Owner</p>
            </div>
            <ChevronDown className="w-4 h-4 text-secondary" />
          </button>

          {/* User Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-card border border-primary rounded-lg shadow-xl z-50">
              <div className="p-3 border-b border-primary">
                <p className="text-sm font-medium text-primary">{user?.email}</p>
                <p className="text-xs text-secondary">Business Owner</p>
              </div>
              
              <div className="py-2">
                <button className="w-full flex items-center px-3 py-2 text-sm text-secondary hover:bg-elevated hover:text-primary transition-colors">
                  <User className="w-4 h-4 mr-3" />
                  Profile Settings
                </button>
                <button className="w-full flex items-center px-3 py-2 text-sm text-secondary hover:bg-elevated hover:text-primary transition-colors">
                  <Settings className="w-4 h-4 mr-3" />
                  Account Settings
                </button>
              </div>
              
              <div className="border-t border-primary py-2">
                <button
                  onClick={logout}
                  className="w-full flex items-center px-3 py-2 text-sm text-error hover:bg-elevated transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handlers */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};

export default Navbar;

