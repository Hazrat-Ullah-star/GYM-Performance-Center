import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { ArrowRight } from 'lucide-react';

export const CtaBannerSection: React.FC = () => {
  return (
    <section className="py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(243,97,0,0.2) 0%, rgba(15,20,25,1) 100%)' }}>
      <div
          className="container text-center py-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
      >
        <h2 className="display-4 text-white fw-bold text-uppercase mb-3" style={{ fontFamily: 'Oswald' }}>Ready To Start Your Transformation?</h2>
        <p className="lead text-secondary mb-4 mx-auto max-w-xl">
          Join Islamabad's premier fitness destination today. Get a free trial pass and complimentary trainer consultation.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/register">
            <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
              Claim Free Trial
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline">Contact Team</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
