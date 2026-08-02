import React, { useState } from 'react';
import { ALL_BOOKS, TRADITIONS } from '../../data/canonMetadata';

export default function CanonComparisonView({ currentTradition = 'protestant', setTradition }) {
  const [selectedBookSlug, setSelectedBookSlug] = useState('tobit');

  const selectedBook = ALL_BOOKS.find(b => b.slug === selectedBookSlug) || ALL_BOOKS[2];

  const TRADITION_DETAILS = {
    protestant: {
      name: 'Protestant Lens',
      count: '66 Books',
      bg: 'rgba(59, 130, 246, 0.08)',
      border: 'rgba(59, 130, 246, 0.3)',
      status: selectedBook.canons.protestant.label,
      accepted: selectedBook.canons.protestant.accepted,
      rationale: selectedBook.canons.protestant.accepted
        ? 'Accepted in the 39 Old Testament Hebrew Tanakh canon.'
        : 'Classified as Apocrypha during the Reformation. Useful for historical instruction, but not used to establish doctrine.'
    },
    catholic: {
      name: 'Catholic Lens',
      count: '73 Books',
      bg: 'rgba(184, 134, 59, 0.12)',
      border: 'rgba(184, 134, 59, 0.3)',
      status: selectedBook.canons.catholic.label,
      accepted: selectedBook.canons.catholic.accepted,
      rationale: selectedBook.canons.catholic.accepted
        ? 'Affirmed as Deuterocanonical Scripture at the Councils of Hippo (393 AD), Carthage (397 AD), and Trent (1546).'
        : 'Regarded as non-canonical historical or early Christian writings.'
    },
    orthodox: {
      name: 'Eastern Orthodox Lens',
      count: '76+ Books',
      bg: 'rgba(16, 185, 129, 0.08)',
      border: 'rgba(16, 185, 129, 0.3)',
      status: selectedBook.canons.orthodox.label,
      accepted: selectedBook.canons.orthodox.accepted,
      rationale: selectedBook.canons.orthodox.accepted
        ? 'Inherited directly from the ancient Greek Septuagint (LXX) used by the early Greek Fathers & Synod of Jerusalem (1672).'
        : 'Valuable patristic or liturgical text outside the primary LXX Old Testament canon.'
    },
    ethiopian: {
      name: 'Ethiopian Orthodox Lens',
      count: '81 Books',
      bg: 'rgba(139, 92, 246, 0.08)',
      border: 'rgba(139, 92, 246, 0.3)',
      status: selectedBook.canons.ethiopian.label,
      accepted: selectedBook.canons.ethiopian.accepted,
      rationale: selectedBook.canons.ethiopian.accepted
        ? 'Included in the 81-book Ethiopian Orthodox Tewahedo canon, preserved continuously in Ge’ez liturgical manuscripts.'
        : 'Classified within early Church patristics and Apostolic ordinances.'
    }
  };

  return (
    <main class="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div class="reader-inner" style={{ maxWidth: '860px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div class="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Phase 2 • Beyond Canon & Tradition Comparison
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Canon Comparison & Denominational Lens Toggle
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '6px', maxWidth: '640px', margin: '6px auto 0' }}>
            Compare how historic Christian traditions view Deuterocanon, Pseudepigrapha, and Early Church Fathers.
          </p>
        </div>

        {/* Denominational Lens Toggle Bar */}
        <div class="card" style={{ background: 'var(--parchment-deep)', border: '1.5px solid var(--gold)', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
                ACTIVE STUDY LENS
              </div>
              <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginTop: '2px' }}>
                Set Your Tradition Preference
              </h3>
            </div>
            <span style={{ fontSize: '12px', background: 'var(--moss)', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontWeight: 600 }}>
              Current Lens: {currentTradition.toUpperCase()}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
            {Object.keys(TRADITIONS).map((tKey) => {
              const key = TRADITIONS[tKey];
              const isActive = currentTradition.toLowerCase() === key;
              return (
                <button
                  key={key}
                  onClick={() => setTradition && setTradition(key)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isActive ? '2px solid var(--gold)' : '1px solid var(--line-strong)',
                    background: isActive ? 'var(--moss)' : 'var(--bg-card)',
                    color: isActive ? '#fff' : 'var(--ink)',
                    fontWeight: 600,
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '4px',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{key} Canon</span>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>
                    {key === 'protestant' && '66 Books'}
                    {key === 'catholic' && '73 Books'}
                    {key === 'orthodox' && '76+ Books'}
                    {key === 'ethiopian' && '81 Books'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Book Selector Header */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Select Book To Inspect & Compare Across Canons:
          </label>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {ALL_BOOKS.filter(b => b.category !== 'canonical').map((book) => (
              <button
                key={book.id}
                onClick={() => setSelectedBookSlug(book.slug)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid var(--line-strong)',
                  background: selectedBookSlug === book.slug ? 'var(--moss)' : 'var(--bg-card)',
                  color: selectedBookSlug === book.slug ? '#fff' : 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                📖 {book.title} ({book.testament})
              </button>
            ))}
          </div>
        </div>

        {/* Active Book Detail Banner */}
        <div class="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
            <div>
              <span style={{ fontSize: '11px', background: 'var(--parchment-deep)', color: 'var(--gold)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase' }}>
                {selectedBook.category}
              </span>
              <h3 style={{ fontSize: '22px', color: 'var(--ink)', fontWeight: 600, marginTop: '4px' }}>
                {selectedBook.title}
              </h3>
            </div>
            <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', fontWeight: 500 }}>
              Origin: <strong>{selectedBook.originPeriod}</strong>
            </div>
          </div>

          <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)' }}>
            {selectedBook.originNote}
          </p>
        </div>

        {/* 4-Tradition Side-by-Side Comparison Matrix */}
        <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600, marginBottom: '16px' }}>
          Canon Status Across Historic Traditions:
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
          {Object.keys(TRADITION_DETAILS).map((tKey) => {
            const t = TRADITION_DETAILS[tKey];
            return (
              <div
                key={tKey}
                class="card"
                style={{
                  background: t.bg,
                  border: `1.5px solid ${t.border}`,
                  borderRadius: '12px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justify: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <strong style={{ fontSize: '16px', color: 'var(--ink)' }}>{t.name}</strong>
                    <span style={{ fontSize: '11.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: t.accepted ? 'var(--moss)' : 'var(--parchment-deep)', color: t.accepted ? '#fff' : 'var(--ink-soft)' }}>
                      {t.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink)' }}>
                    {t.rationale}
                  </p>
                </div>

                <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--line)', fontSize: '12px', color: 'var(--ink-faint)', fontWeight: 500 }}>
                  Total Canon Size: {t.count}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
