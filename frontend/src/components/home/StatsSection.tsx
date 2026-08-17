import React from 'react';
import { useCounter } from '../../hooks/useCounter';

export interface StatsSectionProps {
  statsVisible: boolean;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ statsVisible }) => {
  const memberCount = useCounter(1500, 2000, statsVisible);
  const trainerCount = useCounter(20, 1800, statsVisible);
  const classCount = useCounter(50, 1600, statsVisible);
  const satisfactionRate = useCounter(99, 1500, statsVisible);

  return (
    <section id="stats-section" className="py-5" style={{ background: '#0c1015' }}>
      <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="row g-4 text-center">
          <div className="col-md-3 col-6">
            <div className="g-glass-card p-4">
              <h2 className="display-5 text-white fw-bold mb-1 g-gradient-text" style={{ fontFamily: 'Oswald' }}>{memberCount}+</h2>
              <p className="text-secondary mb-0 text-uppercase text-sm fw-medium">Active Members</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="g-glass-card p-4">
              <h2 className="display-5 text-white fw-bold mb-1 g-gradient-text" style={{ fontFamily: 'Oswald' }}>{trainerCount}+</h2>
              <p className="text-secondary mb-0 text-uppercase text-sm fw-medium">Certified Coaches</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="g-glass-card p-4">
              <h2 className="display-5 text-white fw-bold mb-1 g-gradient-text" style={{ fontFamily: 'Oswald' }}>{classCount}+</h2>
              <p className="text-secondary mb-0 text-uppercase text-sm fw-medium">Weekly Classes</p>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="g-glass-card p-4">
              <h2 className="display-5 text-white fw-bold mb-1 g-gradient-text" style={{ fontFamily: 'Oswald' }}>{satisfactionRate}%</h2>
              <p className="text-secondary mb-0 text-uppercase text-sm fw-medium">Success Rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
