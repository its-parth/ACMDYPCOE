import React, { useEffect, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import './Members.css';

const Members = () => {
  const { getAuthHeaders, setCurrentMembersCnt } = useApp();
  const [members, setMembers] = useState([]);
  const [viewMode, setViewMode] = useState('current'); // 'current' | 'past'
  const [selectedYear, setSelectedYear] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    profileImgUrl: '',
    memberId: '',
    year: new Date().getFullYear(),
    password: '' // <-- added password field
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line
  }, []);

  const authHeaders = () => {
    try {
      return (typeof getAuthHeaders === 'function') ? getAuthHeaders() : {};
    } catch {
      return {};
    }
  };

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/members', {
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to load members');
      }
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('fetchMembers error:', err);
      setError(err.message || 'Could not load members');
    } finally {
      setLoading(false);
    }
  };

  // derived lists
  const currentYear = new Date().getFullYear();
  const { currentMembers, pastMembers } = useMemo(() => {
    const past = [];
    const current = [];
    for (const m of members) {
      const year = m.enrollmentYear || m.year;
      if (m.isPastMember || (year && Number(year) < currentYear)) past.push(m);
      else current.push(m);
    }
    return { currentMembers: current, pastMembers: past };
  }, [members, currentYear]);
  useEffect(() => {
  setCurrentMembersCnt(currentMembers.length);
}, [currentMembers.length, setCurrentMembersCnt]);

  const years = useMemo(() => {
    const set = new Set();
    for (const m of pastMembers) {
      const y = m.enrollmentYear || m.year;
      if (y) set.add(Number(y));
    }
    return Array.from(set).sort((a, b) => b - a);
  }, [pastMembers]);

  const filteredPast = useMemo(() => {
    if (selectedYear === 'all') return pastMembers;
    return pastMembers.filter(m => (m.enrollmentYear || m.year) === Number(selectedYear));
  }, [pastMembers, selectedYear]);

  // form handlers (create/update/delete)
  const openCreate = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      email: '',
      position: '',
      profileImgUrl: '',
      memberId: '',
      year: new Date().getFullYear(),
      password: '' // reset password when opening create form
    });
    setIsFormOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      position: member.position || '',
      profileImgUrl: member.profileImgUrl || member.profilePhoto || '',
      memberId: member.memberId || '',
      year: member.enrollmentYear || member.year || new Date().getFullYear(),
      password: '' // keep password blank when editing
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders()
        }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Delete failed');
      }
      // refresh list from server to keep state consistent
      await fetchMembers();
    } catch (err) {
      console.error('delete member error:', err);
      alert(err.message || 'Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.position) {
      alert('Please fill required fields (name, email, position).');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        name: formData.name,
        email: formData.email,
        position: formData.position,
        profileImgUrl: formData.profileImgUrl,
        memberId: formData.memberId,
        enrollmentYear: Number(formData.year)
      };

      // include password only when creating (per request)
      if (!editingMember && formData.password) {
        payload.password = formData.password;
      }

      if (editingMember) {
        const id = editingMember._id || editingMember.id;
        const res = await fetch(`http://localhost:5000/api/members/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Update failed');
        }
      } else {
        const res = await fetch('http://localhost:5000/api/members', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...authHeaders()
          },
          body: JSON.stringify(payload)
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.message || 'Create failed');
        }
      }

      // refresh members from server so UI reflects backend authoritative data
      await fetchMembers();

      setIsFormOpen(false);
      setEditingMember(null);
    } catch (err) {
      console.error('save member error:', err);
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      position: '',
      profileImgUrl: '',
      memberId: '',
      year: new Date().getFullYear(),
      password: ''
    });
    setEditingMember(null);
    setIsFormOpen(false);
  };

  const displayList = viewMode === 'current' ? currentMembers : filteredPast;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Members</h1>
          <p className="page-description">Manage ACM club members</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className={`tab-btn ${viewMode === 'current' ? 'active' : ''}`} onClick={() => setViewMode('current')}>
              Current Members ({currentMembers.length})
            </button>
            <button className={`tab-btn ${viewMode === 'past' ? 'active' : ''}`} onClick={() => setViewMode('past')}>
              Past Members ({pastMembers.length})
            </button>
          </div>
          <button onClick={openCreate} className="btn btn-primary">➕ Add Member</button>
        </div>
      </div>

      {viewMode === 'past' && (
        <div className="year-filter" style={{ marginBottom: 16 }}>
          <label htmlFor="yearSelect">Filter by Year:</label>
          <select id="yearSelect" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="year-select" style={{ marginLeft: 12 }}>
            <option value="all">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}

      {loading && <div>Loading…</div>}
      {error && <div className="alert alert-error">{error}</div>}

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

              {/* Password field shown only on create */}
              {!editingMember && (
                <div className="input-group">
                  <label htmlFor="password">Password *</label>
                  <input id="password" name="password" type="password" required="true" value={formData.password} onChange={handleInputChange} placeholder="Set password for new member" />
                
                </div>
              )}

              <div className="input-group">
                <label htmlFor="profileImgUrl">Profile Photo URL (optional)</label>
                <input id="profileImgUrl" name="profileImgUrl" value={formData.profileImgUrl} onChange={handleInputChange} />
                <small>Optional URL. Use Cloudinary URL from upload if available.</small>
              </div>

              <div className="form-actions">
                <button type="button" onClick={resetForm} className="btn btn-secondary">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : (editingMember ? 'Update' : 'Add')} Member</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="members-grid">
        {!loading && displayList.length === 0 && (
          <div className="empty-state card">
            <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
            <h3>No members found</h3>
            <p>{viewMode === 'current' ? 'No current members' : 'No past members for this year'}</p>
          </div>
        )}

        {!loading && displayList.map(member => (
          <div key={member._id || member.id} className="card member-card">
            <img src={member.profileImgUrl || member.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3498db&color=fff&size=200`} alt={member.name} className="member-photo" />
            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <span className="member-position badge badge-primary">{member.position}</span>

              <div className="member-details">
                <div className="detail-item"><span className="detail-label">Position:</span><span className="detail-value">{member.position}</span></div>
                <div className="detail-item"><span className="detail-label">Year:</span><span className="detail-value">{member.enrollmentYear || member.year || '—'}</span></div>
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
