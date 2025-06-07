import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-offwhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-dark mb-2">Page Not Found</h2>
          <p className="text-gray-medium">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <Link to="/" className="btn-primary inline-flex items-center">
          <Home className="h-4 w-4 mr-2" />
          Go Home
        </Link>
      </div>
    </div>
  );
}

