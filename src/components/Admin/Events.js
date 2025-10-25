import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Events.css';

const Events = () => {
  const { upcomingEvents, pastEvents, addEvent, updateEvent, deleteEvent } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [viewMode, setViewMode] = useState('upcoming');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    poster: '',
    photos: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const eventData = {
      ...formData,
      photos: formData.photos ? formData.photos.split(',').map(url => url.trim()) : []
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }

    resetForm();
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time || '',
      venue: event.venue || '',
      poster: event.poster || '',
      photos: event.photos ? event.photos.join(', ') : ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      poster: '',
      photos: ''
    });
    setEditingEvent(null);
    setIsFormOpen(false);
  };

  const displayEvents = viewMode === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Events</h1>
          <p className="page-description">Manage club events and activities</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="btn btn-primary"
        >
          ➕ Create Event
        </button>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingEvent ? 'Edit Event' : 'Create Event'}</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="notification-form">
              <div className="input-group">
                <label htmlFor="title">Event Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter event title"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter event description"
                  required
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label htmlFor="date">Date *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="time">Time</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="venue">Venue</label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="Event venue/location"
                />
              </div>

              <div className="input-group">
                <label htmlFor="poster">Poster URL</label>
                <input
                  type="url"
                  id="poster"
                  name="poster"
                  value={formData.poster}
                  onChange={handleInputChange}
                  placeholder="https://example.com/poster.jpg"
                />
              </div>

              <div className="input-group">
                <label htmlFor="photos">Photo URLs (comma-separated)</label>
                <textarea
                  id="photos"
                  name="photos"
                  value={formData.photos}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                  rows="3"
                />
                <small style={{color: 'var(--text-light)', fontSize: '12px', marginTop: '4px', display: 'block'}}>
                  Separate multiple photo URLs with commas
                </small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingEvent ? 'Update' : 'Create'} Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
            <p>{viewMode === 'upcoming' ? 'Create your first upcoming event' : 'No past events yet'}</p>
            <button onClick={() => setIsFormOpen(true)} className="btn btn-primary" style={{marginTop: '20px'}}>
              Create Event
            </button>
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
                        <img key={index} src={photo} alt={`Event ${index + 1}`} className="event-photo-thumb" />
                      ))}
                    </div>
                  </div>
                )}

                <div className="event-actions">
                  <button 
                    onClick={() => handleEdit(event)} 
                    className="btn btn-secondary"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(event.id)} 
                    className="btn btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
