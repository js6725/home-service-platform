import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [authMethod, setAuthMethod] = useState('email');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  
  const { signInWithEmail, signInWithPhone, verifyOtp } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (authMethod === 'email') {
        const { error } = await signInWithEmail(email);
        
        if (error) {
          throw error;
        }
        
        addToast({
          title: 'Check your email',
          message: 'We sent you a magic link to sign in.',
          type: 'info',
        });
      } else if (authMethod === 'phone') {
        if (!otpSent) {
          const { error } = await signInWithPhone(phone);
          
          if (error) {
            throw error;
          }
          
          setOtpSent(true);
          addToast({
            title: 'Code sent',
            message: 'We sent you a verification code via SMS.',
            type: 'info',
          });
        } else {
          const { data, error } = await verifyOtp(phone, otp);
          
          if (error) {
            throw error;
          }
          
          if (data?.session) {
            navigate(from, { replace: true });
          }
        }
      }
    } catch (error) {
      addToast({
        title: 'Authentication failed',
        message: error.message,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-offwhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-dark">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-medium">
            Or{' '}
            <Link to="/signup" className="font-medium text-primary hover:text-primary-dark">
              create a new account
            </Link>
          </p>
        </div>
        
        <div className="mt-8">
          <div className="flex justify-center space-x-4 mb-6">
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                authMethod === 'email'
                  ? 'bg-primary-light text-primary'
                  : 'bg-white text-gray-medium'
              }`}
              onClick={() => setAuthMethod('email')}
            >
              Email
            </button>
            <button
              type="button"
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                authMethod === 'phone'
                  ? 'bg-primary-light text-primary'
                  : 'bg-white text-gray-medium'
              }`}
              onClick={() => setAuthMethod('phone')}
            >
              Phone
            </button>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {authMethod === 'email' ? (
              <div>
                <label htmlFor="email" className="form-label">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
            ) : (
              <>
                <div>
                  <label htmlFor="phone" className="form-label">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    className="form-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading || otpSent}
                    placeholder="+1234567890"
                  />
                </div>
                
                {otpSent && (
                  <div>
                    <label htmlFor="otp" className="form-label">
                      Verification code
                    </label>
                    <input
                      id="otp"
                      name="otp"
                      type="text"
                      required
                      className="form-input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      disabled={loading}
                      placeholder="123456"
                    />
                  </div>
                )}
              </>
            )}
            
            <div>
              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : authMethod === 'email' ? (
                  'Send magic link'
                ) : otpSent ? (
                  'Verify code'
                ) : (
                  'Send verification code'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

