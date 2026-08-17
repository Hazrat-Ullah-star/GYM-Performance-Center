import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Alert } from '../../components/ui';
import { UserPlus } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password_confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirm) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
      navigate('/dashboard');
    } catch (err) {
      const axiosError = err as { response?: { data?: Record<string, string[]> } };
      if (axiosError?.response?.data) {
        // Handle DRF validation errors
        const errData = axiosError.response.data;
        if (errData.email) setError(errData.email[0]);
        else if (errData.username) setError(errData.username[0]);
        else setError('Registration failed. Please check your details.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    setError(`${provider} login requires OAuth Client IDs to be configured in the environment.`);
  };

  return (
    <section className="spad min-h-screen d-flex align-items-center" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="g-glass-card p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="text-uppercase fw-bold text-xs" style={{ color: '#f36100' }}>Join Us Today</span>
                <h2 className="display-6 text-white fw-bold text-uppercase mt-1" style={{ fontFamily: 'Oswald' }}>Create Your Account</h2>
                <p className="text-secondary text-sm">Start your transformation journey with Gym Performance Center</p>
              </div>

              {error && (
                <Alert variant="error" className="mb-4" onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
                <div className="row g-3">
                  <div className="col-md-6">
                    <Input
                      label="Username *"
                      name="username"
                      required
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Email Address *"
                      type="email"
                      name="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Password *"
                      type="password"
                      name="password"
                      required
                      minLength={8}
                      placeholder="Min 8 characters"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6">
                    <Input
                      label="Confirm Password *"
                      type="password"
                      name="password_confirm"
                      required
                      minLength={8}
                      placeholder="Re-enter password"
                      value={formData.password_confirm}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="my-2">
                  <label className="d-flex align-items-start gap-2 text-secondary text-sm cursor-pointer mb-0">
                    <input type="checkbox" className="form-check-input mt-1" required />
                    <span>
                      I agree to the{' '}
                      <Link to="/terms" className="text-warning text-decoration-underline hover-orange">Terms &amp; Conditions</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-warning text-decoration-underline hover-orange">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                <Button type="submit" variant="primary" fullWidth loading={loading} rightIcon={<UserPlus size={16} />}>
                  Create Account
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

                <div className="text-center pt-3 border-top border-secondary border-opacity-10 text-secondary text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-warning font-semibold text-decoration-none hover-orange">
                    Sign in here
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

export default Register;
