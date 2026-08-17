import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getWeekSchedule } from '../api/gym';
import { Badge, Skeleton } from '../components/ui';
import { Calendar, Clock, User, Sparkles } from 'lucide-react';
import type { ClassSchedule } from '../types';

type FilterType = 'all' | 'fitness' | 'motivation' | 'workout';

const ClassTimetable: React.FC = () => {
  const [schedules, setSchedules] = useState<Record<string, ClassSchedule[]>>({});
  const [filter, setFilter] = useState<FilterType>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await getWeekSchedule();
      setSchedules(data);
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const timeSlots = [
    { label: '6:00 AM – 8:00 AM', startHour: 6, endHour: 8 },
    { label: '10:00 AM – 12:00 PM', startHour: 10, endHour: 12 },
    { label: '3:00 PM – 5:00 PM', startHour: 15, endHour: 17 },
    { label: '5:00 PM – 7:00 PM', startHour: 17, endHour: 19 },
    { label: '7:00 PM – 9:00 PM', startHour: 19, endHour: 21 },
  ];

  const getScheduleForSlot = (day: string, startHour: number, endHour: number) => {
    const daySchedules = schedules[day] || [];
    return daySchedules.find((s) => {
      const h = parseInt(s.start_time.split(':')[0]);
      return h >= startHour && h < endHour;
    });
  };

  const getClassTypeCategory = (classType: string): FilterType => {
    const t = classType?.toLowerCase() || '';
    if (t.includes('strength') || t.includes('weight')) return 'workout';
    if (t.includes('cardio') || t.includes('spin')) return 'fitness';
    if (t.includes('yoga') || t.includes('pilates') || t.includes('stretch')) return 'motivation';
    return 'workout';
  };

  const filterConfig: { id: FilterType; label: string; color: string }[] = [
    { id: 'all', label: 'All Classes', color: '#f36100' },
    { id: 'workout', label: 'Strength', color: '#ef4444' },
    { id: 'fitness', label: 'Cardio', color: '#3b82f6' },
    { id: 'motivation', label: 'Mind & Body', color: '#22c55e' },
  ];

  const getCategoryColor = (cat: FilterType) => {
    return filterConfig.find((f) => f.id === cat)?.color || '#f36100';
  };

  // Check if any schedules exist
  const hasAnySchedule = Object.values(schedules).some((day) => day.length > 0);

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
            <Sparkles size={14} /> WEEKLY SCHEDULE
          </Badge>
          <h1
            className="display-4 text-white fw-bold text-uppercase"
            style={{ fontFamily: 'Oswald' }}
          >
            Class Timetable
          </h1>
          <p className="text-secondary text-sm max-w-xl mx-auto mb-3">
            Plan your week and never miss a session. Reserve your spot directly from the schedule.
          </p>
          <div className="d-flex justify-content-center align-items-center gap-2 text-secondary text-sm">
            <Link to="/" className="text-secondary text-decoration-none hover-orange">Home</Link>
            <span>/</span>
            <span className="text-white">Timetable</span>
          </div>
        </div>
      </section>

      {/* Timetable Section */}
      <section className="spad">
        <div className="container">
          {/* Filter Tabs */}
          <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
            {filterConfig.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="btn btn-sm px-4 py-2 rounded-pill fw-semibold"
                style={{
                  background: filter === f.id ? f.color : 'rgba(20,27,36,0.65)',
                  color: filter === f.id ? '#fff' : '#94a3b8',
                  border: `1px solid ${filter === f.id ? f.color : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.2s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="d-flex flex-column gap-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height="80px" rounded="12px" />
              ))}
            </div>
          ) : !hasAnySchedule ? (
            /* Empty state — show a static demo grid */
            <div className="text-center g-glass-card p-5">
              <Calendar size={48} className="mb-3" style={{ color: '#f36100', opacity: 0.6 }} />
              <h4 className="text-white fw-bold mb-2">Schedule Coming Soon</h4>
              <p className="text-secondary mb-4">
                The weekly schedule is being finalized. Check back soon or contact us for class times.
              </p>
              <Link to="/contact" className="btn px-5 rounded-pill text-white fw-bold" style={{ background: '#f36100' }}>
                Contact Us
              </Link>
            </div>
          ) : (
            /* Full Timetable Grid */
            <div className="timetable-wrapper" style={{ overflowX: 'auto' }}>
              <table className="w-100 timetable-table" style={{ borderCollapse: 'separate', borderSpacing: '6px' }}>
                <thead>
                  <tr>
                    <th
                      className="text-secondary text-xs fw-semibold text-uppercase"
                      style={{ width: '120px', padding: '10px 12px', textAlign: 'left' }}
                    >
                      Time
                    </th>
                    {daysOfWeek.map((day) => (
                      <th
                        key={day}
                        className="text-white fw-bold text-center"
                        style={{
                          padding: '10px 8px',
                          fontSize: '13px',
                          background: 'rgba(243,97,0,0.1)',
                          borderRadius: '8px',
                          border: '1px solid rgba(243,97,0,0.2)',
                          minWidth: '110px',
                        }}
                      >
                        {day.substring(0, 3).toUpperCase()}
                        <span className="d-none d-xl-inline">{day.substring(3)}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.label}>
                      {/* Time Cell */}
                      <td
                        className="text-secondary text-xs fw-medium"
                        style={{ padding: '6px 8px', whiteSpace: 'nowrap', verticalAlign: 'middle' }}
                      >
                        <div className="d-flex align-items-center gap-1">
                          <Clock size={12} style={{ color: '#f36100', flexShrink: 0 }} />
                          {slot.label}
                        </div>
                      </td>
                      {/* Day Cells */}
                      {daysOfWeek.map((day) => {
                        const schedule = getScheduleForSlot(day, slot.startHour, slot.endHour);
                        const showCell =
                          !schedule ||
                          filter === 'all' ||
                          getClassTypeCategory(schedule.gym_class.class_type) === filter;

                        const cat = schedule
                          ? getClassTypeCategory(schedule.gym_class.class_type)
                          : null;
                        const cellColor = cat ? getCategoryColor(cat) : null;

                        return (
                          <td key={day} style={{ padding: '4px', verticalAlign: 'top' }}>
                            {schedule && showCell ? (
                              <div
                                className="rounded-3 p-2 h-100"
                                style={{
                                  background: cellColor
                                    ? `${cellColor}18`
                                    : 'rgba(20,27,36,0.65)',
                                  border: `1px solid ${cellColor ? `${cellColor}40` : 'rgba(255,255,255,0.06)'}`,
                                  minHeight: '72px',
                                  transition: 'all 0.2s ease',
                                }}
                              >
                                <p
                                  className="fw-bold mb-1"
                                  style={{ color: cellColor || '#fff', fontSize: '12px', lineHeight: '1.3' }}
                                >
                                  {schedule.gym_class.name}
                                </p>
                                <div className="d-flex align-items-center gap-1 text-secondary" style={{ fontSize: '10px' }}>
                                  <User size={9} />
                                  <span>{schedule.gym_class.trainer?.user.display_name || 'Coach'}</span>
                                </div>
                                <div className="d-flex align-items-center gap-1 text-secondary mt-1" style={{ fontSize: '10px' }}>
                                  <Clock size={9} />
                                  <span>{schedule.start_time} – {schedule.end_time}</span>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="rounded-3"
                                style={{
                                  background: 'rgba(255,255,255,0.02)',
                                  border: '1px solid rgba(255,255,255,0.04)',
                                  minHeight: '72px',
                                }}
                              />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Legend */}
          {!loading && hasAnySchedule && (
            <div className="d-flex flex-wrap justify-content-center gap-3 mt-4 pt-4 border-top border-secondary border-opacity-10">
              {filterConfig.filter((f) => f.id !== 'all').map((f) => (
                <div key={f.id} className="d-flex align-items-center gap-2 text-secondary text-xs">
                  <span
                    className="rounded-circle d-inline-block"
                    style={{ width: '10px', height: '10px', background: f.color, flexShrink: 0 }}
                  />
                  {f.label}
                </div>
              ))}
            </div>
          )}

          {/* CTA */}
          <div className="text-center mt-5 pt-3">
            <p className="text-secondary mb-3 text-sm">
              Want to reserve a class spot?
            </p>
            <Link
              to="/classes"
              className="btn px-5 py-2 rounded-pill text-white fw-bold"
              style={{ background: '#f36100', border: 'none' }}
            >
              View & Book Classes →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default ClassTimetable;
