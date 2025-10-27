import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { notifications, currentMembers, upcomingEvents, pastEvents, currentMembersCnt } = useApp();

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="page-description">Welcome back! Here's an overview of your ACM club.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-value">{currentMembersCnt}</div>
          <div className="stat-label">Active Members</div>
        </div>

        <div className="stat-card success">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{upcomingEvents.length}</div>
          <div className="stat-label">Upcoming Events</div>
        </div>

        <div className="stat-card warning">
          <div className="stat-icon">🎉</div>
          <div className="stat-value">{pastEvents.length}</div>
          <div className="stat-label">Past Events</div>
        </div>

        <div className="stat-card danger">
          <div className="stat-icon">📢</div>
          <div className="stat-value">{notifications.length}</div>
          <div className="stat-label">Notifications</div>
        </div>
      </div>

      <div className="section-header">
        <h2 className="section-title">Quick Actions</h2>
      </div>

      <div className="grid-2">
        <Link to="/admin/notifications" className="card action-card" style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📢</div>
          <h3 style={{marginBottom: '8px', fontSize: '20px'}}>Send Notification</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>
            Create and send announcements to all members
          </p>
        </Link>

        <Link to="/admin/members" className="card action-card" style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>👤</div>
          <h3 style={{marginBottom: '8px', fontSize: '20px'}}>Manage Members</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>
            Add, edit, or remove club members
          </p>
        </Link>

        <Link to="/admin/events" className="card action-card" style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📅</div>
          <h3 style={{marginBottom: '8px', fontSize: '20px'}}>Manage Events</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>
            Create and organize club events
          </p>
        </Link>
      </div>

      <div className="section-header" style={{marginTop: '40px'}}>
        <h2 className="section-title">Recent Notifications</h2>
        <Link to="/admin/notifications" className="btn btn-secondary">View All</Link>
      </div>

      <div className="grid-2">
        {notifications.slice(0, 2).map(notification => (
          <div key={notification.id} className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600'}}>{notification.title}</h3>
              <span className="badge badge-primary">{notification.date}</span>
            </div>
            <p style={{color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6'}}>
              {notification.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
