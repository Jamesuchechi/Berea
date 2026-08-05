import React from 'react';

export default function CommunityGuidelinesModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '16px', maxWidth: '580px', width: '100%', padding: '24px', maxHeight: '85vh', overflowY: 'auto', color: 'var(--ink)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--line)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
            📜 Berea Community Guidelines
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', color: 'var(--ink-soft)', cursor: 'pointer' }}>×</button>
        </div>

        <div style={{ fontSize: '13.5px', lineHeight: 1.65, color: 'var(--ink-soft)' }}>
          <p style={{ marginBottom: '14px', color: 'var(--ink)' }}>
            Welcome to Berea. Our fellowship space exists to foster unhurried, reverent scripture study and mutual prayer across historic Christian traditions.
          </p>

          <h4 style={{ color: 'var(--gold)', fontWeight: 600, marginTop: '14px', marginBottom: '4px' }}>1. Reverence & Respect</h4>
          <p>Treat Holy Scripture, sacred traditions, and fellow believers with dignity, charity, and grace.</p>

          <h4 style={{ color: 'var(--gold)', fontWeight: 600, marginTop: '14px', marginBottom: '4px' }}>2. Graceful Theological Dialogue</h4>
          <p>Differences across traditions should be discussed with humility and academic curiosity, avoiding hostile argument.</p>

          <h4 style={{ color: 'var(--gold)', fontWeight: 600, marginTop: '14px', marginBottom: '4px' }}>3. Anti-Harassment & Anti-Spam</h4>
          <p>No hate speech, personal attacks, or commercial self-promotion. Posts are rate-limited to 3 per hour to prevent spam floods.</p>

          <h4 style={{ color: 'var(--gold)', fontWeight: 600, marginTop: '14px', marginBottom: '4px' }}>4. Anonymous & Privacy Protection</h4>
          <p>Believers may post anonymously for personal or family prayer needs. You can block disruptive users to mute their content locally.</p>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'right', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
          <button onClick={onClose} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13.5px' }}>
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
}
