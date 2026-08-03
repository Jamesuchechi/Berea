import React, { useState, useEffect } from 'react';
import { getMemorizationItems, logReview } from '../../services/memorizationService';

export default function MemorizationView() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIdx, setActiveIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [clozeMode, setClozeMode] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await getMemorizationItems();
      setItems(data);
      setLoading(false);
    }
    loadData();
  }, []);

  const current = items[activeIdx] || items[0];

  const getClozeText = (text) => {
    if (!text) return '';
    const words = text.split(' ');
    return words.map((w, idx) => (idx % 3 === 1 ? '______' : w)).join(' ');
  };

  const handleNext = async (easeRating) => {
    if (current) {
      await logReview(current.id, easeRating);
    }
    setCompletedCount(prev => prev + 1);
    setRevealed(false);
    setActiveIdx((prev) => (prev + 1) % items.length);
  };

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '720px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Scripture Memorization System
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Spaced Repetition Scripture Memory
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Hide the text, test your recall, and lock Scripture in your heart using the SM-2 algorithm.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
            <span style={{ fontSize: '12.5px', background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', padding: '4px 12px', borderRadius: '999px', color: 'var(--gold)', fontWeight: 600 }}>
              🧠 Memory Cards Reviewed: {completedCount}
            </span>
            <button
              onClick={() => setClozeMode(!clozeMode)}
              style={{
                padding: '4px 14px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: clozeMode ? 'var(--moss)' : 'var(--bg-card)',
                color: clozeMode ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              {clozeMode ? '✏️ Fill-in-Blanks Active' : '👁️ Standard Mode'}
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>
            <i className="ti ti-loader-2 spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
            <span>Loading memorization cards...</span>
          </div>
        )}

        {!loading && items.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--parchment-deep)', borderRadius: '12px', border: '1px border-dashed var(--line-strong)' }}>
            <i className="ti ti-brain-off" style={{ fontSize: '40px', color: 'var(--ink-faint)', marginBottom: '12px', display: 'block' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>No memorization verses added</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', maxWidth: '400px', margin: '0 auto' }}>
              Add verses to your memory deck while reading in the Bible Reader view!
            </p>
          </div>
        )}

        {/* Memory Flashcard Box */}
        {!loading && current && (
          <div
            className="card"
            style={{
              background: 'var(--parchment-deep)',
              border: '2px solid var(--gold)',
              borderRadius: '20px',
              padding: '32px 28px',
              textAlign: 'center',
              marginBottom: '28px',
              boxShadow: '0 8px 28px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700, marginBottom: '8px' }}>
              Spaced Repetition Active
            </div>

            <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600, marginBottom: '20px' }}>
              📖 {current.bookSlug.toUpperCase()} {current.chapter}:{current.verseStart}
            </h3>

            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '19px',
                lineHeight: 1.8,
                color: 'var(--ink)',
                minHeight: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px',
                background: 'var(--bg-card)',
                borderRadius: '12px',
                border: '1px solid var(--line)',
                marginBottom: '24px'
              }}
            >
              {!revealed ? (
                clozeMode ? getClozeText(current.textSnapshot) : '🙈 [Tap "Reveal Text" below to test your recall]'
              ) : (
                current.textSnapshot
              )}
            </div>

            {!revealed ? (
              <button
                className="btn btn-primary"
                onClick={() => setRevealed(true)}
                style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', fontWeight: 600 }}
              >
                👁️ Reveal Scripture Text
              </button>
            ) : (
              <div>
                <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', marginBottom: '10px', fontWeight: 600 }}>
                  Rate how accurately you recalled this verse (SM-2):
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                  <button onClick={() => handleNext(1)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #FF5F56', background: 'rgba(255,95,86,0.1)', color: '#FF5F56', fontWeight: 700, cursor: 'pointer' }}>
                    🔴 Again (1)
                  </button>
                  <button onClick={() => handleNext(2)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #FFBD2E', background: 'rgba(255,189,46,0.1)', color: '#D98200', fontWeight: 700, cursor: 'pointer' }}>
                    🟠 Hard (2)
                  </button>
                  <button onClick={() => handleNext(3)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--moss)', background: 'var(--parchment-deep)', color: 'var(--moss-dark)', fontWeight: 700, cursor: 'pointer' }}>
                    🟢 Good (3)
                  </button>
                  <button onClick={() => handleNext(5)} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--gold)', background: 'rgba(184,134,59,0.15)', color: 'var(--gold)', fontWeight: 700, cursor: 'pointer' }}>
                    ⭐️ Easy (5)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
