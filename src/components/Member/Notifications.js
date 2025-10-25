import React from 'react';
import { useApp } from '../../context/AppContext';

const Notifications = () => {
  const { notifications } = useApp();

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Notifications</h1>
        <p className="page-description">Latest announcements from ACM club</p>
      </div>

      <div className="grid-2">
        {notifications.length === 0 ? (
          <div className="empty-state card">
            <div style={{fontSize: '64px', marginBottom: '16px'}}>📢</div>
            <h3>No notifications yet</h3>
            <p>Check back later for updates and announcements</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div key={notification.id} className="card">
              {notification.image && (
                <img 
                  src={notification.image} 
                  alt={notification.title} 
                  style={{
                    width: '100%', 
                    height: '200px', 
                    objectFit: 'cover', 
                    borderRadius: '8px', 
                    marginBottom: '16px'
                  }}
                />
              )}
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600'}}>{notification.title}</h3>
                <span className="badge badge-primary">{notification.date}</span>
              </div>
              <p style={{color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6'}}>
                {notification.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
