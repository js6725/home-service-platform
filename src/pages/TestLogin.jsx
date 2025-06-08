import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function TestLogin() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    // Create a test user session
    const testUser = {
      id: '8a36a1be-5e3a-43c4-aebc-cb6dc6a408a6',
      email: 'jsite6725@gmail.com',
      user_metadata: {
        email: 'jsite6725@gmail.com',
        email_verified: true,
      },
      app_metadata: {
        provider: 'email',
        providers: ['email']
      }
    };

    // Set the test user in the auth context
    setUser(testUser);

    // Store in localStorage to persist the session
    localStorage.setItem('supabase.auth.token', JSON.stringify({
      access_token: 'test-token',
      refresh_token: 'test-refresh',
      expires_at: Date.now() + 3600000, // 1 hour from now
      user: testUser
    }));

    // Redirect to dashboard after a short delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Setting up your test session...
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              You'll be redirected to your dashboard in a moment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

