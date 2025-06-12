import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BarChart3, 
  Settings, 
  Zap,
  Puzzle,
  ChevronLeft,
  ChevronRight,
  Home,
  Target
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      description: 'Overview & metrics'
    },
    {
      name: 'Landing Pages',
      href: '/landing-pages',
      icon: FileText,
      description: 'Build & manage pages'
    },
    {
      name: 'Leads',
      href: '/leads',
      icon: Target,
      description: 'Manage your leads'
    },
    {
      name: 'Customers',
      href: '/customers',
      icon: Users,
      description: 'Customer database'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      description: 'Performance insights'
    },
    {
      name: 'Automation',
      href: '/automation',
      icon: Zap,
      description: 'Email & SMS workflows'
    },
    {
      name: 'Widgets',
      href: '/widgets',
      icon: Puzzle,
      description: 'Lead capture forms'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'Account settings'
    }
  ];

  return (
    <div className={`bg-secondary border-r border-primary transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-primary">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-primary">ServicePro</h2>
                <p className="text-xs text-secondary">Business Platform</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-md hover:bg-card transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-secondary" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-secondary" />
            )}
          </button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && user && (
        <div className="p-4 border-b border-primary">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.email?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-primary truncate">
                {user.email}
              </p>
              <p className="text-xs text-secondary">Business Owner</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `nav-item group relative ${isActive ? 'active' : ''} ${
                  isCollapsed ? 'justify-center' : ''
                }`
              }
            >
              <Icon className={`w-5 h-5 ${isCollapsed ? '' : 'mr-3'} flex-shrink-0`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <span className="font-medium">{item.name}</span>
                  <p className="text-xs text-tertiary mt-0.5">{item.description}</p>
                </div>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-elevated rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                  <div className="text-sm font-medium text-primary">{item.name}</div>
                  <div className="text-xs text-secondary">{item.description}</div>
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary">
        {!isCollapsed ? (
          <div className="text-center">
            <div className="text-xs text-secondary mb-2">
              ServicePro Platform v2.0
            </div>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-xs text-secondary">All systems operational</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-success rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

