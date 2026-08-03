import React, { useState, useEffect } from 'react';
import { fetchPrayers, createPrayer, tapPrayedFor, submitCommunityFlag } from '../../services/communityService';

export default function CommunityHubView() {
  const [activeTab, setActiveTab] = useState('prayers');
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newPrayerText, setNewPrayerText] = useState('');
  const [newPrayerCategory, setNewPrayerCategory] = useState('Intercession');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [posting, setPosting] = useState(false);

  const loadPrayers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPrayers();
      setPrayers(data);
    } catch (err) {
      setError('Failed to load prayer requests. Using local copy.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrayers();
  }, []);

  const handleTogglePrayed = async (id) => {
    setPrayers(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          hasPrayed: !p.hasPrayed,
          prayedCount: p.hasPrayed ? Math.max(0, p.prayedCount - 1) : p.prayedCount + 1,
        };
      }
      return p;
    }));

    await tapPrayedFor(id);
  };

  const handleAddPrayer = async (e) => {
    e.preventDefault();
    if (!newPrayerText.trim()) return;

    setPosting(true);
    const result = await createPrayer({
      title: newPrayerCategory,
      content: newPrayerText,
      category: newPrayerCategory.toLowerCase(),
      isAnonymous,
    });

    if (result.item) {
      setPrayers(prev => [result.item, ...prev]);
      setNewPrayerText('');
    }
    setPosting(false);
  };

  const handleReportContent = async (contentId) => {
    const reason = prompt('Please specify reason for reporting this post:');
    if (!reason) return;

    const result = await submitCommunityFlag({
      contentType: 'prayer_request',
      contentId,
      reason,
    });

    if (result.success) {
      alert('Thank you. The post has been flagged for moderation review.');
    } else {
      alert(`Flagging failed: ${result.error || 'Please sign in to report content.'}`);
    }
  };

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Reverent Fellowship & Prayer
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Community & Prayer Wall
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Pray for one another, join group reading circles, and share reverent study discussions.
          </p>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button
              onClick={() => setActiveTab('prayers')}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeTab === 'prayers' ? 'var(--moss)' : 'var(--bg-card)',
                color: activeTab === 'prayers' ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              🙏 Community Prayer Wall
            </button>
          </div>
        </div>

        {/* Error Alert Banner */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {error}</span>
            <button onClick={loadPrayers} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
              Retry
            </button>
          </div>
        )}

        {/* Tab 1: Prayer Wall */}
        {activeTab === 'prayers' && (
          <div>
            {/* New Prayer Post Form */}
            <form onSubmit={handleAddPrayer} style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '20px', marginBottom: '28px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '12px' }}>
                ✍️ Post a Prayer Request
              </h3>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <select
                  value={newPrayerCategory}
                  onChange={(e) => setNewPrayerCategory(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--gold)', fontWeight: 600, fontSize: '13px' }}
                >
                  <option value="Intercession">Intercession</option>
                  <option value="Praise & Thanksgiving">Praise & Thanksgiving</option>
                  <option value="Healing">Healing</option>
                  <option value="Wisdom">Wisdom</option>
                </select>

                <label style={{ fontSize: '13px', color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  Post Anonymously
                </label>
              </div>

              <textarea
                rows="3"
                placeholder="Share your prayer request with fellow Berean study members..."
                value={newPrayerText}
                onChange={(e) => setNewPrayerText(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '13.5px', outline: 'none', resize: 'vertical' }}
              ></textarea>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" disabled={posting} className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '13.5px' }}>
                  {posting ? 'Posting...' : 'Post to Prayer Wall'}
                </button>
              </div>
            </form>

            {/* Loading Skeleton */}
            {loading && (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>
                <i className="ti ti-loader-2 spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
                <span>Loading prayer wall...</span>
              </div>
            )}

            {/* Empty State */}
            {!loading && prayers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--parchment-deep)', borderRadius: '12px', border: '1px border-dashed var(--line-strong)' }}>
                <i className="ti ti-pray-off" style={{ fontSize: '40px', color: 'var(--ink-faint)', marginBottom: '12px', display: 'block' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>No prayer requests yet</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', maxWidth: '400px', margin: '0 auto' }}>
                  Be the first to post a prayer request on the community wall!
                </p>
              </div>
            )}

            {/* Prayers List */}
            {!loading && prayers.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {prayers.map((p) => (
                  <div key={p.id} className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>
                          {p.isAnonymous ? 'Anonymous Believer' : (p.title || 'Fellow Believer')}
                        </strong>
                        <span style={{ fontSize: '11px', background: 'var(--parchment-deep)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {p.category}
                        </span>
                      </div>
                      <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>
                        {new Date(p.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                    </div>

                    <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '14px', whiteSpace: 'pre-wrap' }}>
                      "{p.content}"
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <button
                        onClick={() => handleTogglePrayed(p.id)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '8px',
                          border: '1px solid var(--line-strong)',
                          background: p.hasPrayed ? 'var(--moss)' : 'var(--parchment-deep)',
                          color: p.hasPrayed ? '#fff' : 'var(--ink)',
                          fontWeight: 600,
                          fontSize: '13px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        🙏 {p.hasPrayed ? 'Prayed for This' : 'I Prayed for This'} ({p.prayedCount || 0})
                      </button>

                      <button
                        onClick={() => handleReportContent(p.id)}
                        title="Report inappropriate content"
                        style={{ background: 'none', border: 'none', color: 'var(--ink-faint)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <i className="ti ti-flag" /> Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
