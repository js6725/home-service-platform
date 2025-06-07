import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToast();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      
      if (error) {
        addToast({
          title: 'Authentication failed',
          message: errorDescription || 'An error occurred during authentication',
          type: 'error',
        });
        navigate('/login');
        return;
      }
      
      // If no error, redirect to dashboard
      navigate('/');
    };
    
    handleAuthCallback();
  }, [searchParams, navigate, addToast]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-offwhite">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-medium">Completing authentication...</p>
      </div>
    </div>
  );
}

