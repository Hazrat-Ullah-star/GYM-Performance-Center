import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Button, Input, Alert } from '../../components/ui';
import { Mail } from 'lucide-react';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await authApi.forgotPassword(email);
      setStatus('success');
      setMessage(response.message);
    } catch (err) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setStatus('error');
      setMessage(axiosError?.response?.data?.detail || 'Failed to request password reset. Please try again.');
    }
  };

  return (
    <section className="spad min-h-screen d-flex align-items-center" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-8">
            <div className="g-glass-card p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="text-uppercase fw-bold text-xs" style={{ color: '#f36100' }}>Account Recovery</span>
                <h2 className="display-6 text-white fw-bold mt-1" style={{ fontFamily: 'Oswald' }}>Forgot Password</h2>
                <p className="text-secondary text-sm">Enter your email address and we'll send you a link to reset your password.</p>
              </div>

              {status === 'success' && (
                <Alert variant="success" className="mb-4">
                  {message}
                </Alert>
              )}

              {status === 'error' && (
                <Alert variant="error" className="mb-4" onClose={() => setStatus('idle')}>
                  {message}
                </Alert>
              )}

              {status !== 'success' && (
                <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                  <Input
                    label="Email Address *"
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <Button type="submit" variant="primary" fullWidth loading={status === 'loading'} rightIcon={<Mail size={16} />}>
                    Send Reset Link
                  </Button>
                </form>
              )}

              <div className="text-center pt-3 mt-3 border-top border-secondary border-opacity-10 text-secondary text-sm">
                Remember your password?{' '}
                <Link to="/login" className="text-warning font-semibold text-decoration-none hover-orange">
                  Back to login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgotPassword;
