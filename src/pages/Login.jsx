import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Mail, Phone, ArrowRight, Loader2 } from 'lucide-react';
import { signInWithEmail, signInWithPhone } from '../lib/supabase/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { error } = await signInWithEmail(email);
      
      if (error) {
        addToast({
          title: 'Authentication Error',
          message: error.message,
          type: 'error',
        });
      } else {
        setOtpSent(true);
        addToast({
          title: 'Check your email',
          message: 'We sent you a magic link to sign in.',
          type: 'success',
        });
      }
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    try {
      const { error } = await signInWithPhone(phone);
      
      if (error) {
        addToast({
          title: 'Authentication Error',
          message: error.message,
          type: 'error',
        });
      } else {
        setOtpSent(true);
        addToast({
          title: 'Check your phone',
          message: 'We sent you a verification code via SMS.',
          type: 'success',
        });
      }
    } catch (error) {
      addToast({
        title: 'Error',
        message: 'An unexpected error occurred. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (otpSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-offwhite py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-gray-dark">
              Check your {loginMethod === 'email' ? 'email' : 'phone'}
            </h2>
            <p className="mt-2 text-sm text-gray-medium">
              {loginMethod === 'email' 
                ? `We sent a magic link to ${email}. Click the link to sign in.`
                : `We sent a verification code to ${phone}. Enter the code to sign in.`
              }
            </p>
            <button
              onClick={() => {
                setOtpSent(false);
                setEmail('');
                setPhone('');
              }}
              className="mt-4 text-primary hover:text-primary-dark text-sm"
            >
              Try a different {loginMethod === 'email' ? 'email' : 'phone number'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-offwhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-dark">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-medium">
            Welcome back to your Home Service Platform
          </p>
        </div>

        {/* Login Method Toggle */}
        <div className="flex rounded-lg bg-gray-light p-1">
          <button
            onClick={() => setLoginMethod('email')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              loginMethod === 'email'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-medium hover:text-gray-dark'
            }`}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email
          </button>
          <button
            onClick={() => setLoginMethod('phone')}
            className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              loginMethod === 'phone'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-medium hover:text-gray-dark'
            }`}
          >
            <Phone className="h-4 w-4 mr-2" />
            Phone
          </button>
        </div>

        {/* Email Login Form */}
        {loginMethod === 'email' && (
          <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="Enter your email address"
                disabled={loading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !email}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Mail className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Sending magic link...' : 'Send magic link'}
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </button>
            </div>
          </form>
        )}

        {/* Phone Login Form */}
        {loginMethod === 'phone' && (
          <form className="mt-8 space-y-6" onSubmit={handlePhoneLogin}>
            <div>
              <label htmlFor="phone" className="sr-only">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="input-field"
                placeholder="Enter your phone number (e.g., +1234567890)"
                disabled={loading}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !phone}
                className="btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Phone className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Sending code...' : 'Send verification code'}
                {!loading && <ArrowRight className="h-4 w-4 ml-2" />}
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-medium">
            New to our platform?{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

