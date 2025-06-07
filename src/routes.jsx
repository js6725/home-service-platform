import { createBrowserRouter } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import LandingPages from './pages/LandingPages';
import LandingPageEditor from './pages/LandingPageEditor';
import Leads from './pages/Leads';
import LeadDetail from './pages/LeadDetail';
import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AuthCallback from './pages/AuthCallback';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/common/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'landing-pages', element: <LandingPages /> },
      { path: 'landing-pages/new', element: <LandingPageEditor /> },
      { path: 'landing-pages/:id', element: <LandingPageEditor /> },
      { path: 'leads', element: <Leads /> },
      { path: 'leads/:id', element: <LeadDetail /> },
      { path: 'customers', element: <Customers /> },
      { path: 'customers/:id', element: <CustomerDetail /> },
      { path: 'settings/*', element: <Settings /> },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '*', element: <NotFound /> },
]);

export default router;

