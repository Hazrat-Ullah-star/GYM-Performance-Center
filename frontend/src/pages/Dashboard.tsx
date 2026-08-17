import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { gymApi } from '../api/gym';
import { Booking, Membership, WorkoutLog } from '../types';
import { RoleSelector, DashboardRole } from '../components/dashboard/RoleSelector';
import { MemberDashboard } from '../components/dashboard/MemberDashboard';
import { TrainerDashboard } from '../components/dashboard/TrainerDashboard';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { Skeleton } from '../components/ui';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeRole, setActiveRole] = useState<DashboardRole>('member');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [membership, setMembership] = useState<Membership | null>(null);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalCalories: 0,
    avgDuration: 0,
    totalSets: 0,
    totalReps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Determine default role based on user props
    if (user?.is_staff) {
      setActiveRole('admin');
    } else if (user?.is_trainer || user?.role === 'trainer') {
      setActiveRole('trainer');
    } else if (user?.role === 'admin') {
      setActiveRole('admin');
    } else {
      setActiveRole('member');
    }

    const fetchDashboardData = async () => {
      try {
        const [bookingsData, membershipData, logsData, statsData] = await Promise.all([
          gymApi.getBookings(),
          gymApi.getMyMembership(),
          gymApi.getWorkoutLogs(),
          gymApi.getWorkoutStats(),
        ]);

        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
        setMembership(membershipData);
        setWorkoutLogs(Array.isArray(logsData) ? logsData : []);
        setStats({
          totalWorkouts: statsData.total_workouts || 0,
          totalCalories: statsData.total_calories || 0,
          avgDuration: statsData.avg_duration || 0,
          totalSets: statsData.total_sets || 0,
          totalReps: statsData.total_reps || 0,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="row g-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-lg-3 col-sm-6">
              <Skeleton height="120px" rounded="16px" />
            </div>
          ))}
          <div className="col-lg-8">
            <Skeleton height="350px" rounded="16px" />
          </div>
          <div className="col-lg-4">
            <Skeleton height="350px" rounded="16px" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="spad pt-4">
      <div className="container">
        {/* Role Switcher Toolbar */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom border-white/10 flex-wrap gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="text-secondary text-xs font-semibold uppercase tracking-wider">Dashboard Mode:</span>
            <RoleSelector currentRole={activeRole} onRoleChange={setActiveRole} />
          </div>
          <span className="badge bg-dark border border-white/10 text-secondary font-monospace text-xs">
            Role: {activeRole.toUpperCase()}
          </span>
        </div>

        {/* Dynamic Dashboard Role View */}
        {activeRole === 'admin' ? (
          <AdminDashboard user={user} />
        ) : activeRole === 'trainer' ? (
          <TrainerDashboard user={user} />
        ) : (
          <MemberDashboard
            user={user}
            bookings={bookings}
            membership={membership}
            workoutLogs={workoutLogs}
            stats={stats}
          />
        )}
      </div>
    </section>
  );
};

export default Dashboard;
