import React, { useState, useMemo, useEffect, useRef } from 'react';
import { ALL_BOOKS, TESTAMENT_GROUPS, getBooksForTradition } from '../../data/canonMetadata';

export default function BookPickerModal({ tradition = 'protestant', onSelectBook, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTestament, setActiveTestament] = useState('OT');
  const searchRef = useRef(null);

  // Focus search input on mount
  useEffect(() => {
    setTimeout(() => searchRef.current?.focus(), 100);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const traditionKey = tradition.toLowerCase();

  // All books shaped for this tradition
  const allBooksForTradition = useMemo(() => getBooksForTradition(traditionKey), [traditionKey]);

  // Filter by search query
  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return allBooksForTradition;
    const q = searchQuery.toLowerCase();
    return allBooksForTradition.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      b.originNote?.toLowerCase().includes(q)
    );
  }, [allBooksForTradition, searchQuery]);

  // Determine which testament groups to show
  const availableGroups = useMemo(() => {
    const testsWithBooks = new Set(filteredBySearch.map(b => b.testament));
    return TESTAMENT_GROUPS.filter(g => testsWithBooks.has(g.key));
  }, [filteredBySearch]);

  // Books for current tab
  const booksInTab = useMemo(() => {
    if (searchQuery.trim()) return filteredBySearch;
    return filteredBySearch.filter(b => b.testament === activeTestament);
  }, [filteredBySearch, activeTestament, searchQuery]);

  // Auto-switch to first available tab when searching
  useEffect(() => {
    if (searchQuery.trim() && availableGroups.length > 0) return;
    if (!availableGroups.find(g => g.key === activeTestament) && availableGroups.length > 0) {
      setActiveTestament(availableGroups[0].key);
    }
  }, [availableGroups, activeTestament, searchQuery]);

  const displayBooks = searchQuery.trim() ? filteredBySearch : booksInTab;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.72)',
        backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'var(--parchment)',
        width: '100%',
        maxWidth: '680px',
        height: '90dvh',
        borderRadius: '20px 20px 0 0',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 -8px 40px rgba(0,0,0,0.4)',
        animation: 'slideUpModal 0.25s cubic-bezier(0.34,1.56,0.64,1)'
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: '16px 20px 0',
          borderBottom: '1px solid var(--line)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)' }}>
                Choose a Book
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                {tradition.charAt(0).toUpperCase() + tradition.slice(1)} Canon
                &nbsp;·&nbsp;
                {allBooksForTradition.filter(b => b.isAccepted).length} books
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Close book picker"
              style={{
                background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)',
                color: 'var(--ink)', borderRadius: '50%', width: '32px', height: '32px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '18px', fontWeight: 300, lineHeight: 1
              }}
            >×</button>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <i className="ti ti-search" style={{
              position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
              color: 'var(--ink-soft)', fontSize: '16px', pointerEvents: 'none'
            }} />
            <input
              ref={searchRef}
              type="search"
              placeholder="Search books..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px 10px 38px',
                background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)',
                borderRadius: '10px', fontSize: '14px', color: 'var(--ink)',
                outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Testament Tabs — hidden during search */}
          {!searchQuery.trim() && (
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '1px' }}>
              {availableGroups.map(g => (
                <button
                  key={g.key}
                  onClick={() => setActiveTestament(g.key)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px 8px 0 0',
                    border: '1px solid var(--line-strong)',
                    borderBottom: activeTestament === g.key ? '1px solid var(--parchment)' : '1px solid var(--line-strong)',
                    background: activeTestament === g.key ? 'var(--parchment)' : 'var(--parchment-deep)',
                    color: activeTestament === g.key ? 'var(--gold)' : 'var(--ink-soft)',
                    fontWeight: activeTestament === g.key ? 700 : 500,
                    fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                    marginBottom: '-1px'
                  }}
                >
                  {g.icon} {g.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Book Grid ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 24px' }}>
          {displayBooks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--ink-soft)' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📚</div>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>No books found</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Try a different search term</div>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: '10px'
            }}>
              {displayBooks.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onSelect={() => onSelectBook(book)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BookCard({ book, onSelect }) {
  const isAccepted = book.isAccepted;

  const testamentColors = {
    'OT': { bg: 'rgba(184,134,59,0.1)', border: 'rgba(184,134,59,0.3)', badge: 'var(--gold)' },
    'NT': { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.3)', badge: '#3b82f6' },
    'Deuterocanon': { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.3)', badge: '#10b981' },
    'Anagignoskomena': { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.3)', badge: '#6366f1' },
    'Ethiopian Canon': { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.3)', badge: '#8b5cf6' },
    'Early Church': { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.3)', badge: '#f59e0b' }
  };
  const colors = testamentColors[book.testament] || testamentColors['OT'];

  return (
    <button
      onClick={isAccepted ? onSelect : undefined}
      title={!isAccepted ? `Not in this tradition's canon — ${book.traditionLabel}` : book.originNote}
      style={{
        background: isAccepted ? colors.bg : 'var(--parchment-deep)',
        border: `1px solid ${isAccepted ? colors.border : 'var(--line)'}`,
        borderRadius: '10px',
        padding: '12px 10px',
        cursor: isAccepted ? 'pointer' : 'not-allowed',
        textAlign: 'left',
        opacity: isAccepted ? 1 : 0.45,
        transition: 'all 0.15s ease',
        fontFamily: 'inherit',
        position: 'relative',
        overflow: 'hidden'
      }}
      onMouseEnter={e => {
        if (isAccepted) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ fontSize: '11px', fontWeight: 700, color: colors.badge, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {book.testament}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3, marginBottom: '6px' }}>
        {book.title}
      </div>
      <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
        {book.chapterCount} {book.chapterCount === 1 ? 'chapter' : 'chapters'}
      </div>
      {!isAccepted && (
        <div style={{
          position: 'absolute', top: '6px', right: '6px',
          background: 'var(--parchment-deep)', border: '1px solid var(--line)',
          borderRadius: '4px', fontSize: '9px', padding: '1px 4px', color: 'var(--ink-soft)'
        }}>
          not in canon
        </div>
      )}
    </button>
  );
}
