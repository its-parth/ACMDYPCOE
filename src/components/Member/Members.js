import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const Members = () => {
  const { currentMembers, pastMembers } = useApp();
  const [viewMode, setViewMode] = useState('current');
  const [selectedYear, setSelectedYear] = useState('all');

  const years = [...new Set(pastMembers.map(m => m.year))].sort((a, b) => b - a);
  const filteredPastMembers = selectedYear === 'all' 
    ? pastMembers 
    : pastMembers.filter(m => m.year === parseInt(selectedYear));

  const displayMembers = viewMode === 'current' ? currentMembers : filteredPastMembers;

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1 className="page-title">Members</h1>
        <p className="page-description">ACM club members directory</p>
      </div>

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

      {viewMode === 'past' && years.length > 0 && (
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
            <p>{viewMode === 'current' ? 'No current members' : 'No past members for this year'}</p>
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
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Members;
