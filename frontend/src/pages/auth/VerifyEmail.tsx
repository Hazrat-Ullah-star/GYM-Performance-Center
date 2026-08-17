import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Alert } from '../../components/ui';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('No verification token provided.');
        return;
      }

      try {
        await authApi.verifyEmail(token);
        setStatus('success');
        setMessage('Your email has been successfully verified! You can now access all features.');
      } catch (err) {
        const axiosError = err as { response?: { data?: { detail?: string } } };
        setStatus('error');
        setMessage(axiosError?.response?.data?.detail || 'Verification failed. The link might be invalid or expired.');
      }
    };

    verify();
  }, [token]);

  return (
    <section className="spad min-h-screen d-flex align-items-center" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 text-center">
            <div className="g-glass-card p-5">
              
              {status === 'loading' && (
                <div>
                  <div className="spinner-border text-warning mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
                  <h3 className="text-white">Verifying Email...</h3>
                  <p className="text-secondary">Please wait while we verify your email address.</p>
                </div>
              )}

              {status === 'success' && (
                <div>
                  <CheckCircle size={64} className="text-success mb-4 mx-auto" />
                  <h3 className="text-white mb-3">Email Verified!</h3>
                  <Alert variant="success" className="mb-4 text-start">
                    {message}
                  </Alert>
                  <Link to="/dashboard" className="g-btn-primary">
                    Go to Dashboard
                  </Link>
                </div>
              )}

              {status === 'error' && (
                <div>
                  <XCircle size={64} className="text-danger mb-4 mx-auto" />
                  <h3 className="text-white mb-3">Verification Failed</h3>
                  <Alert variant="error" className="mb-4 text-start">
                    {message}
                  </Alert>
                  <Link to="/login" className="g-btn-outline">
                    Back to Login
                  </Link>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
