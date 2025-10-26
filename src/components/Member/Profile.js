// ...existing code...
import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import './Profile.css';

const Profile = () => {
  const { currentUser, updateCurrentUser, getAuthHeaders } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: currentUser.id, 
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    profilePhoto: currentUser?.profilePhoto || ''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // UI state for upload
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(formData.profilePhoto || '');

  useEffect(() => {
    setFormData({
      user: currentUser,
      id: currentUser.id,
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      profilePhoto: currentUser?.profilePhoto || ''
    });
    setPreview(currentUser?.profilePhoto || '');
  }, [currentUser]);

  // upload file to backend -> backend uploads to Cloudinary and returns url
  const handleFileUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append('image', file);

      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          // include auth header if required; do NOT set Content-Type for FormData
          ...getAuthHeaders()
        },
        body: fd
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }

      const data = await res.json();
      const url = data.url || data.secure_url;
      if (url) {
        setFormData(prev => ({ ...prev, profilePhoto: url }));
        setPreview(url);
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'Image upload failed');
      alert('Image upload failed: ' + (err.message || ''));
    } finally {
      setUploading(false);
    }
  };

  const handleInputFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // local preview immediately
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // upload to backend/cloudinary
    handleFileUpload(file);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update profile');
      }

      const updated = await res.json();
      updateCurrentUser(updated);
      setIsEditing(false);
      setUpdateSuccess(true);

      setFormData({
        id: currentUser.id,
        name: updated.name || formData.name,
        email: updated.email || formData.email,
        profilePhoto: updated.profilePhoto || formData.profilePhoto
      });

      setPreview(updated.profilePhoto || updated.profileImgUrl || preview);

      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Update failed');
      alert(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: currentUser.id,
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      profilePhoto: currentUser?.profilePhoto || ''
    });
    setPreview(currentUser?.profilePhoto || '');
    setIsEditing(false);
    setError(null);
  };
  console.log("Current user id:" , currentUser.id);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-description">Your ACM membership details</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-primary"
            disabled={loading}
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {updateSuccess && (
        <div className="alert alert-success" style={{ marginBottom: '24px' }}>
          ✅ Profile updated successfully!
        </div>
      )}

      {loading && <div style={{ marginBottom: '16px' }}>Loading…</div>}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '16px' }}>
          ⚠️ {error}
        </div>
      )}

      <div className="profile-container">
        <div className="profile-card card">
          {isEditing ? (
            <div className="edit-profile-form">
              <h3 style={{ marginBottom: '24px', fontSize: '20px', fontWeight: '600' }}>
                Edit Your Profile
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Profile Photo</label>

                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <img
                      src={preview || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.name || 'User'))}
                      alt="preview"
                      style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }}
                    />

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                        📤 Upload
                        <input type="file" accept="image/*" onChange={handleInputFileChange} style={{ display: 'none' }} />
                      </label>
                    </div>
                  </div>

                  <small style={{ color: 'var(--text-light)' }}>
                    Choose an image file — it will be uploaded to Cloudinary via the backend.
                  </small>
                  {uploading && <div style={{ marginTop: 8 }}>Uploading…</div>}
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button type="submit" className="btn btn-primary" disabled={loading || uploading}>
                    💾 Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn btn-secondary"
                    disabled={loading || uploading}
                  >
                    ✖️ Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <>
              <div className="profile-header">
                <img src={currentUser?.profilePhoto} alt={currentUser?.name} className="profile-photo-large" />
                <div className="profile-info-header">
                  <h2>{currentUser?.name}</h2>
                  <span className="badge badge-primary">{currentUser?.position}</span>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">📧 Email</span>
                  <span className="detail-value">{currentUser?.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🎯 Position</span>
                  <span className="detail-value">{currentUser?.position}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🆔 Membership ID</span>
                  <span className="detail-value">{currentUser?.memberId}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">📅 Year</span>
                  <span className="detail-value">{currentUser?.year}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {!isEditing && (
          <div className="id-card-container">
            <h3 className="section-title">Membership ID Card</h3>
            <div className="id-card">
              <div className="id-card-header">
                <div className="id-card-logo">
                  <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="50" height="50" rx="12" fill="white" />
                    <path d="M15 35L25 15L35 35M19 28H31" stroke="#0066cc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="id-card-title">
                  <h4>ACM CLUB</h4>
                  <p>Member Card</p>
                </div>
              </div>

              <div className="id-card-body">
                <div className="id-card-photo-section">
                  <img src={currentUser?.profilePhoto} alt={currentUser?.name} className="id-card-photo" />
                </div>

                <div className="id-card-details">
                  <div className="id-detail">
                    <span className="id-label">Name</span>
                    <span className="id-value">{currentUser?.name}</span>
                  </div>
                  <div className="id-detail">
                    <span className="id-label">Position</span>
                    <span className="id-value">{currentUser?.position}</span>
                  </div>
                  <div className="id-detail">
                    <span className="id-label">Member ID</span>
                    <span className="id-value id-number">{currentUser?.memberId}</span>
                  </div>
                  <div className="id-detail">
                    <span className="id-label">Year</span>
                    <span className="id-value">{currentUser?.year}</span>
                  </div>
                </div>
              </div>

              <div className="id-card-footer">
                <div className="id-card-barcode">
                  <svg width="100%" height="40" viewBox="0 0 200 40">
                    <rect x="0" y="0" width="4" height="40" fill="#000" />
                    <rect x="6" y="0" width="2" height="40" fill="#000" />
                    <rect x="10" y="0" width="6" height="40" fill="#000" />
                    <rect x="18" y="0" width="2" height="40" fill="#000" />
                    <rect x="22" y="0" width="4" height="40" fill="#000" />
                    <rect x="28" y="0" width="2" height="40" fill="#000" />
                    <rect x="32" y="0" width="6" height="40" fill="#000" />
                    <rect x="40" y="0" width="4" height="40" fill="#000" />
                    <rect x="46" y="0" width="2" height="40" fill="#000" />
                    <rect x="50" y="0" width="6" height="40" fill="#000" />
                    <rect x="58" y="0" width="2" height="40" fill="#000" />
                    <rect x="62" y="0" width="4" height="40" fill="#000" />
                    <rect x="68" y="0" width="6" height="40" fill="#000" />
                    <rect x="76" y="0" width="2" height="40" fill="#000" />
                    <rect x="80" y="0" width="4" height="40" fill="#000" />
                  </svg>
                </div>
                <p className="id-card-note">This card is the property of ACM Club</p>
              </div>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button className="btn btn-primary">📥 Download ID Card</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
// ...existing code...