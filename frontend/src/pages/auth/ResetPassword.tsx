import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Button, Input, Alert } from '../../components/ui';
import { Key } from 'lucide-react';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatus('error');
      setMessage('Invalid or missing reset token.');
      return;
    }

    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      await authApi.resetPassword(token, password);
      setStatus('success');
      setMessage('Your password has been successfully reset.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const axiosError = err as { response?: { data?: { detail?: string } } };
      setStatus('error');
      setMessage(axiosError?.response?.data?.detail || 'Failed to reset password. The link might be expired.');
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
                <h2 className="display-6 text-white fw-bold mt-1" style={{ fontFamily: 'Oswald' }}>Reset Password</h2>
                <p className="text-secondary text-sm">Create a new, strong password for your account.</p>
              </div>

              {status === 'success' && (
                <Alert variant="success" className="mb-4">
                  {message} <br /> Redirecting to login...
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
                    label="New Password *"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  
                  <Input
                    label="Confirm New Password *"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <Button type="submit" variant="primary" fullWidth loading={status === 'loading'} rightIcon={<Key size={16} />}>
                    Reset Password
                  </Button>
                </form>
              )}

              <div className="text-center pt-3 mt-3 border-top border-secondary border-opacity-10 text-secondary text-sm">
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

export default ResetPassword;
