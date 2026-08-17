import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { Badge } from '../ui';

export interface NotificationItem {
  id: string | number;
  title: string;
  message: string;
  time: string;
  read?: boolean;
}

export interface NotificationsWidgetProps {
  notifications: NotificationItem[];
}

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({
  notifications: initialList,
}) => {
  const [list, setList] = useState(initialList);

  const markAllRead = () => {
    setList(list.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = list.filter((n) => !n.read).length;

  return (
    <div className="g-glass-card p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex align-items-center gap-2">
          <h4 className="text-white fw-bold mb-0" style={{ fontSize: '18px' }}>
            Notifications
          </h4>
          {unreadCount > 0 && <Badge variant="warning">{unreadCount} New</Badge>}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="btn btn-link text-warning text-xs p-0 text-decoration-none hover-orange"
          >
            Mark all read
          </button>
        )}
      </div>

      <div className="d-flex flex-column gap-3">
        {list.map((n) => (
          <div
            key={n.id}
            className={`p-3 rounded-3 border transition-all ${
              n.read ? 'bg-transparent border-white/5 opacity-70' : 'bg-white/[0.03] border-orange-500/30'
            }`}
          >
            <div className="d-flex align-items-start gap-2 mb-1">
              <Info size={16} className={n.read ? 'text-secondary mt-0.5' : 'text-warning mt-0.5'} />
              <div className="flex-1">
                <h6 className="text-white fw-bold mb-0 text-sm">{n.title}</h6>
                <p className="text-secondary text-xs mb-0 leading-relaxed">{n.message}</p>
              </div>
            </div>
            <div className="text-end mt-1">
              <span className="text-secondary text-xs">{n.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsWidget;
