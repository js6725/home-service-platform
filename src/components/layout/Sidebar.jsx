import { NavLink } from 'react-router-dom';
import { X, Home, FileText, Users, Settings, MessageSquare, Zap, BarChart3, Smartphone, Widget } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { signOut } = useAuth();
  
  const navigation = [
    { name: 'Dashboard', to: '/', icon: Home },
    { name: 'Landing Pages', to: '/landing-pages', icon: FileText },
    { name: 'Leads', to: '/leads', icon: MessageSquare },
    { name: 'Widgets', to: '/widgets', icon: Widget },
    { name: 'Automation', to: '/automation', icon: Zap },
    { name: 'Analytics', to: '/analytics', icon: BarChart3 },
    { name: 'Mobile & PWA', to: '/mobile', icon: Smartphone },
    { name: 'Customers', to: '/customers', icon: Users },
    { name: 'Settings', to: '/settings', icon: Settings },
  ];
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <>
      {/* Mobile sidebar */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-dark bg-opacity-50"
            onClick={onClose}
            aria-hidden="true"
          />
          
          {/* Sidebar panel */}
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-lg">
            <div className="h-full flex flex-col overflow-y-auto">
              <div className="flex items-center justify-between px-4 h-16 border-b border-gray-light">
                <span className="text-lg font-semibold text-primary">
                  Home Service Platform
                </span>
                <button
                  type="button"
                  className="p-2 rounded-md text-gray-medium hover:text-gray-dark hover:bg-gray-light"
                  onClick={onClose}
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="flex-1 px-2 py-4 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-light text-primary'
                          : 'text-gray-dark hover:bg-gray-light'
                      }`
                    }
                    onClick={onClose}
                  >
                    <item.icon
                      size={20}
                      className="mr-3 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
              
              <div className="p-4 border-t border-gray-light">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-dark hover:bg-gray-light rounded-md"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="w-64 flex flex-col">
          <div className="flex-1 flex flex-col min-h-0 border-r border-gray-light bg-white">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-primary-light text-primary'
                          : 'text-gray-dark hover:bg-gray-light'
                      }`
                    }
                  >
                    <item.icon
                      size={20}
                      className="mr-3 flex-shrink-0"
                      aria-hidden="true"
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
            
            <div className="p-4 border-t border-gray-light">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-dark hover:bg-gray-light rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

