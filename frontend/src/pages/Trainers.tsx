import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTrainers } from '../api/gym';
import { Button, Badge, Skeleton, EmptyState } from '../components/ui';
import { Star, Award, Users, DollarSign, Sparkles } from 'lucide-react';
import type { Trainer } from '../types';

const Trainers: React.FC = () => {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const defaultTrainerImg = '/img/trainers/Haseeb%20Ur%20Rehman.jpg';

  useEffect(() => {
    loadTrainers();
  }, []);

  const loadTrainers = async () => {
    try {
      setLoading(true);
      const data = await getTrainers();
      setTrainers(data);
    } catch (error) {
      console.error('Failed to load trainers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header Banner */}
      <section className="position-relative py-5 d-flex align-items-center" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)', minHeight: '32vh' }}>
        <div className="container text-center">
          <Badge variant="primary" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <Sparkles size={14} /> EXPERT COACHING
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase" style={{ fontFamily: 'Oswald' }}>Our Elite Coaches</h1>
          <p className="text-secondary text-sm max-w-xl mx-auto mb-3">
            Certified fitness professionals dedicated to taking your physical performance to the next level.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">Trainers</span>
          </div>
        </div>
      </section>

      {/* Grid Display */}
      <section className="spad">
        <div className="container">
          {loading ? (
            <div className="row g-4">
              {[1, 2, 3].map((idx) => (
                <div key={idx} className="col-lg-4 col-md-6">
                  <div className="g-glass-card p-4">
                    <Skeleton height="240px" className="mb-3" />
                    <Skeleton height="24px" width="60%" className="mb-2" />
                    <Skeleton height="16px" width="40%" className="mb-4" />
                    <Skeleton height="40px" rounded="20px" />
                  </div>
                </div>
              ))}
            </div>
          ) : trainers.length === 0 ? (
            <EmptyState
              icon={<Award size={48} />}
              title="No Trainers Available"
              description="Check back soon for our updated coach roster."
              action={<Link to="/contact"><Button variant="outline">Contact Us</Button></Link>}
            />
          ) : (
            <div className="row g-4">
              {trainers.map((trainer) => (
                <div key={trainer.id} className="col-lg-4 col-md-6">
                  <div className="g-glass-card overflow-hidden h-100 d-flex flex-column justify-content-between">
                    <div>
                      {/* Coach Image */}
                      <div className="position-relative overflow-hidden" style={{ height: '280px' }}>
                        <img
                          src={trainer.user.avatar || defaultTrainerImg}
                          alt={trainer.user.display_name}
                          className="w-100 h-100 object-fit-cover hover-scale"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = defaultTrainerImg;
                          }}
                        />
                        <span className="position-absolute bottom-0 start-0 m-3 badge bg-dark bg-opacity-75 border border-secondary border-opacity-25 px-3 py-2 text-warning font-monospace text-xs">
                          {trainer.specialties || 'Master Coach'}
                        </span>
                      </div>

                      {/* Coach Bio & Info */}
                      <div className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <h4 className="text-white fw-bold mb-0" style={{ fontSize: '22px' }}>{trainer.user.display_name}</h4>
                          <div className="d-flex align-items-center gap-1 text-warning text-xs">
                            <Star size={14} fill="#f36100" color="#f36100" />
                            <span className="fw-bold">{trainer.rating || '4.9'}</span>
                          </div>
                        </div>

                        <p className="text-secondary text-sm leading-relaxed mb-4">
                          {trainer.bio || 'Specialized in personalized resistance training, mobility optimization, and athletic conditioning.'}
                        </p>

                        <div className="d-flex flex-column gap-2 text-secondary text-xs pt-3 border-top border-secondary border-opacity-10">
                          <div className="d-flex align-items-center gap-2">
                            <Award size={14} className="text-warning" />
                            <span>Experience: <strong className="text-white">{trainer.years_experience || 5}+ Years</strong></span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <Users size={14} className="text-warning" />
                            <span>Clients Coached: <strong className="text-white">{trainer.total_clients || 120}+ Members</strong></span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <DollarSign size={14} className="text-warning" />
                            <span>Rate: <strong className="text-white">PKR {trainer.hourly_rate || '3,000'} / Session</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <Link to="/contact" className="w-100 text-decoration-none">
                        <Button variant="primary" fullWidth>Book Consultation</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Trainers;
