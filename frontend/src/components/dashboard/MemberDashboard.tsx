import React from 'react';
import { Link } from 'react-router-dom';
import { User, Booking, Membership, WorkoutLog } from '../../types';
import { StatWidget } from './StatWidget';
import { ProgressChartWidget } from './ProgressChartWidget';
import { ActivityWidget } from './ActivityWidget';
import { NotificationsWidget } from './NotificationsWidget';
import { MessagesWidget } from './MessagesWidget';
import { AttendanceWidget } from './AttendanceWidget';
import { Button, Badge } from '../ui';
import { Flame, Clock, Dumbbell, Trophy, Calendar, Sparkles, UserCheck, Table, Calculator } from 'lucide-react';

export interface MemberDashboardProps {
  user: User | null;
  bookings: Booking[];
  membership: Membership | null;
  workoutLogs: WorkoutLog[];
  stats: {
    totalWorkouts: number;
    totalCalories: number;
    avgDuration: number;
    totalSets: number;
    totalReps: number;
  };
}

export const MemberDashboard: React.FC<MemberDashboardProps> = ({
  user,
  membership,
  workoutLogs,
  stats,
}) => {
  const chartData = [
    { label: 'Mon', value: 45, formattedValue: '45 mins' },
    { label: 'Tue', value: 60, formattedValue: '60 mins' },
    { label: 'Wed', value: 0, formattedValue: 'Rest Day' },
    { label: 'Thu', value: 50, formattedValue: '50 mins' },
    { label: 'Fri', value: 75, formattedValue: '75 mins' },
    { label: 'Sat', value: 90, formattedValue: '90 mins' },
    { label: 'Sun', value: 30, formattedValue: '30 mins' },
  ];

  const activityData = workoutLogs.slice(0, 4).map((log) => ({
    id: log.id,
    title: log.exercise_name,
    subtitle: `${log.sets || 4} sets × ${log.reps || 12} reps ${log.weight_kg ? `× ${log.weight_kg}kg` : ''}`,
    time: new Date(log.workout_date).toLocaleDateString(),
    type: 'workout' as const,
  }));

  const mockNotifications = [
    { id: 1, title: 'Class Reminder', message: 'Spinning Class starts today at 5:00 PM in Studio 2.', time: '10m ago' },
    { id: 2, title: 'Streak Unlocked!', message: 'Congratulations on completing your 14-day streak!', time: '2h ago' },
    { id: 3, title: 'Schedule Update', message: 'Coach Ahmed added a new HIIT session for Saturday.', time: '1d ago' },
  ];

  const mockMessages = [
    { id: 1, sender: 'Coach Ahmed', text: 'Hey! Great effort on your squat sets yesterday! Keep pushing!', time: '9:30 AM' },
    { id: 2, sender: 'You', text: 'Thanks Coach! Feeling strong today.', time: '9:35 AM' },
  ];

  return (
    <>
      {/* Member Banner */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-5">
        <div>
          <Badge variant="primary" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <Sparkles size={14} /> ATHLETE DASHBOARD
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase mb-2" style={{ fontFamily: 'Oswald' }}>
            Welcome back, {user?.display_name || 'Member'}! 💪
          </h1>
          <p className="text-secondary text-sm mb-0">Track your progress, workouts, and upcoming gym reservations.</p>
        </div>
        <div className="g-glass-card p-3 px-4 d-flex align-items-center gap-3">
          <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ background: 'rgba(243, 97, 0, 0.2)', color: '#f36100' }}>
            <Trophy size={24} />
          </div>
          <div>
            <h3 className="text-white fw-bold mb-0 g-gradient-text" style={{ fontFamily: 'Oswald' }}>{workoutLogs.length}</h3>
            <small className="text-secondary text-uppercase text-xs fw-medium">Total Workouts</small>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Total Calories"
            value={stats.totalCalories.toLocaleString()}
            unit="kcal"
            change="+12% this week"
            icon={<Flame size={22} />}
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Avg Duration"
            value={stats.avgDuration}
            unit="mins"
            change="+5 min increase"
            icon={<Clock size={22} />}
            iconBgColor="rgba(59, 130, 246, 0.15)"
            iconColor="#3b82f6"
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Total Sets"
            value={stats.totalSets}
            unit="sets"
            change="+8% volume"
            icon={<Dumbbell size={22} />}
            iconBgColor="rgba(16, 185, 129, 0.15)"
            iconColor="#10b981"
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Total Reps"
            value={stats.totalReps}
            unit="reps"
            change="+15% growth"
            icon={<Trophy size={22} />}
            iconBgColor="rgba(245, 158, 11, 0.15)"
            iconColor="#f59e0b"
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <ProgressChartWidget
                title="Weekly Workout Time"
                subtitle="Training minutes per day"
                data={chartData}
              />
            </div>
            <div className="col-md-6">
              <AttendanceWidget streakDays={14} totalCheckIns={48} />
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <ActivityWidget title="Recent Workouts" items={activityData} />
            </div>
            <div className="col-md-6">
              <NotificationsWidget notifications={mockNotifications} />
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-4">
          <div className="g-glass-card p-4 mb-4" style={{ borderLeft: '4px solid #f36100' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-white fw-bold mb-0" style={{ fontSize: '18px' }}>Active Plan</h4>
              {membership ? <Badge variant="success">Active</Badge> : <Badge variant="neutral">None</Badge>}
            </div>

            {membership ? (
              <>
                <div className="my-3">
                  <span className="badge bg-dark border border-secondary border-opacity-25 text-warning text-uppercase px-3 py-1 mb-2">
                    {membership.plan_name}
                  </span>
                  <h2 className="text-white fw-bold mb-0 g-gradient-text" style={{ fontFamily: 'Oswald' }}>
                    PKR {parseFloat(String(membership.monthly_fee)).toLocaleString()} <span className="text-secondary text-xs font-sans">/ mo</span>
                  </h2>
                </div>
                <Link to="/classes">
                  <Button variant="primary" fullWidth className="mt-3">Upgrade Membership</Button>
                </Link>
              </>
            ) : (
              <div className="py-2">
                <p className="text-secondary text-sm mb-3">No active membership attached.</p>
                <Link to="/#pricing">
                  <Button variant="primary" fullWidth>Choose Plan</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="g-glass-card p-4 mb-4">
            <h5 className="text-white fw-bold mb-3" style={{ fontSize: '18px' }}>Shortcuts</h5>
            <div className="d-flex flex-column gap-2">
              <Link to="/classes" className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none text-white hover-orange" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <Calendar size={18} className="text-warning" />
                <span className="text-sm font-medium">Reserve A Class</span>
              </Link>
              <Link to="/trainers" className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none text-white hover-orange" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <UserCheck size={18} className="text-info" />
                <span className="text-sm font-medium">Find Personal Coach</span>
              </Link>
              <Link to="/timetable" className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none text-white hover-orange" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <Table size={18} className="text-success" />
                <span className="text-sm font-medium">Class Timetable</span>
              </Link>
              <Link to="/bmi-calculator" className="d-flex align-items-center gap-3 p-3 rounded-3 text-decoration-none text-white hover-orange" style={{ background: 'rgba(255,255,255,0.03)' }}>
                <Calculator size={18} className="text-primary" />
                <span className="text-sm font-medium">BMI Fitness Calculator</span>
              </Link>
            </div>
          </div>

          <MessagesWidget messages={mockMessages} />
        </div>
      </div>
    </>
  );
};

export default MemberDashboard;
