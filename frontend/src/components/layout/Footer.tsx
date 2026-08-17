import React from 'react'
import { Link } from 'react-router-dom'
import { OWNER, SITE } from '@/config/owner'

export const Footer: React.FC = () => {
  return (
    <footer className="footer-section position-relative" style={{ background: '#070a0d', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
      <div className="container pt-5 pb-4">
        <div className="row g-4">
          {/* Brand Info */}
          <div className="col-lg-4 col-md-6">
            <div className="fs-about pe-lg-4">
              <div className="fa-logo mb-3">
                <Link to="/" className="d-inline-flex align-items-center gap-2">
                  <img src="/img/logo.png" alt={SITE.name} style={{ height: '42px' }} />
                </Link>
              </div>
              <p className="text-secondary mb-4" style={{ fontSize: '14px', lineHeight: '1.7' }}>
                Pakistan's premier fitness destination in Islamabad. Transform your body,
                elevate your mind, and achieve your peak performance with state-of-the-art facilities and elite coaching.
              </p>
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <a href={SITE.social.facebook} target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-facebook"></i>
                </a>
                <a href={SITE.social.twitter} target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-twitter"></i>
                </a>
                <a href={SITE.social.youtube} target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-youtube-play"></i>
                </a>
                <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-instagram"></i>
                </a>
                <a href={SITE.social.whatsapp} target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-whatsapp"></i>
                </a>
                <a href={SITE.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-linkedin"></i>
                </a>
                <a href={SITE.social.github} target="_blank" rel="noopener noreferrer" className="social-btn">
                  <i className="fa fa-github"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-lg-2 col-md-6">
            <div className="fs-widget">
              <h5 className="text-white fw-bold mb-3" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>Quick Links</h5>
              <ul className="list-unstyled d-flex flex-column gap-2 mb-0" style={{ fontSize: '14px' }}>
                <li>
                  <Link to="/about" className="text-secondary hover-orange">About Us</Link>
                </li>
                <li>
                  <Link to="/classes" className="text-secondary hover-orange">Classes</Link>
                </li>
                <li>
                  <Link to="/trainers" className="text-secondary hover-orange">Our Trainers</Link>
                </li>
                <li>
                  <Link to="/community" className="text-secondary hover-orange">Community</Link>
                </li>
                <li>
                  <Link to="/timetable" className="text-secondary hover-orange">Timetable</Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-secondary hover-orange">Gallery</Link>
                </li>
                <li>
                  <Link to="/contact" className="text-secondary hover-orange">Contact</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="col-lg-3 col-md-6">
            <div className="fs-widget">
              <h5 className="text-white fw-bold mb-3" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>Location & Contact</h5>
              <ul className="list-unstyled d-flex flex-column gap-3 mb-0" style={{ fontSize: '14px' }}>
                <li className="d-flex align-items-start gap-3 text-secondary">
                  <i className="fa fa-map-marker mt-1" style={{ color: '#f36100', fontSize: '16px' }}></i>
                  <span>{SITE.address}</span>
                </li>
                <li className="d-flex align-items-start gap-3 text-secondary">
                  <i className="fa fa-phone mt-1" style={{ color: '#f36100', fontSize: '16px' }}></i>
                  <span>{SITE.phones[0]}<br />{SITE.phones[1]}</span>
                </li>
                <li className="d-flex align-items-start gap-3 text-secondary">
                  <i className="fa fa-envelope mt-1" style={{ color: '#f36100', fontSize: '16px' }}></i>
                  <a href={`mailto:${SITE.email}`} className="text-secondary hover-orange">{SITE.email}</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="col-lg-3 col-md-6">
            <div className="fs-widget">
              <h5 className="text-white fw-bold mb-3" style={{ fontSize: '16px', letterSpacing: '0.5px' }}>Newsletter</h5>
              <p className="text-secondary mb-3" style={{ fontSize: '14px' }}>
                Subscribe to get fitness tips, class updates, and special membership deals.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="d-flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="form-control text-white bg-dark border-secondary border-opacity-25 shadow-none text-sm"
                  style={{ borderRadius: '25px', paddingLeft: '16px', background: '#0f1419' }}
                />
                <button type="submit" className="g-btn-primary px-3 py-2 text-sm border-0" style={{ borderRadius: '25px', flexShrink: 0 }}>
                  <i className="fa fa-paper-plane"></i>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="row mt-5 pt-4 border-top border-secondary border-opacity-10 align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <p className="text-secondary mb-0 text-sm">
              &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.
            </p>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <p className="text-secondary mb-0 text-sm">
              Designed & Developed by{' '}
              <a
                href={OWNER.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="fw-bold text-decoration-none"
                style={{ color: '#f36100' }}
              >
                {OWNER.name}
              </a>{' '}
              ·{' '}
              <a
                href={SITE.social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary hover-orange text-decoration-none ms-1"
              >
                GitHub
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .social-btn {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: #94a3b8;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        .social-btn:hover {
          background: #f36100;
          color: #fff;
          border-color: #f36100;
          transform: translateY(-3px);
          box-shadow: 0 4px 14px rgba(243, 97, 0, 0.4);
        }
        .hover-orange:hover {
          color: #f36100 !important;
        }
      `}</style>
    </footer>
  )
}

export default Footer
