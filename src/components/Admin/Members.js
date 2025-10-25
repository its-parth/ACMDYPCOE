import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Members.css';

const Members = () => {
  const { currentMembers, pastMembers, addMember, updateMember, deleteMember } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [viewMode, setViewMode] = useState('current'); // 'current' or 'past'
  const [selectedYear, setSelectedYear] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    profilePhoto: '',
    membershipId: '',
    year: new Date().getFullYear()
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.position || !formData.membershipId) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingMember) {
      updateMember(editingMember.id, formData);
    } else {
      addMember(formData);
    }

    resetForm();
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      position: member.position,
      profilePhoto: member.profilePhoto || '',
      membershipId: member.membershipId,
      year: member.year
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMember(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
      profilePhoto: '',
      membershipId: '',
      year: new Date().getFullYear()
    });
    setEditingMember(null);
    setIsFormOpen(false);
  };

  // Get unique years from past members
  const years = [...new Set(pastMembers.map(m => m.year))].sort((a, b) => b - a);

  // Filter past members by selected year
  const filteredPastMembers = selectedYear === 'all' 
    ? pastMembers 
    : pastMembers.filter(m => m.year === parseInt(selectedYear));

  const displayMembers = viewMode === 'current' ? currentMembers : filteredPastMembers;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-description">Manage ACM club members</p>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)} 
          className="btn btn-primary"
        >
          ➕ Add Member
        </button>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={() => resetForm()}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="notification-form">
              <div className="input-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter member name"
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
                  placeholder="member@acm.org"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="position">Position *</label>
                <select
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select position</option>
                  <option value="President">President</option>
                  <option value="Vice President">Vice President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="Technical Lead">Technical Lead</option>
                  <option value="Event Coordinator">Event Coordinator</option>
                  <option value="Volunteer">Volunteer</option>
                  <option value="Member">Member</option>
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="membershipId">Membership ID (Optional)</label>
                <input
                  type="text"
                  id="membershipId"
                  name="membershipId"
                  value={formData.membershipId}
                  onChange={handleInputChange}
                  placeholder="ACM2025XXX"
                />
              </div>

              <div className="input-group">
                <label htmlFor="year">Year *</label>
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="2000"
                  max="2100"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="profilePhoto">Profile Photo URL (optional)</label>
                <input
                  type="url"
                  id="profilePhoto"
                  name="profilePhoto"
                  value={formData.profilePhoto}
                  onChange={handleInputChange}
                  placeholder="https://example.com/photo.jpg"
                />
                <small style={{color: 'var(--text-light)', fontSize: '12px', marginTop: '4px', display: 'block'}}>
                  Leave empty to auto-generate avatar from name
                </small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMember ? 'Update' : 'Add'} Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="members-tabs">
        <button 
          className={`tab-btn ${viewMode === 'current' ? 'active' : ''}`}
          onClick={() => setViewMode('current')}
        >
          Current Members ({currentMembers.length})
        </button>
        <button 
          className={`tab-btn ${viewMode === 'past' ? 'active' : ''}`}
          onClick={() => setViewMode('past')}
        >
          Past Members ({pastMembers.length})
        </button>
      </div>

      {viewMode === 'past' && (
        <div className="year-filter">
          <label htmlFor="yearSelect">Filter by Year:</label>
          <select 
            id="yearSelect"
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="year-select"
          >
            <option value="all">All Years</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      )}

      <div className="members-grid">
        {displayMembers.length === 0 ? (
          <div className="empty-state card">
            <div style={{fontSize: '64px', marginBottom: '16px'}}>👥</div>
            <h3>No members found</h3>
            <p>{viewMode === 'current' ? 'Add your first club member' : 'No past members for this year'}</p>
            {viewMode === 'current' && (
              <button onClick={() => setIsFormOpen(true)} className="btn btn-primary" style={{marginTop: '20px'}}>
                Add Member
              </button>
            )}
          </div>
        ) : (
          displayMembers.map(member => (
            <div key={member.id} className="card member-card">
              <img 
                src={member.profilePhoto} 
                alt={member.name}
                className="member-photo"
              />
              <div className="member-info">
                <h3 className="member-name">{member.name}</h3>
                <span className="member-position badge badge-primary">{member.position}</span>
                <div className="member-details">
                  <div className="detail-item">
                    <span className="detail-label">Position:</span>
                    <span className="detail-value">{member.position}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Year:</span>
                    <span className="detail-value">{member.year}</span>
                  </div>
                </div>
                {viewMode === 'current' && (
                  <div className="member-actions">
                    <button 
                      onClick={() => handleEdit(member)} 
                      className="btn btn-secondary btn-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(member.id)} 
                      className="btn btn-danger btn-sm"
                    >
                      🗑️ Delete
                    </button>
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

export default Members;
