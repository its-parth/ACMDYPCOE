import React from 'react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { currentUser, notifications, upcomingEvents } = useApp();

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome back, {currentUser?.name?.split(' ')[0]}! 👋</h1>
        <p className="page-description">Here's what's happening in the ACM club</p>
      </div>

      <div className="grid-2" style={{marginBottom: '32px'}}>
        <Link to="/member/profile" className="card action-card" style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>👤</div>
          <h3 style={{marginBottom: '8px', fontSize: '20px'}}>My Profile</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>
            View your membership details and ID card
          </p>
        </Link>

        <Link to="/member/events" className="card action-card" style={{textDecoration: 'none', color: 'inherit'}}>
          <div style={{fontSize: '48px', marginBottom: '16px'}}>📅</div>
          <h3 style={{marginBottom: '8px', fontSize: '20px'}}>Upcoming Events</h3>
          <p style={{color: 'var(--text-secondary)', fontSize: '14px'}}>
            {upcomingEvents.length} events scheduled
          </p>
        </Link>
      </div>

      <div className="section-header">
        <h2 className="section-title">Latest Notifications</h2>
        <Link to="/member/notifications" className="btn btn-secondary">View All</Link>
      </div>

      <div className="grid-2">
        {notifications.slice(0, 3).map(notification => (
          <div key={notification.id} className="card">
            {notification.image && (
              <img 
                src={notification.image} 
                alt={notification.title} 
                style={{width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px'}}
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
        ))}
      </div>

      <div className="section-header" style={{marginTop: '40px'}}>
        <h2 className="section-title">Upcoming Events</h2>
        <Link to="/member/events" className="btn btn-secondary">View All</Link>
      </div>

      <div className="grid-3">
        {upcomingEvents.slice(0, 3).map(event => (
          <div key={event.id} className="card">
            {event.poster && (
              <img 
                src={event.poster} 
                alt={event.title} 
                style={{width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px'}}
              />
            )}
            <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>{event.title}</h3>
            <div style={{display: 'flex', gap: '8px', marginBottom: '12px'}}>
              <span className="badge badge-primary">📅 {event.date}</span>
              {event.time && <span className="badge badge-success">🕐 {event.time}</span>}
            </div>
            <p style={{color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6'}}>
              {event.description.substring(0, 100)}...
            </p>
            {event.venue && (
              <div style={{marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px'}}>
                <span>📍</span>
                <span>{event.venue}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
