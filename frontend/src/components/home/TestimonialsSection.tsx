import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const reviews = [
    {
      name: 'Sana Mahmood',
      role: 'Pro Member · Islamabad',
      avatar: '/img/team/team-1.jpg',
      quote: 'Gym Performance Center transformed my lifestyle. The coaches are top-tier and the equipment is always spotless. Down 15kg in 5 months!',
    },
    {
      name: 'Hamza Malik',
      role: 'VIP Member · Islamabad',
      avatar: '/img/team/team-2.jpg',
      quote: 'Hands down the best gym facility in Islamabad. The spin classes and boxing workouts give an incredible workout high every single day.',
    },
    {
      name: 'Ayesha Ahmed',
      role: 'Standard Member · Islamabad',
      avatar: '/img/team/team-3.jpg',
      quote: 'As a beginner, I was intimidated by gym environments. The staff here made me feel right at home from day one. Highly recommended!',
    },
  ];

  return (
    <section className="spad" style={{ background: '#070a0d' }}>
      <div className="container">
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Testimonials</span>
          <h2 className="display-5 text-white fw-bold text-uppercase mt-2" style={{ fontFamily: 'Oswald' }}>What Our Members Say</h2>
        </div>

        <div className="row g-4">
          {reviews.map((rev, idx) => (
            <div key={idx} className="col-lg-4 col-md-6">
              <div className="g-glass-card p-4 h-100 d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex gap-1 text-warning mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#f36100" color="#f36100" />
                    ))}
                  </div>
                  <p className="text-secondary fst-italic text-sm mb-4">"{rev.quote}"</p>
                </div>
                <div className="d-flex align-items-center gap-3 pt-3 border-top border-secondary border-opacity-10">
                  <div className="rounded-circle overflow-hidden" style={{ width: '48px', height: '48px' }}>
                    <img src={rev.avatar} alt={rev.name} className="w-100 h-100 object-fit-cover" />
                  </div>
                  <div>
                    <h6 className="text-white mb-0 fw-bold">{rev.name}</h6>
                    <small className="text-secondary">{rev.role}</small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
