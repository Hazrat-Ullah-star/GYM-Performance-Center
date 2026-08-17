import React from 'react';
import { Bike, Apple, Trophy, BarChart } from 'lucide-react';

const features = [
  {
    icon: <Bike size={32} />,
    title: 'Modern Equipment',
    description:
      'State-of-the-art cardiovascular machines, Olympic lifting platforms, and bio-mechanically engineered resistance gear.',
  },
  {
    icon: <Apple size={32} />,
    title: 'Nutrition Coaching',
    description:
      'Personalized macronutrient guidance and meal strategies crafted by sports nutrition specialists to accelerate progress.',
  },
  {
    icon: <Trophy size={32} />,
    title: 'Elite Coaches',
    description:
      'Internationally accredited trainers dedicated to perfecting your technique, preventing injury, and keeping you accountable.',
  },
  {
    icon: <BarChart size={32} />,
    title: 'Tailored Programs',
    description:
      'Data-backed workout routines customized specifically to your body type, mobility level, and fitness objectives.',
  },
];

export const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="spad position-relative">
      <div className="container">
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold text-sm" style={{ color: '#f36100' }}>Why Choose Us</span>
          <h2 className="display-5 text-white fw-bold text-uppercase mt-2" style={{ fontFamily: 'Oswald' }}>
            Push Your Limits Forward
          </h2>
          <div className="mx-auto mt-3" style={{ width: '60px', height: '3px', background: '#f36100' }}></div>
        </div>

        <div className="row g-4">
          {features.map((item, idx) => (
            <div key={idx} className="col-lg-3 col-md-6">
              <div className="g-glass-card p-4 h-100">
                <div
                  className="rounded-circle p-3 d-inline-flex align-items-center justify-content-center mb-4"
                  style={{ background: 'rgba(243, 97, 0, 0.1)', color: '#f36100', width: '68px', height: '68px' }}
                >
                  {item.icon}
                </div>
                <h4 className="text-white fw-bold mb-3" style={{ fontSize: '20px' }}>
                  {item.title}
                </h4>
                <p className="text-secondary text-sm leading-relaxed mb-0">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
