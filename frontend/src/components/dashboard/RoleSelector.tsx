import React from 'react';
import { UserCheck, Shield, User } from 'lucide-react';

export type DashboardRole = 'member' | 'trainer' | 'admin';

export interface RoleSelectorProps {
  currentRole: DashboardRole;
  onRoleChange: (role: DashboardRole) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  currentRole,
  onRoleChange,
}) => {
  const roles: { role: DashboardRole; label: string; icon: React.ReactNode }[] = [
    { role: 'member', label: 'Member View', icon: <User size={16} /> },
    { role: 'trainer', label: 'Trainer View', icon: <UserCheck size={16} /> },
    { role: 'admin', label: 'Admin View', icon: <Shield size={16} /> },
  ];

  return (
    <div className="d-inline-flex align-items-center gap-1 p-1 rounded-pill" style={{ background: '#141b24', border: '1px solid rgba(255,255,255,0.08)' }}>
      {roles.map((item) => (
        <button
          key={item.role}
          onClick={() => onRoleChange(item.role)}
          className={`btn btn-sm rounded-pill px-3 py-1.5 text-xs font-semibold d-inline-flex align-items-center gap-1.5 transition-all ${
            currentRole === item.role
              ? 'btn-danger text-white shadow'
              : 'text-secondary hover-orange'
          }`}
          style={{
            background: currentRole === item.role ? '#f36100' : 'transparent',
            border: 'none',
          }}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default RoleSelector;
