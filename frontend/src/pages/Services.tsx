import React from 'react';
import { Link } from 'react-router-dom';
import { Badge, Button } from '../components/ui';
import {
  Dumbbell,
  Users,
  Apple,
  BarChart2,
  Waves,
  Zap,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ServiceItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const services: ServiceItem[] = [
  {
    icon: <Dumbbell size={28} />,
    title: 'Personal Training',
    description:
      'One-on-one sessions tailored to your goals with certified trainers. Customized plans, progress tracking, and constant motivation.',
    features: ['Custom workout programming', 'Progress tracking & analytics', 'Nutrition guidance', 'Flexible scheduling'],
  },
  {
    icon: <Users size={28} />,
    title: 'Group Classes',
    description:
      'HIIT, Strength, Yoga, Spin, and more. Fun, energetic sessions designed for all fitness levels — beginner to advanced.',
    features: ['20+ weekly classes', 'Expert class instructors', 'Inclusive for all levels', 'Live scheduling dashboard'],
  },
  {
    icon: <Apple size={28} />,
    title: 'Nutrition Coaching',
    description:
      'Evidence-based meal plans and dietary strategies designed for fat loss, muscle gain, and peak performance.',
    features: ['Personalized meal plans', 'Macro & calorie targets', 'Supplement guidance', 'Weekly check-ins'],
  },
  {
    icon: <BarChart2 size={28} />,
    title: 'Body Composition',
    description:
      'Regular assessments, BMI and body fat tracking to keep you fully accountable throughout your transformation journey.',
    features: ['InBody scan analysis', 'Monthly reassessments', 'Goal benchmarking', 'Visual progress reports'],
  },
  {
    icon: <Waves size={28} />,
    title: 'Recovery & Mobility',
    description:
      'Guided stretching, foam rolling, and mobility sessions to help prevent injuries and accelerate muscle recovery.',
    features: ['Post-workout cool-down', 'Injury prevention routines', 'Sauna & steam room access', 'Sports massage referrals'],
  },
  {
    icon: <Zap size={28} />,
    title: 'Performance Coaching',
    description:
      'Sports-specific training programs for athletes looking to improve speed, strength, explosive power, and mental focus.',
    features: ['Athlete performance testing', 'Sport-specific drills', 'Power & agility work', 'Periodization planning'],
  },
];

const Services: React.FC = () => {
  return (
    <>
      {/* Hero Banner */}
      <section
        className="position-relative py-5 d-flex align-items-center"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)',
          minHeight: '32vh',
        }}
      >
        <div className="container text-center">
          <Badge variant="primary" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <Sparkles size={14} /> WHAT WE OFFER
          </Badge>
          <h1
            className="display-4 text-white fw-bold text-uppercase"
            style={{ fontFamily: 'Oswald' }}
          >
            Our Services
          </h1>
          <p className="text-secondary text-sm max-w-xl mx-auto mb-3">
            From personal coaching to group classes, we offer everything you need to reach your fitness goals.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">Services</span>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="spad">
        <div className="container">
          <div className="row g-4">
            {services.map((service, idx) => (
              <div key={idx} className="col-lg-4 col-md-6">
                <div className="g-glass-card p-4 h-100 d-flex flex-column">
                  {/* Icon */}
                  <div
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
                    style={{
                      width: '62px',
                      height: '62px',
                      background: 'rgba(243, 97, 0, 0.12)',
                      color: '#f36100',
                      border: '1px solid rgba(243, 97, 0, 0.25)',
                      flexShrink: 0,
                    }}
                  >
                    {service.icon}
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-white fw-bold mb-2" style={{ fontSize: '20px' }}>
                    {service.title}
                  </h4>
                  <p className="text-secondary text-sm leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {/* Feature List */}
                  <ul className="list-unstyled d-flex flex-column gap-2 mt-auto pt-3 border-top border-secondary border-opacity-10">
                    {service.features.map((feat, i) => (
                      <li key={i} className="d-flex align-items-center gap-2 text-secondary text-xs">
                        <CheckCircle2 size={14} style={{ color: '#f36100', flexShrink: 0 }} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-5 pt-3">
            <p className="text-secondary mb-4">
              Ready to start? Book a free consultation with one of our certified coaches today.
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/contact">
                <Button variant="primary" rightIcon={<ArrowRight size={16} />}>
                  Book Free Consultation
                </Button>
              </Link>
              <Link to="/classes">
                <Button variant="outline">View Class Schedule</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;
