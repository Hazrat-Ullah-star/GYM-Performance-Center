import React from 'react';
import { User } from '../../types';
import { StatWidget } from './StatWidget';
import { ProgressChartWidget } from './ProgressChartWidget';
import { MessagesWidget } from './MessagesWidget';
import { NotificationsWidget } from './NotificationsWidget';
import { Button, Badge, Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui';
import { Users, Calendar, Award, DollarSign, Sparkles, CheckCircle2 } from 'lucide-react';

export interface TrainerDashboardProps {
  user: User | null;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({ user }) => {
  const chartData = [
    { label: 'Olympic Weightlifting', value: 24, formattedValue: '24 Athletes' },
    { label: 'HIIT Conditioning', value: 18, formattedValue: '18 Athletes' },
    { label: 'Personal 1-on-1', value: 12, formattedValue: '12 Clients' },
    { label: 'Spin & Cardio', value: 15, formattedValue: '15 Athletes' },
  ];

  const assignedClasses = [
    { id: 1, name: 'Olympic Weightlifting', time: 'Today 06:00 AM - 07:00 AM', room: 'Studio 1', booked: 22, capacity: 25 },
    { id: 2, name: 'HIIT Conditioning', time: 'Today 05:00 PM - 06:00 PM', room: 'Studio 2', booked: 18, capacity: 20 },
    { id: 3, name: 'Boxing Power Session', time: 'Tomorrow 07:00 AM - 08:00 AM', room: 'Boxing Ring', booked: 15, capacity: 15 },
  ];

  const clients = [
    { id: 1, name: 'Hamza Malik', plan: 'Elite VIP', sessionsLeft: 8, status: 'Active' },
    { id: 2, name: 'Sana Mahmood', plan: 'Unlimited Pro', sessionsLeft: 4, status: 'Active' },
    { id: 3, name: 'Ayesha Ahmed', plan: 'Standard', sessionsLeft: 2, status: 'Pending Renewal' },
  ];

  const trainerMessages = [
    { id: 1, sender: 'Hamza Malik', text: 'Hey Coach! Ready for our 6 PM session today.', time: '11:20 AM' },
    { id: 2, sender: 'You', text: 'See you at Studio 2! We are doing heavy deadlifts today.', time: '11:25 AM' },
  ];

  const trainerNotifications = [
    { id: 1, title: 'New Client Assigned', message: 'Hamza Malik booked 4 private 1-on-1 sessions with you.', time: '15m ago' },
    { id: 2, title: 'Session Completed', message: 'HIIT Conditioning 05:00 PM attendance logged.', time: '1d ago' },
  ];

  return (
    <>
      {/* Trainer Banner */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-5">
        <div>
          <Badge variant="warning" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <Sparkles size={14} /> COACH PORTAL
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase mb-2" style={{ fontFamily: 'Oswald' }}>
            Coach Dashboard — {user?.display_name || 'Trainer'} 🏋️
          </h1>
          <p className="text-secondary text-sm mb-0">Manage your assigned classes, client rosters, and session check-ins.</p>
        </div>
        <div className="d-flex gap-3">
          <Button variant="primary">Create Class Session</Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Total Active Clients"
            value="34"
            unit="athletes"
            change="+4 new this month"
            icon={<Users size={22} />}
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Weekly Classes"
            value="14"
            unit="sessions"
            change="100% completed"
            icon={<Calendar size={22} />}
            iconBgColor="rgba(59, 130, 246, 0.15)"
            iconColor="#3b82f6"
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Coach Rating"
            value="4.9"
            unit="/ 5.0"
            change="Top Rated Coach"
            icon={<Award size={22} />}
            iconBgColor="rgba(245, 158, 11, 0.15)"
            iconColor="#f59e0b"
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Monthly Earnings"
            value="PKR 145K"
            change="+18% vs last month"
            icon={<DollarSign size={22} />}
            iconBgColor="rgba(16, 185, 129, 0.15)"
            iconColor="#10b981"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          {/* Assigned Classes */}
          <div className="g-glass-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-white fw-bold mb-0" style={{ fontSize: '20px' }}>Your Upcoming Assigned Classes</h4>
              <Badge variant="primary">Today: 2 Sessions</Badge>
            </div>

            <div className="d-flex flex-column gap-3">
              {assignedClasses.map((cls) => (
                <div key={cls.id} className="p-3 rounded-3 d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <h6 className="text-white fw-bold mb-1">{cls.name}</h6>
                    <small className="text-warning font-monospace me-3">{cls.time}</small>
                    <small className="text-secondary">Location: {cls.room}</small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <span className="text-secondary text-xs">
                      Booked: <strong className="text-white">{cls.booked} / {cls.capacity}</strong>
                    </span>
                    <Button variant="outline" size="sm" leftIcon={<CheckCircle2 size={14} />}>
                      Attendance Check-In
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Roster */}
          <div className="g-glass-card p-4 mb-4">
            <h4 className="text-white fw-bold mb-4" style={{ fontSize: '20px' }}>Assigned Private Clients</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Sessions Left</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="fw-bold">{c.name}</TableCell>
                    <TableCell><Badge variant="primary">{c.plan}</Badge></TableCell>
                    <TableCell>{c.sessionsLeft} Remaining</TableCell>
                    <TableCell>
                      {c.status === 'Active' ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Pending</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-4">
          <div className="mb-4">
            <ProgressChartWidget
              title="Class Utilization"
              subtitle="Current athlete enrollment"
              data={chartData}
            />
          </div>

          <div className="mb-4">
            <NotificationsWidget notifications={trainerNotifications} />
          </div>

          <MessagesWidget messages={trainerMessages} />
        </div>
      </div>
    </>
  );
};

export default TrainerDashboard;
