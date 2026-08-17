import React, { useState } from 'react';
import { QrCode, CheckCircle2, Flame } from 'lucide-react';
import { Button, Badge } from '../ui';

export interface AttendanceWidgetProps {
  streakDays?: number;
  totalCheckIns?: number;
}

export const AttendanceWidget: React.FC<AttendanceWidgetProps> = ({
  streakDays = 3,
}) => {
  const [checkedInToday, setCheckedInToday] = useState(false);

  const handleCheckIn = () => {
    setCheckedInToday(true);
  };

  return (
    <div className="g-glass-card p-4 h-100 d-flex flex-column justify-content-between">
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="text-white fw-bold mb-0" style={{ fontSize: '18px' }}>
            Attendance &amp; Streak
          </h4>
          <Badge variant="warning" className="d-inline-flex align-items-center gap-1">
            <Flame size={14} className="text-warning" /> {streakDays} Day Streak
          </Badge>
        </div>

        <p className="text-secondary text-sm mb-4">
          Scan your digital membership QR code at the reception counter or check in online.
        </p>

        <div className="p-3 rounded-3 text-center mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px border-white/10' }}>
          <div className="d-flex justify-content-center text-warning mb-2">
            <QrCode size={64} />
          </div>
          <span className="font-monospace text-xs text-secondary">MEMBER ID: #GYM-2026-8812</span>
        </div>
      </div>

      <div>
        {checkedInToday ? (
          <div className="alert alert-success bg-success bg-opacity-20 text-success border border-success border-opacity-30 mb-0 rounded-3 p-3 text-center d-flex align-items-center justify-content-center gap-2">
            <CheckCircle2 size={18} />
            <span className="fw-bold text-sm">Checked In Today! Keep crushing it! 🔥</span>
          </div>
        ) : (
          <Button variant="primary" fullWidth onClick={handleCheckIn}>
            Instant QR Check-In
          </Button>
        )}
      </div>
    </div>
  );
};

export default AttendanceWidget;
