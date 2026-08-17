import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getWeekSchedule, createBooking } from '../api/gym';
import { useAuth } from '../contexts/AuthContext';
import { Button, Badge, Modal, Skeleton, SearchBar, EmptyState } from '../components/ui';
import { Calendar, Clock, Users, MapPin, Trophy, CheckCircle, Sparkles } from 'lucide-react';
import type { ClassSchedule } from '../types';

const Classes: React.FC = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [weekSchedule, setWeekSchedule] = useState<Record<string, ClassSchedule[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState((searchParams.get('search') || '').trim());

  useEffect(() => {
    loadSchedule();
  }, []);

  const loadSchedule = async () => {
    try {
      setLoading(true);
      const data = await getWeekSchedule();
      setWeekSchedule(data);
    } catch (error) {
      console.error('Failed to load schedule:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClass = async () => {
    if (!selectedClass || !bookingDate) return;

    try {
      await createBooking({
        class_schedule_id: selectedClass.id,
        booking_date: bookingDate,
      });
      setBookingSuccess(true);
      setSelectedClass(null);
      setTimeout(() => setBookingSuccess(false), 4000);
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Failed to book class. Please try again.');
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'beginner':
        return <Badge variant="success">Beginner</Badge>;
      case 'intermediate':
        return <Badge variant="warning">Intermediate</Badge>;
      case 'advanced':
        return <Badge variant="danger">Advanced</Badge>;
      default:
        return <Badge variant="neutral">All Levels</Badge>;
    }
  };

  const search = useMemo(() => searchTerm.toLowerCase().trim(), [searchTerm]);

  const matchesSearch = (schedule: ClassSchedule) => {
    if (!search) return true;
    const name = schedule.gym_class.name?.toLowerCase() || '';
    const type = schedule.gym_class.class_type?.toLowerCase() || '';
    const trainer = schedule.gym_class.trainer?.user.display_name?.toLowerCase() || '';
    return name.includes(search) || type.includes(search) || trainer.includes(search);
  };

  return (
    <>
      {/* Header Banner */}
      <section className="position-relative py-5 d-flex align-items-center" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(243,97,0,0.12) 0%, rgba(8,12,16,1) 80%)', minHeight: '32vh' }}>
        <div className="container text-center">
          <Badge variant="primary" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <Sparkles size={14} /> LIVE SCHEDULE
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase" style={{ fontFamily: 'Oswald' }}>Fitness Class Schedule</h1>
          <p className="text-secondary text-sm max-w-xl mx-auto mb-3">
            Reserve your spot in our high-intensity, expert-coached training sessions.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">Classes</span>
          </div>
        </div>
      </section>

      {/* Success Banner */}
      {bookingSuccess && (
        <div className="bg-success text-white py-3 shadow">
          <div className="container d-flex align-items-center justify-content-center gap-2 text-center">
            <CheckCircle size={20} />
            <span className="fw-bold">Class spot reserved successfully! Check your dashboard for details.</span>
          </div>
        </div>
      )}

      {/* Search Filter Bar */}
      <div className="container mt-4">
        <div className="g-glass-card p-3 max-w-lg mx-auto">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by class name, type, or coach..."
          />
        </div>
      </div>

      {/* Main Schedule Display */}
      <section className="spad">
        <div className="container">
          {loading ? (
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="col-lg-4 col-md-6">
                  <div className="g-glass-card p-4">
                    <Skeleton height="28px" width="60%" className="mb-3" />
                    <Skeleton height="18px" width="40%" className="mb-3" />
                    <Skeleton height="80px" width="100%" className="mb-4" />
                    <Skeleton height="40px" width="100%" rounded="20px" />
                  </div>
                </div>
              ))}
            </div>
          ) : Object.keys(weekSchedule).length === 0 ? (
            <EmptyState
              icon={<Calendar size={48} />}
              title="No Classes Scheduled"
              description="No classes match your search query. Please try searching for another term or clear the filter."
              action={<Button variant="outline" onClick={() => setSearchTerm('')}>Reset Search</Button>}
            />
          ) : (
            <div className="d-flex flex-column gap-5">
              {Object.entries(weekSchedule).map(([day, classes]) => {
                const filteredClasses = classes.filter(matchesSearch);
                if (filteredClasses.length === 0) return null;

                return (
                  <div key={day}>
                    <div className="d-flex align-items-center gap-3 mb-4 pb-2 border-bottom border-secondary border-opacity-10">
                      <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ background: 'rgba(243, 97, 0, 0.15)', color: '#f36100' }}>
                        <Calendar size={20} />
                      </div>
                      <h3 className="text-white fw-bold text-uppercase mb-0" style={{ fontFamily: 'Oswald', fontSize: '24px' }}>{day}</h3>
                      <Badge variant="neutral">{filteredClasses.length} Classes</Badge>
                    </div>

                    <div className="row g-4">
                      {filteredClasses.map((schedule) => (
                        <div key={schedule.id} className="col-lg-4 col-md-6">
                          <div className="g-glass-card p-4 h-100 d-flex flex-column justify-content-between">
                            <div>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h4 className="text-white fw-bold mb-1" style={{ fontSize: '20px' }}>{schedule.gym_class.name}</h4>
                                  <span className="text-warning text-xs font-monospace">{schedule.gym_class.class_type?.toUpperCase()}</span>
                                </div>
                                {getDifficultyBadge(schedule.gym_class.difficulty)}
                              </div>

                              <div className="d-flex flex-column gap-2 my-4 text-secondary text-sm">
                                <div className="d-flex align-items-center gap-2">
                                  <Clock size={16} className="text-warning" />
                                  <span>{schedule.start_time} - {schedule.end_time} ({schedule.gym_class.duration_minutes} mins)</span>
                                </div>
                                {schedule.gym_class.trainer && (
                                  <div className="d-flex align-items-center gap-2">
                                    <Trophy size={16} className="text-warning" />
                                    <span>Coach: <strong className="text-white">{schedule.gym_class.trainer.user.display_name}</strong></span>
                                  </div>
                                )}
                                {schedule.room && (
                                  <div className="d-flex align-items-center gap-2">
                                    <MapPin size={16} className="text-warning" />
                                    <span>Studio Room {schedule.room}</span>
                                  </div>
                                )}
                                <div className="d-flex align-items-center gap-2 mt-1">
                                  <Users size={16} className="text-warning" />
                                  <span className={schedule.available_spots > 0 ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                    {schedule.available_spots} Spots Available
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="pt-3 border-top border-secondary border-opacity-10">
                              {user ? (
                                <Button
                                  variant={schedule.available_spots > 0 ? 'primary' : 'outline'}
                                  fullWidth
                                  disabled={schedule.available_spots === 0}
                                  onClick={() => setSelectedClass(schedule)}
                                >
                                  {schedule.available_spots > 0 ? 'Reserve Spot' : 'Class Full'}
                                </Button>
                              ) : (
                                <Link to="/login">
                                  <Button variant="outline" fullWidth>Login To Reserve</Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={Boolean(selectedClass)}
        onClose={() => setSelectedClass(null)}
        title="Reserve Class Spot"
        description={selectedClass ? `Confirm your spot for ${selectedClass.gym_class.name}.` : ''}
        footer={
          <>
            <Button variant="outline" onClick={() => setSelectedClass(null)}>Cancel</Button>
            <Button variant="primary" onClick={handleBookClass} disabled={!bookingDate}>Confirm Spot</Button>
          </>
        }
      >
        {selectedClass && (
          <div>
            <div className="d-flex flex-column gap-3 mb-4 p-3 rounded-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="d-flex justify-content-between text-sm">
                <span className="text-secondary">Class Name:</span>
                <span className="text-white fw-bold">{selectedClass.gym_class.name}</span>
              </div>
              <div className="d-flex justify-content-between text-sm">
                <span className="text-secondary">Scheduled Time:</span>
                <span className="text-warning fw-bold">{selectedClass.day_name} {selectedClass.start_time}</span>
              </div>
              <div className="d-flex justify-content-between text-sm">
                <span className="text-secondary">Location:</span>
                <span className="text-white">Studio {selectedClass.room || '1'}</span>
              </div>
            </div>

            <div>
              <label htmlFor="booking-date" className="text-secondary text-sm font-medium mb-2 block">
                Select Reservation Date *
              </label>
              <input
                id="booking-date"
                type="date"
                className="w-full bg-dark-900 border border-white/10 text-white text-sm rounded-lg p-3 outline-none focus:border-orange-500"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default Classes;
