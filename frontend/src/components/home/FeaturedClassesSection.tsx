import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui';
import { ArrowRight, Clock } from 'lucide-react';

export const FeaturedClassesSection: React.FC = () => {
  const classesList = [
    {
      title: 'Olympic Weightlifting',
      category: 'STRENGTH',
      image: '/img/classes/class-1.jpg',
      duration: '60 Mins',
      description: 'Master snatches, clean & jerks, and foundational compound lifts with expert biomechanics guidance.',
    },
    {
      title: 'Indoor Spin & Cycling',
      category: 'CARDIO',
      image: '/img/classes/class-2.jpg',
      duration: '45 Mins',
      description: 'High-energy rhythm rides and interval sprints designed to incinerate calories and build endurance.',
    },
    {
      title: 'Boxing & Conditioning',
      category: 'HIIT',
      image: '/img/classes/class-5.jpg',
      duration: '50 Mins',
      description: 'Authentic heavy bag combinations, footwork drills, and core strength conditioning for peak athletic endurance.',
    },
  ];

  return (
    <section className="spad" style={{ background: '#090d12' }}>
      <div className="container">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end mb-5">
          <div>
            <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Our Classes</span>
            <h2 className="display-5 text-white fw-bold text-uppercase mt-2 mb-0" style={{ fontFamily: 'Oswald' }}>Designed For Results</h2>
          </div>
          <Link to="/classes">
            <Button variant="outline" rightIcon={<ArrowRight size={16} />}>View All Classes</Button>
          </Link>
        </div>

        <div className="row g-4">
          {classesList.map((item, idx) => (
            <div key={idx} className="col-lg-4 col-md-6">
              <div className="g-glass-card overflow-hidden h-100">
                <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                  <img src={item.image} alt={item.title} className="w-100 h-100 object-fit-cover hover-scale" />
                  <span className="position-absolute top-0 end-0 m-3 badge bg-danger rounded-pill" style={{ background: '#f36100 !important' }}>
                    {item.category}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="text-white fw-bold mb-2">{item.title}</h4>
                  <p className="text-secondary text-sm mb-4">{item.description}</p>
                  <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary border-opacity-10">
                    <span className="text-secondary text-xs flex items-center gap-1">
                      <Clock size={14} className="text-warning" /> {item.duration}
                    </span>
                    <Link to="/classes" className="text-white fw-bold hover-orange text-sm text-decoration-none">
                      Book Class →
                    </Link>
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
