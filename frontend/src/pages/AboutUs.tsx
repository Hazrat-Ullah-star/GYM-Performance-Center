import React from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '@/config/owner';
import { Button, Badge } from '../components/ui';
import { Target, Eye, Home as HomeIcon, Users, Shield, Coffee, Wifi, Car } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <>
      {/* Breadcrumb Section */}
      <section className="position-relative py-5 d-flex align-items-center" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)', minHeight: '30vh' }}>
        <div className="container text-center">
          <Badge variant="primary" className="mb-3 px-3 py-2">WHO WE ARE</Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase" style={{ fontFamily: 'Oswald' }}>About {SITE.name}</h1>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">About Us</span>
          </div>
        </div>
      </section>

      {/* Main Story & Hero */}
      <section className="spad">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="pe-lg-4">
                <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Our Story</span>
                <h2 className="display-5 text-white fw-bold text-uppercase mt-2 mb-4" style={{ fontFamily: 'Oswald' }}>
                  Islamabad's Premier Destination For Elite Fitness
                </h2>
                <p className="text-secondary leading-relaxed mb-4" style={{ fontSize: '16px' }}>
                  Gym Performance Center was established with a singular mission: to bring world-class training standards, cutting-edge equipment, and an inspiring community atmosphere to the heart of Islamabad.
                </p>
                <p className="text-secondary leading-relaxed mb-5" style={{ fontSize: '15px' }}>
                  Whether you are embarking on your fitness journey or training for peak competition performance, our certified strength coaches, nutritionists, and supportive community environment provide everything you need to succeed.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/classes">
                    <Button variant="primary">Explore Classes</Button>
                  </Link>
                  <Link to="/contact">
                    <Button variant="outline">Contact Us</Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="g-glass-card p-3 position-relative">
                <img src="/img/about-us.jpg" alt="About Gym" className="w-100 rounded-4 shadow" style={{ height: '420px', objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="spad" style={{ background: '#090d12' }}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="g-glass-card p-5 h-100">
                <div className="rounded-circle p-3 d-inline-flex mb-4" style={{ background: 'rgba(243, 97, 0, 0.1)', color: '#f36100' }}>
                  <Target size={32} />
                </div>
                <h3 className="text-white fw-bold mb-3" style={{ fontSize: '24px' }}>Our Mission</h3>
                <p className="text-secondary leading-relaxed mb-0" style={{ fontSize: '15px' }}>
                  To empower individuals across Islamabad to reach their highest potential through science-backed fitness programming, state-of-the-art facilities, expert personal coaching, and an inclusive, motivating community.
                </p>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="g-glass-card p-5 h-100">
                <div className="rounded-circle p-3 d-inline-flex mb-4" style={{ background: 'rgba(243, 97, 0, 0.1)', color: '#f36100' }}>
                  <Eye size={32} />
                </div>
                <h3 className="text-white fw-bold mb-3" style={{ fontSize: '24px' }}>Our Vision</h3>
                <p className="text-secondary leading-relaxed mb-0" style={{ fontSize: '15px' }}>
                  To pioneer a new standard of health and athletic performance in Pakistan—where fitness is not just a routine, but a transformative lifestyle accessible to people of all backgrounds and skill levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* World-Class Amenities */}
      <section className="spad">
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Our Facilities</span>
            <h2 className="display-5 text-white fw-bold text-uppercase mt-2" style={{ fontFamily: 'Oswald' }}>World-Class Amenities</h2>
          </div>

          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <HomeIcon size={36} className="mb-3 text-warning mx-auto" />
                <h4 className="text-white fw-bold mb-2">15,000 Sq Ft Floor</h4>
                <p className="text-secondary text-sm mb-0">Dedicated zones for heavy lifting platforms, cardio decks, functional turf, and free weights.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <Users size={36} className="mb-3 text-warning mx-auto" />
                <h4 className="text-white fw-bold mb-2">Group Class Studios</h4>
                <p className="text-secondary text-sm mb-0">Three acoustic studios for spin cycling, yoga, high-intensity interval training, and boxing.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <Shield size={36} className="mb-3 text-warning mx-auto" />
                <h4 className="text-white fw-bold mb-2">Steam & Sauna Rooms</h4>
                <p className="text-secondary text-sm mb-0">Luxury locker rooms equipped with dry heat saunas and steam rooms for fast muscle recovery.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <Coffee size={36} className="mb-3 text-warning mx-auto" />
                <h4 className="text-white fw-bold mb-2">Protein & Smoothie Bar</h4>
                <p className="text-secondary text-sm mb-0">Fresh post-workout protein shakes, cold-pressed juices, and healthy snacks served daily.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <Wifi size={36} className="mb-3 text-warning mx-auto" />
                <h4 className="text-white fw-bold mb-2">High-Speed WiFi</h4>
                <p className="text-secondary text-sm mb-0">Seamless high-speed internet throughout the facility for workout streaming or remote work.</p>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <Car size={36} className="mb-3 text-warning mx-auto" />
                <h4 className="text-white fw-bold mb-2">Secure Free Parking</h4>
                <p className="text-secondary text-sm mb-0">Ample monitored parking space reserved exclusively for members and guests.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="spad" style={{ background: '#090d12' }}>
        <div className="container">
          <div className="text-center mb-5">
            <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Our Journey</span>
            <h2 className="display-5 text-white fw-bold text-uppercase mt-2" style={{ fontFamily: 'Oswald' }}>Milestones & Growth</h2>
          </div>

          <div className="row g-4 justify-content-center">
            <div className="col-lg-3 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <Badge variant="warning" className="mb-3 text-sm">2018</Badge>
                <h5 className="text-white fw-bold mb-2">Foundation</h5>
                <p className="text-secondary text-sm mb-0">Opened our doors in Hostel City Islamabad with 50 founding members.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <Badge variant="warning" className="mb-3 text-sm">2020</Badge>
                <h5 className="text-white fw-bold mb-2">Facility Expansion</h5>
                <p className="text-secondary text-sm mb-0">Doubled floor space, added group studios, and expanded to 10 certified coaches.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <Badge variant="warning" className="mb-3 text-sm">2022</Badge>
                <h5 className="text-white fw-bold mb-2">Digital Integration</h5>
                <p className="text-secondary text-sm mb-0">Launched online class reservations, live tracking dashboard, and community portal.</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="g-glass-card p-4 h-100 text-center">
                <Badge variant="warning" className="mb-3 text-sm">2026</Badge>
                <h5 className="text-white fw-bold mb-2">Industry Leader</h5>
                <p className="text-secondary text-sm mb-0">Now serving 1,500+ active members with full-stack digital fitness experiences.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
