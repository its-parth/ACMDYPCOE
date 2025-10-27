import React, { useEffect, useState } from 'react';

const EventPhotosModal = ({ open, onClose, photos = [], title = '' }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (open) setIndex(0);
  }, [open, photos]);

  useEffect(() => {
    const onKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex(i => (photos.length ? (i + 1) % photos.length : 0));
      if (e.key === 'ArrowLeft') setIndex(i => (photos.length ? (i - 1 + photos.length) % photos.length : 0));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, photos, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1200
    }} onClick={onClose}>
      <div className="modal-content" style={{
        width: '90%', maxWidth: 900, background: '#fff', borderRadius: 8, padding: 16, position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8}}>
          <h3 style={{margin: 0}}>{title || 'Event Photos'}</h3>
          <button onClick={onClose} className="btn btn-secondary" style={{marginLeft: 12}}>Close</button>
        </div>

        {(!photos || photos.length === 0) ? (
          <div style={{padding: 24, textAlign: 'center', color: 'var(--text-secondary)'}}>
            <p style={{fontSize: 18}}>No photos for this event.</p>
          </div>
        ) : (
          <div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12}}>
              <button onClick={() => setIndex(i => (i - 1 + photos.length) % photos.length)} className="btn btn-secondary">◀</button>
              <img src={photos[index]} alt={`photo-${index}`} style={{maxHeight: '60vh', maxWidth: '70%', objectFit: 'contain', borderRadius: 6}} />
              <button onClick={() => setIndex(i => (i + 1) % photos.length)} className="btn btn-secondary">▶</button>
            </div>

            <div style={{display: 'flex', gap: 8, marginTop: 12, overflowX: 'auto', paddingTop: 8}}>
              {photos.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`thumb-${i}`}
                  onClick={() => setIndex(i)}
                  style={{
                    width: 84, height: 56, objectFit: 'cover', borderRadius: 4, cursor: 'pointer',
                    border: i === index ? '2px solid var(--primary)' : '2px solid transparent',
                    opacity: i === index ? 1 : 0.8
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPhotosModal;