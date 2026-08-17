import React, { useState } from 'react';
import { User } from '../../types';
import { StatWidget } from './StatWidget';
import { ProgressChartWidget } from './ProgressChartWidget';
import { ActivityWidget } from './ActivityWidget';
import { NotificationsWidget } from './NotificationsWidget';
import { Button, Badge, Alert, Table, TableHeader, TableBody, TableRow, TableHead, TableCell, Input } from '../ui';
import { Shield, Users, DollarSign, Activity, Sparkles, UserPlus, Megaphone } from 'lucide-react';

export interface AdminDashboardProps {
  user: User | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const revenueChartData = [
    { label: 'Jan', value: 850, formattedValue: 'PKR 850,000' },
    { label: 'Feb', value: 920, formattedValue: 'PKR 920,000' },
    { label: 'Mar', value: 1100, formattedValue: 'PKR 1,100,000' },
    { label: 'Apr', value: 1250, formattedValue: 'PKR 1,250,000' },
    { label: 'May', value: 1400, formattedValue: 'PKR 1,400,000' },
    { label: 'Jun', value: 1650, formattedValue: 'PKR 1,650,000' },
  ];

  const adminActivities = [
    { id: 1, title: 'New Member Registered', subtitle: 'Usman Ali signed up for Unlimited Pro', time: '5m ago', type: 'payment' as const },
    { id: 2, title: 'Trainer Assigned', subtitle: 'Coach Haseeb assigned to Strength & Conditioning', time: '1h ago', type: 'booking' as const },
    { id: 3, title: 'System Backup Complete', subtitle: 'Database backup stored securely', time: '4h ago', type: 'achievement' as const },
  ];

  const adminNotifications = [
    { id: 1, title: 'Equipment Maintenance', message: 'Sauna heater servicing scheduled for Sunday 10:00 AM.', time: '2h ago' },
    { id: 2, title: 'High Capacity Alert', message: 'Spinning Class reached 100% capacity.', time: '5h ago' },
  ];

  const recentMembers = [
    { id: 1, name: 'Usman Ali', email: 'usman@gmail.com', plan: 'Unlimited Pro', status: 'Active', joined: 'Today' },
    { id: 2, name: 'Fatima Noor', email: 'fatima@gmail.com', plan: 'Elite VIP', status: 'Active', joined: 'Yesterday' },
    { id: 3, name: 'Zaid Khan', email: 'zaid@gmail.com', plan: 'Class Drop-In', status: 'Pending', joined: '2 days ago' },
  ];

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMessage.trim()) return;
    setBroadcastSent(true);
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSent(false), 4000);
  };

  return (
    <>
      {/* Admin Banner */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-4 mb-5">
        <div>
          <Badge variant="danger" className="mb-3 px-3 py-2 inline-flex items-center gap-2">
            <Sparkles size={14} /> SYSTEM ADMIN CONTROL
          </Badge>
          <h1 className="display-4 text-white fw-bold text-uppercase mb-2" style={{ fontFamily: 'Oswald' }}>
            Admin Command Center — {user?.display_name || 'Administrator'} 🛡️
          </h1>
          <p className="text-secondary text-sm mb-0">System health, revenue metrics, member management, and broadcast alerts.</p>
        </div>
        <div className="d-flex gap-3">
          <Button variant="primary" leftIcon={<UserPlus size={16} />}>
            Add New Staff
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="row g-4 mb-5">
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Total Revenue"
            value="PKR 1.65M"
            change="+22% vs last month"
            icon={<DollarSign size={22} />}
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Total Members"
            value="1,540"
            unit="members"
            change="+84 new this month"
            icon={<Users size={22} />}
            iconBgColor="rgba(59, 130, 246, 0.15)"
            iconColor="#3b82f6"
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="Capacity Rate"
            value="88%"
            change="High Facility Demand"
            icon={<Activity size={22} />}
            iconBgColor="rgba(16, 185, 129, 0.15)"
            iconColor="#10b981"
          />
        </div>
        <div className="col-lg-3 col-sm-6">
          <StatWidget
            title="System Status"
            value="Optimal"
            change="100% API Uptime"
            icon={<Shield size={22} />}
            iconBgColor="rgba(245, 158, 11, 0.15)"
            iconColor="#f59e0b"
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="row g-4 mb-5">
        <div className="col-lg-8">
          {/* Revenue Chart */}
          <div className="mb-4">
            <ProgressChartWidget
              title="Monthly Revenue Growth (PKR)"
              subtitle="2026 Financial Overview"
              data={revenueChartData}
            />
          </div>

          {/* Members Roster Table */}
          <div className="g-glass-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="text-white fw-bold mb-0" style={{ fontSize: '20px' }}>Recent Member Registrations</h4>
              <Badge variant="neutral">3 New Today</Badge>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMembers.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="fw-bold">{m.name}</TableCell>
                    <TableCell className="text-secondary">{m.email}</TableCell>
                    <TableCell><Badge variant="primary">{m.plan}</Badge></TableCell>
                    <TableCell>{m.joined}</TableCell>
                    <TableCell>
                      {m.status === 'Active' ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Pending</Badge>}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="col-lg-4">
          {/* System Broadcast */}
          <div className="g-glass-card p-4 mb-4 border-orange">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Megaphone size={20} className="text-warning" />
              <h4 className="text-white fw-bold mb-0" style={{ fontSize: '18px' }}>Send System Broadcast</h4>
            </div>
            <p className="text-secondary text-xs mb-3">Push an announcement banner to all member dashboards.</p>

            {broadcastSent && (
              <Alert variant="success" className="mb-3">
                Broadcast notification sent to all active members!
              </Alert>
            )}

            <form onSubmit={handleSendBroadcast} className="d-flex flex-column gap-2">
              <Input
                placeholder="Enter announcement text..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
              />
              <Button type="submit" variant="primary" fullWidth size="sm">
                Send Notification
              </Button>
            </form>
          </div>

          <div className="mb-4">
            <ActivityWidget title="System Audit Logs" items={adminActivities} />
          </div>

          <NotificationsWidget notifications={adminNotifications} />
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
