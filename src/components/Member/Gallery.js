import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Gallery = () => {
  const { galleryItems, addGalleryItem, pastEvents, upcomingEvents } = useApp();
  const [filter, setFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'photo',
    url: '',
    eventId: '',
    eventTitle: '',
    description: ''
  });

  const allEvents = [...pastEvents, ...upcomingEvents];

  const filteredItems = filter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.type === filter);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Auto-fill event title when event is selected
    if (name === 'eventId' && value) {
      const event = allEvents.find(e => e.id === parseInt(value));
      setFormData(prev => ({
        ...prev,
        eventId: value,
        eventTitle: event ? event.title : ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.url || !formData.eventId) {
      alert('Please fill in all required fields');
      return;
    }

    addGalleryItem(formData);
    resetForm();
    alert('Photo uploaded successfully! Pending admin approval.');
  };

  const resetForm = () => {
    setFormData({
      title: '',
      type: 'photo',
      url: '',
      eventId: '',
      eventTitle: '',
      description: ''
    });
    setIsFormOpen(false);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gallery</h1>
          <p className="page-description">Event photos and videos</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="btn btn-primary"
        >
          ➕ Upload Photo
        </button>
      </div>

      {/* Upload Form Modal */}
      {isFormOpen && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Photo</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="notification-form">
              <div className="input-group">
                <label htmlFor="title">Photo Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter photo title"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="eventId">Associated Event *</label>
                <select
                  id="eventId"
                  name="eventId"
                  value={formData.eventId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select event...</option>
                  {allEvents.map(event => (
                    <option key={event.id} value={event.id}>
                      {event.title} - {event.date}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="url">Photo URL *</label>
                <input
                  type="url"
                  id="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description..."
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Upload Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="members-tabs">
        <button 
          className={`tab-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          📁 All ({galleryItems.length})
        </button>
        <button 
          className={`tab-btn ${filter === 'photo' ? 'active' : ''}`}
          onClick={() => setFilter('photo')}
        >
          📷 Photos ({galleryItems.filter(i => i.type === 'photo').length})
        </button>
        <button 
          className={`tab-btn ${filter === 'video' ? 'active' : ''}`}
          onClick={() => setFilter('video')}
        >
          🎥 Videos ({galleryItems.filter(i => i.type === 'video').length})
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="gallery-grid">
        {filteredItems.length === 0 ? (
          <div className="empty-state card">
            <div style={{fontSize: '64px', marginBottom: '16px'}}>
              {filter === 'video' ? '🎥' : '📷'}
            </div>
            <h3>No {filter === 'all' ? 'media' : filter + 's'} available</h3>
            <p>Check back later for new content</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="gallery-item card">
              <div className="media-container">
                <img 
                  src={item.url} 
                  alt={item.title}
                  className="gallery-thumbnail"
                />
                {item.type === 'video' && (
                  <div className="video-overlay">
                    <div className="play-icon">▶️</div>
                  </div>
                )}
              </div>

              <div className="gallery-item-info">
                <div className="item-header">
                  <h3>{item.title}</h3>
                  <span className={`badge ${item.type === 'photo' ? 'badge-primary' : 'badge-success'}`}>
                    {item.type === 'photo' ? '📷' : '🎥'} {item.type}
                  </span>
                </div>

                <p className="item-event">{item.eventTitle}</p>
                
                {item.description && (
                  <p className="item-description">{item.description}</p>
                )}

                <div className="item-meta">
                  <span>👤 {item.uploadedBy}</span>
                  <span>📅 {item.uploadDate}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Gallery;
