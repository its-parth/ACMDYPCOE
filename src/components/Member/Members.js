import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
// import './Members.css';

const Members = () => {
  const { getAuthHeaders } = useApp();
  const [members, setMembers] = useState([]);
  const [viewMode, setViewMode] = useState('current'); // 'current' | 'past'
  const [selectedYear, setSelectedYear] = useState('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/members', {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders()
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

  // derive current / past lists
  const currentYear = new Date().getFullYear();
  const pastMembers = members.filter(m => m.isPastMember || (m.enrollmentYear && m.enrollmentYear < currentYear));
  const currentMembers = members.filter(m => !m.isPastMember && (!m.enrollmentYear || m.enrollmentYear >= currentYear));

  const years = [...new Set(pastMembers.map(m => m.enrollmentYear).filter(Boolean))].sort((a, b) => b - a);

  const filteredPast = selectedYear === 'all'
    ? pastMembers
    : pastMembers.filter(m => (m.enrollmentYear || m.year) === parseInt(selectedYear, 10));

  const displayMembers = viewMode === 'current' ? currentMembers : filteredPast;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Members</h1>
        <p className="page-description">ACM club members directory</p>
      </div>

      <div className="members-tabs">
        <button className={`tab-btn ${viewMode === 'current' ? 'active' : ''}`} onClick={() => setViewMode('current')}>
          Current Members ({currentMembers.length})
        </button>
        <button className={`tab-btn ${viewMode === 'past' ? 'active' : ''}`} onClick={() => setViewMode('past')}>
          Past Members ({pastMembers.length})
        </button>
      </div>

      {viewMode === 'past' && years.length > 0 && (
        <div className="year-filter">
          <label htmlFor="yearSelect">Filter by Year:</label>
          <select id="yearSelect" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="year-select">
            <option value="all">All Years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      )}

      <div className="members-grid">
        {loading && <div>Loading…</div>}
        {!loading && error && <div className="alert alert-error">{error}</div>}

        {!loading && !error && displayMembers.length === 0 && (
          <div className="empty-state card">
            <div style={{ fontSize: 64, marginBottom: 16 }}>👥</div>
            <h3>No members found</h3>
            <p>{viewMode === 'current' ? 'No current members' : 'No past members for this year'}</p>
          </div>
        )}

        {!loading && !error && displayMembers.map(member => (
          <div key={member._id || member.id} className="card member-card">
            <img
              src={member.profileImgUrl || member.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=3498db&color=fff&size=200`}
              alt={member.name}
              className="member-photo"
            />
            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <span className="member-position badge badge-primary">{member.position}</span>

              <div className="member-details">
                <div className="detail-item"><span className="detail-label">Position:</span><span className="detail-value">{member.position}</span></div>
                <div className="detail-item"><span className="detail-label">Year:</span><span className="detail-value">{member.enrollmentYear || member.year || '—'}</span></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
