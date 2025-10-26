import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import './Members.css';

const Members = () => {
  const { getAuthHeaders } = useApp();
  const [members, setMembers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    profileImgUrl: '',
    memberId: '',
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/members', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      if (!res.ok) throw new Error('Failed to load members');
      const data = await res.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
      alert('Could not load members');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      position: '',
      profileImgUrl: '',
      memberId: '',
      year: new Date().getFullYear()
    });
    setIsFormOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      position: member.position || '',
      profileImgUrl: member.profileImgUrl || '',
      memberId: member.memberId || '',
      year: member.enrollmentYear || new Date().getFullYear()
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      const res = await fetch(`/api/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
        }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Delete failed');
      }
      // remove from local list
      setMembers(prev => prev.filter(m => m._id !== id && m.id !== id));
    } catch (err) {
      console.error(err);
      alert(err.message || 'Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.position) {
      alert('Please fill in required fields');
      return;
    }

    try {
      setLoading(true);
      if (editingMember) {
        // update
        const res = await fetch(`/api/members/${editingMember._id || editingMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            position: formData.position,
            profileImgUrl: formData.profileImgUrl,
            memberId: formData.memberId,
            enrollmentYear: formData.year
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Update failed');
        }
        const updated = await res.json();
        setMembers(prev => prev.map(m => (m._id === updated._id ? updated : (m.id === updated.id ? updated : m))));
      } else {
        // create
        const res = await fetch('/api/members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeaders()
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            position: formData.position,
            profileImgUrl: formData.profileImgUrl,
            memberId: formData.memberId,
            enrollmentYear: formData.year
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Create failed');
        }
        const created = await res.json();
        setMembers(prev => [created, ...prev]);
      }

      setIsFormOpen(false);
      setEditingMember(null);
    } catch (err) {
      console.error(err);
      alert(err.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
      profileImgUrl: '',
      memberId: '',
      year: new Date().getFullYear()
    });
    setEditingMember(null);
    setIsFormOpen(false);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-description">Manage ACM club members</p>
        </div>
        <button onClick={openCreate} className="btn btn-primary">➕ Add Member</button>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingMember ? 'Edit Member' : 'Add New Member'}</h2>
              <button onClick={resetForm} className="close-btn">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="notification-form">
              <div className="input-group">
                <label htmlFor="name">Full Name *</label>
                <input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email *</label>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
              </div>

              <div className="input-group">
                <label htmlFor="position">Position *</label>
                <input id="position" name="position" value={formData.position} onChange={handleInputChange} required />
              </div>

              <div className="input-group">
                <label htmlFor="memberId">Membership ID (Optional)</label>
                <input id="memberId" name="memberId" value={formData.memberId} onChange={handleInputChange} placeholder="MEM001" />
              </div>

              <div className="input-group">
                <label htmlFor="year">Year *</label>
                <input id="year" name="year" type="number" min="2000" max="2100" value={formData.year} onChange={handleInputChange} required />
              </div>

              <div className="input-group">
                <label htmlFor="profileImgUrl">Profile Photo URL (optional)</label>
                <input id="profileImgUrl" name="profileImgUrl" value={formData.profileImgUrl} onChange={handleInputChange} />
                <small>Leave empty to auto-generate avatar from name</small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{editingMember ? 'Update' : 'Add'} Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="members-grid">
        {loading && <div>Loading…</div>}
        {!loading && members.length === 0 && (
          <div className="empty-state card">
            <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
            <h3>No members found</h3>
            <p>Add your first club member</p>
            <button onClick={openCreate} className="btn btn-primary" style={{ marginTop: 20 }}>Add Member</button>
          </div>
        )}

        {!loading && members.map(member => (
          <div key={member._id || member.id} className="card member-card">
            <img src={member.profileImgUrl || member.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3498db&color=fff&size=200`} alt={member.name} className="member-photo" />
            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <span className="member-position badge badge-primary">{member.position}</span>
              <div className="member-details">
                <div className="detail-item"><span className="detail-label">Position:</span><span className="detail-value">{member.position}</span></div>
                <div className="detail-item"><span className="detail-label">Year:</span><span className="detail-value">{member.enrollmentYear || member.year}</span></div>
              </div>

              <div className="member-actions">
                <button onClick={() => handleEdit(member)} className="btn btn-secondary btn-sm">✏️ Edit</button>
                <button onClick={() => handleDelete(member._id || member.id)} className="btn btn-danger btn-sm">🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
