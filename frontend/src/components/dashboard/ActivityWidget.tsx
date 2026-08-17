import React from 'react';
import { Activity, Dumbbell, UserCheck, CreditCard, Award } from 'lucide-react';

export interface ActivityItem {
  id: string | number;
  title: string;
  subtitle: string;
  time: string;
  type?: 'workout' | 'booking' | 'payment' | 'achievement';
}

export interface ActivityWidgetProps {
  title?: string;
  items: ActivityItem[];
}

export const ActivityWidget: React.FC<ActivityWidgetProps> = ({
  title = 'Recent Activity',
  items,
}) => {
  const getIcon = (type?: ActivityItem['type']) => {
    switch (type) {
      case 'workout':
        return <Dumbbell size={18} className="text-warning" />;
      case 'booking':
        return <UserCheck size={18} className="text-info" />;
      case 'payment':
        return <CreditCard size={18} className="text-success" />;
      case 'achievement':
        return <Award size={18} className="text-primary" />;
      default:
        return <Activity size={18} className="text-warning" />;
    }
  };

  return (
    <div className="g-glass-card p-4 h-100">
      <h4 className="text-white fw-bold mb-4" style={{ fontSize: '18px' }}>
        {title}
      </h4>
      {items.length === 0 ? (
        <p className="text-secondary text-sm mb-0">No recent activity logged.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-3 d-flex align-items-center justify-content-between"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle p-2 d-flex align-items-center justify-content-center"
                  style={{ background: 'rgba(243, 97, 0, 0.12)' }}
                >
                  {getIcon(item.type)}
                </div>
                <div>
                  <h6 className="text-white fw-bold mb-0 text-sm">{item.title}</h6>
                  <small className="text-secondary text-xs">{item.subtitle}</small>
                </div>
              </div>
              <span className="text-secondary text-xs">{item.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityWidget;
