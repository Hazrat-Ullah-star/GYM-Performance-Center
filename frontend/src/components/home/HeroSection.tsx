import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { ArrowRight, Star, Zap } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="position-relative overflow-hidden pt-5 pb-5 d-flex align-items-center" style={{ minHeight: '92vh', background: 'radial-gradient(circle at 80% 20%, rgba(243,97,0,0.15) 0%, rgba(8,12,16,1) 60%)' }}>
      <div className="container position-relative z-2">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-2 rounded-pill mb-4" style={{ background: 'rgba(243, 97, 0, 0.12)', border: '1px solid rgba(243, 97, 0, 0.3)' }}>
              <span className="badge bg-danger rounded-pill" style={{ background: '#f36100 !important' }}>2026 EDITION</span>
              <span className="text-white text-sm fw-medium">Islamabad's Premier Fitness Community</span>
            </div>
            <h1 className="display-3 text-white fw-extrabold mb-4 lh-sm text-uppercase" style={{ fontFamily: 'Oswald, sans-serif', letterSpacing: '1px' }}>
              Transform Your Body.<br />
              <span className="g-gradient-text">Elevate Your Mind.</span>
            </h1>
            <p className="lead text-secondary mb-5 max-w-2xl" style={{ fontSize: '18px', lineHeight: '1.7' }}>
              Join Islamabad's most advanced fitness center. Premium equipment, expert trainers, live community tracking, and personalized programs designed to unlock your full potential.
            </p>
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <Link to="/register">
                <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                  Start Free 7-Day Trial
                </Button>
              </Link>
              <Link to="/classes">
                <Button variant="outline">Explore Classes</Button>
              </Link>
            </div>

            {/* Trust Badge */}
            <div className="d-flex align-items-center gap-4 mt-5 pt-3 border-top border-secondary border-opacity-10">
              <div className="d-flex align-items-center">
                <div className="rounded-circle overflow-hidden border border-dark me-n2" style={{ width: '40px', height: '40px' }}>
                  <img src="/img/team/team-1.jpg" alt="Member" className="w-100 h-100 object-fit-cover" />
                </div>
                <div className="rounded-circle overflow-hidden border border-dark me-n2" style={{ width: '40px', height: '40px' }}>
                  <img src="/img/team/team-2.jpg" alt="Member" className="w-100 h-100 object-fit-cover" />
                </div>
                <div className="rounded-circle overflow-hidden border border-dark me-n2" style={{ width: '40px', height: '40px' }}>
                  <img src="/img/team/team-3.jpg" alt="Member" className="w-100 h-100 object-fit-cover" />
                </div>
              </div>
              <div>
                <div className="d-flex gap-1 text-warning mb-1" style={{ fontSize: '12px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#f36100" color="#f36100" />
                  ))}
                </div>
                <span className="text-secondary text-sm">Trusted by <strong>1,500+ members</strong> in Islamabad</span>
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="position-relative">
              <div className="g-glass-card p-3 shadow-lg">
                <img src="/img/hero/hero-1.jpg" alt="Gym Performance" className="rounded-4 w-100 shadow" style={{ height: '480px', objectFit: 'cover' }} />
              </div>
              <div className="position-absolute bottom-0 start-0 translate-middle-x d-none d-sm-block g-glass-card p-3 shadow-lg" style={{ width: '220px', marginLeft: '60px', marginBottom: '-20px' }}>
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ background: 'rgba(243, 97, 0, 0.2)', width: '48px', height: '48px' }}>
                    <Zap size={24} className="text-warning" />
                  </div>
                  <div>
                    <h6 className="text-white mb-0 fw-bold">Live Status</h6>
                    <small className="text-success fw-semibold">● Open Now</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
