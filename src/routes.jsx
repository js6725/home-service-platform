import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import LandingPages from './pages/LandingPages';
import LandingPageEditor from './pages/LandingPageEditor';
import AdvancedLandingPageEditor from './pages/AdvancedLandingPageEditor';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import LeadCaptureWidget from './pages/LeadCaptureWidget';
import AutomationWorkflows from './pages/AutomationWorkflows';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import PWAFeatures from './pages/PWAFeatures';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Settings from './pages/Settings';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'landing-pages',
        element: <LandingPages />,
      },
      {
        path: 'landing-pages/new',
        element: <LandingPageEditor />,
      },
      {
        path: 'landing-pages/:id/advanced',
        element: <AdvancedLandingPageEditor />,
      },
      {
        path: 'landing-pages/:id',
        element: <LandingPageEditor />,
      },
      {
        path: 'widgets',
        element: <LeadCaptureWidget />,
      },
      {
        path: 'automation',
        element: <AutomationWorkflows />,
      },
      {
        path: 'analytics',
        element: <AnalyticsDashboard />,
      },
      {
        path: 'mobile',
        element: <PWAFeatures />,
      },
      {
        path: 'leads',
        element: <Leads />,
      },
      {
        path: 'leads/:id',
        element: <LeadDetail />,
      },
      {
        path: 'customers',
        element: <Customers />,
      },
      {
        path: 'customers/:id',
        element: <CustomerDetail />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

