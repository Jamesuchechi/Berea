import React, { useState, useEffect } from 'react';
import { fetchPendingFlags, actionFlagItem, blockUser } from '../../services/moderationService';

export default function AdminModerationQueue() {
  const [flags, setFlags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');

  const loadFlags = async () => {
    setLoading(true);
    const data = await fetchPendingFlags();
    setFlags(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFlags();
  }, []);

  const handleAction = async (flagId, actionType, contentId, userId) => {
    if (actionType === 'block') {
      await blockUser(userId, 'Blocked by admin moderation');
      alert('User has been blocked from your community view.');
      return;
    }

    const res = await actionFlagItem(flagId, actionType, contentId);
    if (res.success) {
      setFlags(prev => prev.map(f => f.id === flagId ? { ...f, status: actionType === 'dismiss' ? 'dismissed' : 'actioned' } : f));
    }
  };

  const filteredFlags = flags.filter(f => statusFilter === 'all' || f.status === statusFilter);

  return (
    <div style={{ background: 'var(--parchment-deep)', border: '1px solid var(--gold)', borderRadius: '16px', padding: '22px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
            INTERNAL ADMIN MODERATION QUEUE
          </span>
          <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600 }}>
            🛡️ Content Review & Enforcement Queue
          </h3>
        </div>

        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {['pending', 'actioned', 'dismissed', 'all'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                border: '1px solid var(--line-strong)',
                background: statusFilter === status ? 'var(--moss)' : 'var(--bg-card)',
                color: statusFilter === status ? '#fff' : 'var(--ink)',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'capitalize',
                cursor: 'pointer'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--ink-soft)' }}>
          <i className="ti ti-loader-2 spin" style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }} />
          <span>Loading moderation queue...</span>
        </div>
      )}

      {!loading && filteredFlags.length === 0 && (
        <div style={{ textAlign: 'center', padding: '24px', background: 'var(--bg-card)', borderRadius: '10px', color: 'var(--ink-soft)', fontSize: '13.5px' }}>
          ✓ No flags matching filter "{statusFilter}". Community posts are operating smoothly.
        </div>
      )}

      {!loading && filteredFlags.map(flag => (
        <div key={flag.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '12px', padding: '16px', marginBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              Flagged Content ({flag.content_type})
            </span>
            <span style={{ fontSize: '11px', color: 'var(--ink-faint)' }}>
              {new Date(flag.created_at).toLocaleString()}
            </span>
          </div>

          <div style={{ fontSize: '13.5px', color: 'var(--ink)', marginBottom: '12px' }}>
            <strong>Reason Reported:</strong> <span style={{ color: 'var(--ink-soft)' }}>"{flag.reason}"</span>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleAction(flag.id, 'dismiss')}
              style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--parchment-deep)', color: 'var(--ink)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              ✓ Dismiss Flag
            </button>
            <button
              onClick={() => handleAction(flag.id, 'archive_content', flag.content_id)}
              style={{ padding: '4px 12px', borderRadius: '6px', border: 'none', background: '#ef4444', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              🗑️ Archive / Hide Content
            </button>
            <button
              onClick={() => handleAction(flag.id, 'block', flag.content_id, flag.reporter_id)}
              style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid #ef4444', background: 'transparent', color: '#ef4444', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              🚫 Block Author
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
