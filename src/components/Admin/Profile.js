import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import '../Member/Profile.css';

const AdminProfile = () => {
  const { currentUser, updateCurrentUser, getAuthHeaders } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: currentUser?.id || '',
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    profilePhoto: currentUser?.profilePhoto || ''
  });
  const [preview, setPreview] = useState(currentUser?.profilePhoto || '');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData({
      id: currentUser?.id || '',
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      profilePhoto: currentUser?.profilePhoto || ''
    });
    setPreview(currentUser?.profilePhoto || '');
  }, [currentUser]);

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const uploadFile = async (file) => {
    if (!file) return null;
    const fd = new FormData();
    fd.append('image', file);
    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: fd,
        headers: { ...getAuthHeaders() } // include auth if needed
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Upload failed');
      }
      const data = await res.json();
      return data.url || data.secure_url || null;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    try {
      const url = await uploadFile(file);
      if (url) setFormData(prev => ({ ...prev, profilePhoto: url }));
    } catch (err) {
      console.error('Upload failed', err);
      alert('Profile photo upload failed');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      id: currentUser?.id || '',
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      profilePhoto: currentUser?.profilePhoto || ''
    });
    setPreview(currentUser?.profilePhoto || '');
    setError(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        profilePhoto: formData.profilePhoto,
        user: currentUser,
      };
      const res = await fetch('http://localhost:5000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to update profile');
      }

      const updated = await res.json();
      await updateCurrentUser(updated);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 2500);
      setIsEditing(false);
    } catch (err) {
      console.error('Save admin profile failed', err);
      setError(err.message || 'Update failed');
      alert(err.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Profile</h1>
          <p className="page-description">Your account details</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary" disabled={loading}>
            ✏️ Edit Profile
          </button>
        )}
      </div>

      {updateSuccess && <div className="alert alert-success" style={{ marginBottom: 16 }}>✅ Profile updated successfully!</div>}
      {error && <div className="alert" style={{ marginBottom: 16 }}>{error}</div>}
      {loading && <div style={{ marginBottom: 12 }}>Saving…</div>}

      <div className="profile-container">
        <div className="profile-card card">
          {isEditing ? (
            <form onSubmit={handleSave} className="edit-profile-form">
              <div className="input-group">
                <label htmlFor="name">Full name</label>
                <input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>

              <div className="input-group">
                <label>Profile Photo</label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                  <img src={preview || ('https://ui-avatars.com/api/?name=' + encodeURIComponent(formData.name || 'Admin'))} alt="preview" style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-color)' }} />
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                      📤 Upload
                      <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                    </label>
                    {uploading && <div>Uploading…</div>}
                  </div>
                </div>
                <small style={{ color: 'var(--text-light)' }}>Choose an image — it will be uploaded to Cloudinary via the backend.</small>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
                <button type="submit" className="btn btn-primary" disabled={loading || uploading}>💾 Save Changes</button>
                <button type="button" onClick={handleCancel} className="btn btn-secondary" disabled={loading || uploading}>✖️ Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-header">
                <img src={currentUser?.profilePhoto} alt={currentUser?.name} className="profile-photo-large" />
                <div className="profile-info-header">
                  <h2>{currentUser?.name}</h2>
                  <span className="badge badge-primary">{currentUser?.position || 'Administrator'}</span>
                </div>
              </div>

              <div className="profile-details">
                <div className="detail-row">
                  <span className="detail-label">📧 Email</span>
                  <span className="detail-value">{currentUser?.email}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">🎯 Role</span>
                  <span className="detail-value">{currentUser?.role}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* right column: ID card / metadata (similar to member view) */}
        <div className="profile-card card" style={{ alignSelf: 'start' }}>
          <h3 className="section-title">Admin Info</h3>
          <div style={{ padding: 16 }}>
            <div className="detail-row"><span className="detail-label">Name</span><span className="detail-value">{currentUser?.name}</span></div>
            <div className="detail-row"><span className="detail-label">Email</span><span className="detail-value">{currentUser?.email}</span></div>
            <div className="detail-row"><span className="detail-label">Role</span><span className="detail-value">{currentUser?.role}</span></div>
            <div style={{ marginTop: 12 }}>
              <small className="text-muted">Last updated: {currentUser?.updatedAt ? new Date(currentUser.updatedAt).toLocaleString() : '—'}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;