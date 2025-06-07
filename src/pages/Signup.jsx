import { Link } from 'react-router-dom';

export default function Signup() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-offwhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-dark">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-medium">
            Or{' '}
            <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <div className="mt-8">
          <div className="text-center">
            <p className="text-gray-medium">Signup page coming soon...</p>
            <Link to="/login" className="btn-primary mt-4">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

