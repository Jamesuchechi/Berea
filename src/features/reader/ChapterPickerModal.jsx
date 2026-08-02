import React, { useEffect } from 'react';

export default function ChapterPickerModal({ book, onSelectChapter, onBack, onClose }) {
  const chapters = Array.from({ length: book.chapterCount }, (_, i) => i + 1);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Backspace' && e.altKey) onBack();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onBack]);

  const testamentColors = {
    'OT':              { accent: 'var(--gold)',  glow: 'rgba(184,134,59,0.15)'  },
    'NT':              { accent: '#3b82f6',       glow: 'rgba(59,130,246,0.12)' },
    'Deuterocanon':    { accent: '#10b981',       glow: 'rgba(16,185,129,0.12)' },
    'Anagignoskomena': { accent: '#6366f1',       glow: 'rgba(99,102,241,0.12)' },
    'Ethiopian Canon': { accent: '#8b5cf6',       glow: 'rgba(139,92,246,0.12)' },
    'Early Church':    { accent: '#f59e0b',       glow: 'rgba(245,158,11,0.12)' }
  };
  const colors = testamentColors[book.testament] || testamentColors['OT'];

  // Break chapters into rows of 5 for better readability on large books (Psalms 150!)
  const chunkSize = book.chapterCount > 50 ? 10 : 5;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9001,
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--parchment)',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '85dvh',
        borderRadius: '20px 20px 0 0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
        animation: 'slideUpModal 0.22s cubic-bezier(0.34,1.56,0.64,1)'
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '16px 20px 16px',
          borderBottom: '1px solid var(--line)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={onBack}
              aria-label="Back to book list"
              style={{
                background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)',
                borderRadius: '8px', padding: '6px 10px', cursor: 'pointer',
                color: 'var(--ink)', display: 'flex', alignItems: 'center', gap: '4px',
                fontSize: '13px', fontFamily: 'inherit'
              }}
            >
              <i className="ti ti-arrow-left" style={{ fontSize: '14px' }} />
              Books
            </button>

            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                {book.title}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '1px' }}>
                {book.testament} · {book.chapterCount} {book.chapterCount === 1 ? 'chapter' : 'chapters'}
              </div>
            </div>

            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)',
                color: 'var(--ink)', borderRadius: '50%', width: '32px', height: '32px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 300, lineHeight: 1
              }}
            >×</button>
          </div>

          {/* Book origin note */}
          {book.originNote && (
            <div style={{
              marginTop: '12px',
              fontSize: '12px', color: 'var(--ink-soft)', lineHeight: 1.6,
              background: colors.glow, border: `1px solid ${colors.accent}30`,
              borderRadius: '8px', padding: '8px 12px'
            }}>
              <span style={{ color: colors.accent, fontWeight: 700 }}>📖 </span>
              {book.originNote}
            </div>
          )}
        </div>

        {/* ── Chapter Grid ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 28px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px' }}>
            Select Chapter
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: book.chapterCount === 1
              ? '1fr'
              : book.chapterCount <= 10
                ? 'repeat(5, 1fr)'
                : 'repeat(auto-fill, minmax(52px, 1fr))',
            gap: '8px'
          }}>
            {chapters.map(ch => (
              <button
                key={ch}
                onClick={() => onSelectChapter(ch)}
                aria-label={`Chapter ${ch}`}
                style={{
                  aspectRatio: book.chapterCount === 1 ? 'unset' : '1',
                  padding: book.chapterCount === 1 ? '14px 20px' : '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--parchment-deep)',
                  border: `1px solid var(--line-strong)`,
                  borderRadius: '10px',
                  fontSize: book.chapterCount > 99 ? '13px' : '15px',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.12s ease'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = colors.glow;
                  e.currentTarget.style.borderColor = colors.accent;
                  e.currentTarget.style.color = colors.accent;
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--parchment-deep)';
                  e.currentTarget.style.borderColor = 'var(--line-strong)';
                  e.currentTarget.style.color = 'var(--ink)';
                  e.currentTarget.style.transform = '';
                }}
              >
                {ch === 1 && book.chapterCount === 1 ? `Read ${book.title}` : ch}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
