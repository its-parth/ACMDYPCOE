import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Events = () => {
  const { upcomingEvents, pastEvents } = useApp();
  const [viewMode, setViewMode] = useState('upcoming');

  const displayEvents = viewMode === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Events</h1>
        <p className="page-description">ACM club events and activities</p>
      </div>

      <div className="members-tabs">
        <button 
          className={`tab-btn ${viewMode === 'upcoming' ? 'active' : ''}`}
          onClick={() => setViewMode('upcoming')}
        >
          📅 Upcoming Events ({upcomingEvents.length})
        </button>
        <button 
          className={`tab-btn ${viewMode === 'past' ? 'active' : ''}`}
          onClick={() => setViewMode('past')}
        >
          🎉 Past Events ({pastEvents.length})
        </button>
      </div>

      <div className="events-grid">
        {displayEvents.length === 0 ? (
          <div className="empty-state card">
            <div style={{fontSize: '64px', marginBottom: '16px'}}>📅</div>
            <h3>No events found</h3>
            <p>{viewMode === 'upcoming' ? 'No upcoming events scheduled' : 'No past events yet'}</p>
          </div>
        ) : (
          displayEvents.map(event => (
            <div key={event.id} className="card event-card">
              {event.poster && (
                <img src={event.poster} alt={event.title} className="event-poster" />
              )}
              <div className="event-content">
                <div className="event-header">
                  <h3 className="event-title">{event.title}</h3>
                  <div className="event-meta">
                    <span className="badge badge-primary">📅 {event.date}</span>
                    {event.time && <span className="badge badge-success">🕐 {event.time}</span>}
                  </div>
                </div>
                
                <p className="event-description">{event.description}</p>
                
                {event.venue && (
                  <div className="event-venue">
                    <span className="venue-icon">📍</span>
                    <span>{event.venue}</span>
                  </div>
                )}

                {event.photos && event.photos.length > 0 && (
                  <div className="event-photos">
                    <h4>Photos ({event.photos.length})</h4>
                    <div className="photos-grid">
                      {event.photos.map((photo, index) => (
                        <img 
                          key={index} 
                          src={photo} 
                          alt={`Event ${index + 1}`} 
                          className="event-photo-thumb" 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
