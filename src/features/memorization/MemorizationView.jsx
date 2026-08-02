import React, { useState } from 'react';

const MEMORY_VERSES = [
  {
    id: 1,
    reference: 'John 3:16',
    text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
    translation: 'ESV',
    nextReview: 'Today'
  },
  {
    id: 2,
    reference: 'Tobit 1:3',
    text: 'I Tobit walked in the ways of truth and righteousness all the days of my life, and I performed many acts of charity.',
    translation: 'NRSV Catholic',
    nextReview: 'Tomorrow'
  },
  {
    id: 3,
    reference: 'Proverbs 3:5-6',
    text: 'Trust in the LORD with all your heart, and do not lean on your own understanding. In all your ways acknowledge him, and he will make straight your paths.',
    translation: 'ESV',
    nextReview: 'In 3 days'
  }
];

export default function MemorizationView() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [clozeMode, setClozeMode] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  const current = MEMORY_VERSES[activeIdx] || MEMORY_VERSES[0];

  const getClozeText = (text) => {
    const words = text.split(' ');
    return words.map((w, idx) => (idx % 3 === 1 ? '______' : w)).join(' ');
  };

  const handleNext = (rating) => {
    setCompletedCount(prev => prev + 1);
    setRevealed(false);
    setActiveIdx((prev) => (prev + 1) % MEMORY_VERSES.length);
  };

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '720px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Phase 5 • Scripture Memorization
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Spaced Repetition Scripture Memory
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Hide the text, test your recall, and lock Scripture in your heart.
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

        {/* Memory Flashcard Box */}
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
            {current.translation} • Review Due: {current.nextReview}
          </div>

          <h3 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600, marginBottom: '20px' }}>
            📖 {current.reference}
          </h3>

          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px',
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
              clozeMode ? getClozeText(current.text) : '🙈 [Tap "Reveal Text" below to test your recall]'
            ) : (
              current.text
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
                Rate how accurately you recalled this verse:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                <button onClick={() => handleNext('again')} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #FF5F56', background: 'rgba(255,95,86,0.1)', color: '#FF5F56', fontWeight: 700, cursor: 'pointer' }}>
                  🔴 Again
                </button>
                <button onClick={() => handleNext('hard')} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #FFBD2E', background: 'rgba(255,189,46,0.1)', color: '#D98200', fontWeight: 700, cursor: 'pointer' }}>
                  🟠 Hard
                </button>
                <button onClick={() => handleNext('good')} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--moss)', background: 'var(--parchment-deep)', color: 'var(--moss-dark)', fontWeight: 700, cursor: 'pointer' }}>
                  🟢 Good
                </button>
                <button onClick={() => handleNext('easy')} style={{ padding: '10px', borderRadius: '8px', border: '1px solid var(--gold)', background: 'rgba(184,134,59,0.15)', color: 'var(--gold)', fontWeight: 700, cursor: 'pointer' }}>
                  ⭐️ Easy
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}
