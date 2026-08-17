import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { CheckCircle, XCircle } from 'lucide-react';

export const PricingSection: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  return (
    <section className="spad position-relative">
      <div className="container">
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Membership Plans</span>
          <h2 className="display-5 text-white fw-bold text-uppercase mt-2" style={{ fontFamily: 'Oswald' }}>Choose Your Plan</h2>

          {/* Toggle */}
          <div className="d-inline-flex align-items-center gap-3 p-1 mt-4 rounded-pill" style={{ background: '#141b24', border: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              className={`btn btn-sm rounded-pill px-4 py-2 text-sm fw-bold ${billingCycle === 'monthly' ? 'btn-danger text-white' : 'text-secondary'}`}
              style={{ background: billingCycle === 'monthly' ? '#f36100' : 'transparent', border: 'none' }}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`btn btn-sm rounded-pill px-4 py-2 text-sm fw-bold ${billingCycle === 'annual' ? 'btn-danger text-white' : 'text-secondary'}`}
              style={{ background: billingCycle === 'annual' ? '#f36100' : 'transparent', border: 'none' }}
              onClick={() => setBillingCycle('annual')}
            >
              Annual <span className="badge bg-warning text-dark ms-1">Save 20%</span>
            </button>
          </div>
        </div>

        <div className="row g-4 justify-content-center">
          {/* Day Pass */}
          <div className="col-lg-4 col-md-6">
            <div className="g-glass-card p-4 text-center h-100 d-flex flex-column justify-content-between">
              <div>
                <h4 className="text-white fw-bold mb-2">Class Drop-In</h4>
                <p className="text-secondary text-sm mb-4">Ideal for casual visits and quick workouts</p>
                <div className="my-4">
                  <span className="display-4 text-white fw-extrabold" style={{ fontFamily: 'Oswald' }}>PKR 1,500</span>
                  <span className="text-secondary text-sm"> / pass</span>
                </div>
                <ul className="list-unstyled text-secondary text-sm d-flex flex-column gap-3 mb-4 text-start">
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Full single-day gym floor access</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Locker & shower room access</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> High-speed WiFi access</li>
                  <li className="flex items-center gap-2 text-gray-500"><XCircle size={16} className="opacity-50" /> Personal coach assessment</li>
                </ul>
              </div>
              <Link to="/register">
                <Button variant="outline" fullWidth>Get Pass</Button>
              </Link>
            </div>
          </div>

          {/* Unlimited Pro (Featured) */}
          <div className="col-lg-4 col-md-6">
            <div className="g-glass-card p-4 text-center h-100 d-flex flex-column justify-content-between position-relative" style={{ border: '2px solid #f36100', background: 'rgba(243, 97, 0, 0.05)' }}>
              <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger px-3 py-2 text-uppercase" style={{ background: '#f36100 !important' }}>Most Popular</span>
              <div>
                <h4 className="text-white fw-bold mb-2 mt-2">Unlimited Pro</h4>
                <p className="text-secondary text-sm mb-4">Everything you need to reach your full potential</p>
                <div className="my-4">
                  <span className="display-4 text-white fw-extrabold g-gradient-text" style={{ fontFamily: 'Oswald' }}>
                    {billingCycle === 'annual' ? 'PKR 8,000' : 'PKR 10,000'}
                  </span>
                  <span className="text-secondary text-sm"> / month</span>
                </div>
                <ul className="list-unstyled text-secondary text-sm d-flex flex-column gap-3 mb-4 text-start">
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-400" /> Unlimited 24/7 gym access</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-400" /> Access to all group classes</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-400" /> 2 Complimentary coach sessions</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-400" /> Monthly body composition analysis</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-amber-400" /> Sauna & steam room access</li>
                </ul>
              </div>
              <Link to="/register">
                <Button variant="primary" fullWidth>Enroll Now</Button>
              </Link>
            </div>
          </div>

          {/* Elite VIP */}
          <div className="col-lg-4 col-md-6">
            <div className="g-glass-card p-4 text-center h-100 d-flex flex-column justify-content-between">
              <div>
                <h4 className="text-white fw-bold mb-2">Elite VIP</h4>
                <p className="text-secondary text-sm mb-4">Complete 1-on-1 personal coaching package</p>
                <div className="my-4">
                  <span className="display-4 text-white fw-extrabold" style={{ fontFamily: 'Oswald' }}>
                    {billingCycle === 'annual' ? 'PKR 20,000' : 'PKR 25,000'}
                  </span>
                  <span className="text-secondary text-sm"> / month</span>
                </div>
                <ul className="list-unstyled text-secondary text-sm d-flex flex-column gap-3 mb-4 text-start">
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> All Unlimited Pro features</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> 12 Personal training sessions / mo</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Custom meal & nutrition plan</li>
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-400" /> Dedicated VIP locker & towel service</li>
                </ul>
              </div>
              <Link to="/register">
                <Button variant="outline" fullWidth>Join VIP</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
