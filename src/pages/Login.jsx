import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('email');
  const { signInWithEmail } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setMessage('');

    try {
      await signInWithEmail(email);
      setMessage('Check your email for the magic link!');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent via-primary-dark to-primary-cool relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold mb-4">
              ServicePro
            </h1>
            <p className="text-xl text-white/90 mb-8">
              The complete business platform for home service professionals
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Lightning Fast Setup</h3>
                <p className="text-white/80">Get your landing pages live in minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Enterprise Security</h3>
                <p className="text-white/80">Bank-level security for your business data</p>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
            <p className="text-white/90 italic">
              "ServicePro transformed our lead generation. We've seen a 300% increase in qualified leads since switching."
            </p>
            <div className="mt-4 flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full"></div>
              <div>
                <p className="font-semibold">Mike Johnson</p>
                <p className="text-sm text-white/70">Johnson Plumbing Co.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-12">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 text-center">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-primary">ServicePro</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-primary mb-2">
              Welcome back
            </h2>
            <p className="text-secondary">
              Sign in to your Home Service Platform
            </p>
          </div>

          {/* Auth Tabs */}
          <div className="flex mb-6 bg-elevated rounded-lg p-1">
            <button
              onClick={() => setActiveTab('email')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
                activeTab === 'email'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </button>
            <button
              onClick={() => setActiveTab('phone')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-all ${
                activeTab === 'phone'
                  ? 'bg-card text-primary shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <Phone className="w-4 h-4 mr-2" />
              Phone
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group">
              <label className="form-label">
                {activeTab === 'email' ? 'Email address' : 'Phone number'}
              </label>
              <input
                type={activeTab === 'email' ? 'email' : 'tel'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={
                  activeTab === 'email' 
                    ? 'Enter your email address' 
                    : 'Enter your phone number'
                }
                className="form-input"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full hover-lift"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Sending magic link...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  Send magic link
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg ${
              message.includes('Check your email') 
                ? 'bg-success/10 text-success border border-success/20' 
                : 'bg-error/10 text-error border border-error/20'
            }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-secondary">
              New to our platform?{' '}
              <a href="/signup" className="text-cool hover:text-accent font-medium">
                Create an account
              </a>
            </p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-muted">
              By signing in, you agree to our{' '}
              <a href="#" className="text-cool hover:text-accent">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="text-cool hover:text-accent">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

