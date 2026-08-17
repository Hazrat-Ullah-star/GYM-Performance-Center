import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Alert } from '../../components/ui';
import { LogIn } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setError(axiosError?.response?.data?.detail || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    // In a real implementation, this would redirect to the OAuth consent screen
    // or open a popup to get the access token, then call:
    // await socialLogin(provider, token, rememberMe);
    setError(`${provider} login requires OAuth Client IDs to be configured in the environment.`);
  };

  return (
    <section className="spad min-h-screen d-flex align-items-center" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="g-glass-card p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="text-uppercase fw-bold text-xs" style={{ color: '#f36100' }}>Member Login</span>
                <h2 className="display-6 text-white fw-bold text-uppercase mt-1" style={{ fontFamily: 'Oswald' }}>Welcome Back</h2>
                <p className="text-secondary text-sm">Sign in to access your member dashboard and bookings</p>
              </div>

              {error && (
                <Alert variant="error" className="mb-4" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <Input
                  label="Email Address *"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <Input
                  label="Password *"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <div className="d-flex justify-content-between align-items-center my-2">
                  <label className="d-flex align-items-center gap-2 text-secondary text-sm cursor-pointer mb-0">
                    <input 
                      type="checkbox" 
                      className="form-check-input mt-0" 
                      id="remember" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span>Remember me</span>
                  </label>

                  <Link to="/forgot-password" className="text-warning text-sm text-decoration-none hover-orange">
                    Forgot Password?
                  </Link>
                </div>

                <Button type="submit" variant="primary" fullWidth loading={loading} rightIcon={<LogIn size={16} />}>
                  Sign In
                </Button>
                
                <div className="d-flex align-items-center my-2">
                  <div className="flex-grow-1 border-bottom border-secondary opacity-25"></div>
                  <span className="px-3 text-secondary text-xs">OR CONTINUE WITH</span>
                  <div className="flex-grow-1 border-bottom border-secondary opacity-25"></div>
                </div>
                
                <div className="d-flex gap-2">
                  <button type="button" onClick={() => handleSocialLogin('google')} className="btn flex-grow-1 text-white border-white/10 g-glass-card hover-orange-bg transition text-sm d-flex justify-content-center align-items-center gap-2 py-2">
                    <i className="fa fa-google"></i> Google
                  </button>
                  <button type="button" onClick={() => handleSocialLogin('github')} className="btn flex-grow-1 text-white border-white/10 g-glass-card hover-orange-bg transition text-sm d-flex justify-content-center align-items-center gap-2 py-2">
                    <i className="fa fa-github"></i> GitHub
                  </button>
                </div>

                <div className="text-center pt-3 border-top border-secondary border-opacity-10 text-secondary text-sm mt-2">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-warning font-semibold text-decoration-none hover-orange">
                    Sign up here
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
