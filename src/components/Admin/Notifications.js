import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Notifications.css';

const Notifications = () => {
  const { notifications, addNotification, updateNotification, deleteNotification } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    image: ''
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

    if (editingNotification) {
      updateNotification(editingNotification.id, formData);
    } else {
      addNotification(formData);
    }

    resetForm();
  };

  const handleEdit = (notification) => {
    setEditingNotification(notification);
    setFormData({
      title: notification.title,
      description: notification.description,
      date: notification.date,
      image: notification.image || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      deleteNotification(id);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      image: ''
    });
    setEditingNotification(null);
    setIsFormOpen(false);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-description">Send announcements to all members</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="btn btn-primary"
        >
          ➕ New Notification
        </button>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingNotification ? 'Edit Notification' : 'Create Notification'}</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="notification-form">
              <div className="input-group">
                <label htmlFor="title">Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter notification title"
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
                  placeholder="Enter notification description"
                  required
                />
              </div>

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
                <label htmlFor="image">Image URL (optional)</label>
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingNotification ? 'Update' : 'Create'} Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="empty-state card">
            <div style={{fontSize: '64px', marginBottom: '16px'}}>📢</div>
            <h3>No notifications yet</h3>
            <p>Create your first notification to send announcements to members</p>
            <button onClick={() => setIsFormOpen(true)} className="btn btn-primary" style={{marginTop: '20px'}}>
              Create Notification
            </button>
          </div>
        ) : (
          <div className="grid-2">
            {notifications.map(notification => (
              <div key={notification.id} className="card notification-card">
                {notification.image && (
                  <img src={notification.image} alt={notification.title} className="notification-image" />
                )}
                <div className="notification-header">
                  <h3 className="notification-title">{notification.title}</h3>
                  <span className="badge badge-primary">{notification.date}</span>
                </div>
                <p className="notification-description">{notification.description}</p>
                <div className="notification-actions">
                  <button 
                    onClick={() => handleEdit(notification)} 
                    className="btn btn-secondary"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(notification.id)} 
                    className="btn btn-danger"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
