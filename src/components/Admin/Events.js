import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Events.css';
import EventPhotosModal from '../EventPhotosModal';

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
    poster: '',      // poster URL (set after upload)
    photos: []       // photos URLs array (set after uploads)
  });

  const [uploadingPoster, setUploadingPoster] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]); // local previews for UI

  // NEW: modal state for viewing photos
  const [photosModalOpen, setPhotosModalOpen] = useState(false);
  const [photosModalData, setPhotosModalData] = useState({ photos: [], title: '' });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // upload helper - posts file to backend which uses Cloudinary
  const uploadFile = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append('image', file);
    const res = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: fd
      // include auth headers here if your upload route requires auth
    });
    console.log("trying to upload poster: ", res);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Upload failed');
    }
    const data = await res.json();
    
    return data.url || data.secure_url || null;
  };

  const handlePosterFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingPoster(true);
      const url = await uploadFile(file);
      console.log(url);
      if (url) {
        setFormData(prev => ({ ...prev, poster: url }));
      }
    } catch (err) {
      console.error('Poster upload failed', err);
      alert('Poster upload failed: ' + (err.message || ''));
    } finally {
      setUploadingPoster(false);
    }
  };

  const handlePhotosFilesChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setUploadingPhotos(true);
      const previews = files.map(f => URL.createObjectURL(f));
      setPhotoPreviews(previews);

      // upload each file and collect URLs
      const uploadPromises = files.map(f => uploadFile(f).catch(err => {
        console.error('Photo upload error for', f.name, err);
        return null;
      }));
      const urls = (await Promise.all(uploadPromises)).filter(Boolean);
      setFormData(prev => ({ ...prev, photos: [...(prev.photos || []), ...urls] }));
    } catch (err) {
      console.error('Photos upload error', err);
      alert('One or more photo uploads failed');
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      venue: formData.venue,
      poster: formData.poster || '',          // already a URL from uploadFile
      photos: Array.isArray(formData.photos) ? formData.photos : [], // URLs array
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
      photos: event.photos || []
    });
    setPhotoPreviews((event.photos || []).map(p => p));
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
      photos: []
    });
    setPhotoPreviews([]);
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
                <label htmlFor="poster">Poster (upload)</label>
                <input
                  id="poster"
                  name="posterFile"
                  type="file"
                  accept="image/*"
                  onChange={handlePosterFileChange}
                />
                <small>Upload a poster image — it will be stored on Cloudinary.</small>
                {uploadingPoster && <div style={{fontSize: 13, color: 'var(--text-light)'}}>Uploading poster…</div>}
                {formData.poster && (
                  <div style={{marginTop: 8}}>
                    <img src={formData.poster} alt="poster preview" style={{maxWidth: 200, maxHeight: 120}} />
                    <div style={{marginTop: 6}}>
                      <button type="button" className="btn btn-secondary btn-sm" onClick={() => setFormData(prev => ({...prev, poster: ''}))}>Remove Poster</button>
                    </div>
                  </div>
                )}
              </div>

              <div className="input-group">
                <label htmlFor="photos">Photos (upload multiple)</label>
                <input
                  id="photos"
                  name="photosFiles"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotosFilesChange}
                />
                <small>Upload one or more photos. Thumbnails will appear below.</small>
                {uploadingPhotos && <div style={{fontSize: 13, color: 'var(--text-light)'}}>Uploading photos…</div>}
                <div className="photos-preview" style={{display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap'}}>
                  {(formData.photos || []).map((url, idx) => (
                    <div key={idx} style={{position: 'relative'}}>
                      <img src={url} alt={`photo-${idx}`} style={{width: 100, height: 70, objectFit: 'cover', borderRadius: 4}} />
                      <button type="button" onClick={() => {
                        setFormData(prev => ({ ...prev, photos: prev.photos.filter((p,i) => i !== idx) }));
                        setPhotoPreviews(prev => prev.filter((p,i) => i !== idx));
                      }} className="btn btn-danger btn-sm" style={{position: 'absolute', top: 4, right: 4}}>✕</button>
                    </div>
                  ))}
                  {photoPreviews.map((p, i) => (
                    <img key={'preview-'+i} src={p} alt={`preview-${i}`} style={{width:100,height:70,objectFit:'cover',opacity:0.7}} />
                  ))}
                </div>
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

                {/*
                  Removed inline photos grid. Display a button to open modal.
                */}
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

      {/* Modal component instance */}
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
