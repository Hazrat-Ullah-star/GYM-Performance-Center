import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2 } from 'lucide-react';
import { communityApi } from '../../api/community';
import { Notification } from '../../types';

export const NotificationsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await communityApi.getUnreadCount();
        setUnreadCount(count);
      } catch {/* silent */}
    };
    fetchUnreadCount();
    
    // Poll every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const data = await communityApi.getNotifications({ page: 1 });
      setNotifications(data.results.slice(0, 10));
    } catch {/* silent */} finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen) {
      loadNotifications();
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await communityApi.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {/* silent */}
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.is_read) {
      try {
        await communityApi.markNotificationRead(notification.id);
        setNotifications(prev => prev.map(n => 
          n.id === notification.id ? { ...n, is_read: true } : n
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
      } catch {/* silent */}
    }
    setIsOpen(false);
    
    if (notification.related_post) {
      navigate('/community');
      // In a real app we might navigate to `/community/post/${notification.related_post}`
    } else if (notification.type === 'follow') {
      navigate('/community');
    }
  };

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}d`;
  };

  return (
    <div className="position-relative" ref={dropdownRef}>
      <button 
        onClick={toggleDropdown}
        className="btn p-2 text-white position-relative hover-orange transition"
        style={{ background: 'transparent', border: 'none' }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span 
            className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
            style={{ fontSize: 9, padding: '3px 6px' }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="position-absolute end-0 mt-2 rounded-3 shadow-lg overflow-hidden g-glass-card"
          style={{ width: 340, zIndex: 1000, border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="d-flex justify-content-between align-items-center p-3 border-bottom border-white/10" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <h6 className="mb-0 text-white fw-bold">Notifications</h6>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="btn btn-link p-0 text-secondary hover-orange text-xs text-decoration-none d-flex align-items-center gap-1"
              >
                <CheckCircle2 size={14} /> Mark all read
              </button>
            )}
          </div>

          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {loading ? (
              <div className="p-4 text-center text-secondary text-sm">
                <div className="spinner-border spinner-border-sm text-warning mb-2" />
                <div>Loading...</div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-4 text-center text-secondary text-sm">
                No notifications yet.
              </div>
            ) : (
              <div className="list-group list-group-flush bg-transparent">
                {notifications.map(notif => (
                  <button
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`list-group-item list-group-item-action border-bottom border-white/5 p-3 text-start transition-all ${notif.is_read ? 'bg-transparent' : ''}`}
                    style={{ 
                      background: notif.is_read ? 'transparent' : 'rgba(243,97,0,0.08)',
                    }}
                  >
                    <div className="d-flex gap-3 align-items-start">
                      <div className="flex-shrink-0 mt-1">
                        {notif.related_user?.avatar ? (
                          <img src={notif.related_user.avatar} className="rounded-circle" style={{ width: 32, height: 32, objectFit: 'cover' }} alt="" />
                        ) : (
                          <div className="rounded-circle d-flex align-items-center justify-content-center text-white" 
                               style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#f36100,#ff7a1a)', fontSize: 13, fontWeight: 'bold' }}>
                            {notif.related_user?.display_name?.charAt(0) || <Bell size={14} />}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow-1 min-width-0">
                        <p className="mb-1 text-white text-sm" style={{ lineHeight: 1.4, opacity: notif.is_read ? 0.8 : 1 }}>
                          {notif.message}
                        </p>
                        <span className="text-secondary text-xs">{timeAgo(notif.created_at)}</span>
                      </div>
                      {!notif.is_read && (
                        <div className="flex-shrink-0 mt-2">
                          <div className="rounded-circle bg-warning" style={{ width: 8, height: 8 }}></div>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Link 
            to="/community" 
            onClick={() => setIsOpen(false)}
            className="d-block w-100 p-2 text-center text-sm text-secondary hover-orange text-decoration-none border-top border-white/10"
            style={{ background: 'rgba(0,0,0,0.1)' }}
          >
            View Community
          </Link>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
