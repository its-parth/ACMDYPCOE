import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import EventPhotosModal from '../EventPhotosModal';

const Events = () => {
  const { upcomingEvents, pastEvents } = useApp();
  const [viewMode, setViewMode] = useState('upcoming');

  // modal state for members view
  const [photosModalOpen, setPhotosModalOpen] = useState(false);
  const [photosModalData, setPhotosModalData] = useState({ photos: [], title: '' });

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

                {/* REPLACED photos grid with button */}
                <div style={{marginTop: 12}}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      const photoList = event.photos || [];
                      setPhotosModalData({ photos: photoList, title: event.title });
                      setPhotosModalOpen(true);
                    }}
                    disabled={!(event.photos && event.photos.length > 0)}
                  >
                    See event photos {event.photos && event.photos.length ? `(${event.photos.length})` : ''}
                  </button>
                  {!event.photos || event.photos.length === 0 ? (
                    <div style={{marginTop: 8, color: 'var(--text-secondary)', fontSize: 13}}>
                      No photos for this event
                    </div>
                  ) : null}
                </div>

                {/* ...other event markup ... */}
              </div>
            </div>
          ))
        )}
      </div>

      <EventPhotosModal
        open={photosModalOpen}
        onClose={() => setPhotosModalOpen(false)}
        photos={photosModalData.photos}
        title={photosModalData.title}
      />
    </div>
  );
};

export default Events;
