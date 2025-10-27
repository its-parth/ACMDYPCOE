import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Calendar.css';

const Calendar = () => {
  const { upcomingEvents } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = () => {
    setCurrentDate(new Date());
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return upcomingEvents.filter(event => event.date === dateStr);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const events = getEventsForDate(day);
      const hasEvents = events.length > 0;
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday(day) ? 'today' : ''} ${hasEvents ? 'has-events' : ''}`}
        >
          <div className="day-number">{day}</div>
          {hasEvents && (
            <div className="day-events">
              {events.map(event => (
                <div key={event.id} className="event-dot" title={event.title}>
                  <span className="event-name">{event.title}</span>
                  {event.time && <span className="event-time">🕐 {event.time}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Calendar View</h1>
          <p className="page-description">Monthly calendar of upcoming events</p>
        </div>
        <button onClick={today} className="btn btn-secondary">
          📅 Today
        </button>
      </div>

      <div className="calendar-container card">
        <div className="calendar-header">
          <button onClick={previousMonth} className="btn btn-secondary calendar-nav-btn">
            ← Previous
          </button>
          <h2 className="calendar-month">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={nextMonth} className="btn btn-secondary calendar-nav-btn">
            Next →
          </button>
        </div>

        <div className="calendar-weekdays">
          {daysOfWeek.map(day => (
            <div key={day} className="weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="calendar-grid">
          {renderCalendar()}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <div className="legend-dot today-dot"></div>
            <span>Today</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot event-dot-sample"></div>
            <span>Event Day</span>
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="section-header" style={{marginTop: '40px'}}>
        <h2 className="section-title">Upcoming Events in {monthNames[currentDate.getMonth()]}</h2>
      </div>

      <div className="grid-3">
        {upcomingEvents
          .filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === currentDate.getMonth() && 
                   eventDate.getFullYear() === currentDate.getFullYear();
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .map(event => (
            <div key={event.id} className="card">
              {event.poster && (
                <img 
                  src={event.poster} 
                  alt={event.title}
                  style={{width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px'}}
                />
              )}
              <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '8px'}}>{event.title}</h3>
              <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px'}}>
                <span className="badge badge-primary">📅 {event.date}</span>
                {event.time && <span className="badge badge-success">🕐 {event.time}</span>}
              </div>
              <p style={{fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6'}}>
                {event.description.substring(0, 100)}...
              </p>
              {event.venue && (
                <div style={{marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-secondary)'}}>
                  <span>📍</span>
                  <span>{event.venue}</span>
                </div>
              )}
            </div>
          ))
        }
        {upcomingEvents.filter(event => {
            const eventDate = new Date(event.date);
            return eventDate.getMonth() === currentDate.getMonth() && 
                   eventDate.getFullYear() === currentDate.getFullYear();
          }).length === 0 && (
          <div className="empty-state card">
            <div style={{fontSize: '48px', marginBottom: '12px'}}>📅</div>
            <p>No events scheduled for this month</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Calendar;
