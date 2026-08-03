import React, { useState, useEffect } from 'react';
import { getBeyondCanonBooks, resolveTraditionStatusBadge, getBeyondCanonPassage } from '../../services/beyondCanonService';

export default function CanonComparisonView({ currentTradition = 'protestant', setTradition }) {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [books, setBooks] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('tobit');
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const bList = await getBeyondCanonBooks(categoryFilter);
      setBooks(bList);

      if (bList.length > 0) {
        const slug = bList.some(b => b.slug === selectedSlug) ? selectedSlug : bList[0].slug;
        setSelectedSlug(slug);
        const passData = await getBeyondCanonPassage(slug, 1);
        setPassage(passData);
      }
    } catch (err) {
      setError('Failed to load Beyond-Canon data. Using local metadata.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryFilter]);

  const handleSelectBook = async (slug) => {
    setSelectedSlug(slug);
    setLoading(true);
    const passData = await getBeyondCanonPassage(slug, 1);
    setPassage(passData);
    setLoading(false);
  };

  const selectedBook = books.find(b => b.slug === selectedSlug) || books[0] || {
    slug: 'tobit',
    title: 'Tobit',
    category: 'deuterocanon',
    originPeriod: 'c. 200–175 BCE',
    originNote: 'Septuagint Deuterocanon text.',
  };

  const statusBadge = resolveTraditionStatusBadge(selectedSlug, currentTradition);

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '860px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Beyond-Canon Pipeline & Tradition Comparison
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Canon Comparison & Denominational Lens Toggle
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '6px', maxWidth: '640px', margin: '6px auto 0' }}>
            Compare how historic Christian traditions view Deuterocanon, Pseudepigrapha, and Early Church Fathers.
          </p>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '18px' }}>
            {[
              { id: 'All', label: 'All Beyond-Canon Texts' },
              { id: 'Deuterocanon', label: '📜 Deuterocanon' },
              { id: 'Pseudepigrapha', label: '📖 Pseudepigrapha' },
              { id: 'Early Church', label: '✝️ Early Church Writings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCategoryFilter(tab.id)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: '1px solid var(--line-strong)',
                  background: categoryFilter === tab.id ? 'var(--moss)' : 'var(--bg-card)',
                  color: categoryFilter === tab.id ? '#fff' : 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {error}</span>
            <button onClick={loadData} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
              Retry
            </button>
          </div>
        )}

        {/* Denominational Lens Toggle Bar */}
        <div className="card" style={{ background: 'var(--parchment-deep)', border: '1.5px solid var(--gold)', borderRadius: '16px', padding: '20px', marginBottom: '32px' }}>
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
            {['protestant', 'catholic', 'orthodox', 'ethiopian'].map((tKey) => {
              const isActive = currentTradition.toLowerCase() === tKey;
              return (
                <button
                  key={tKey}
                  onClick={() => setTradition && setTradition(tKey)}
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
                    textAlign: 'left'
                  }}
                >
                  <span style={{ textTransform: 'capitalize' }}>{tKey} Canon</span>
                  <span style={{ fontSize: '11px', opacity: 0.8 }}>
                    {tKey === 'protestant' && '66 Books'}
                    {tKey === 'catholic' && '73 Books'}
                    {tKey === 'orthodox' && '76+ Books'}
                    {tKey === 'ethiopian' && '81 Books'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Book Selector Pills */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '8px' }}>
            Select Beyond-Canon Text:
          </label>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {books.map((book) => (
              <button
                key={book.slug}
                onClick={() => handleSelectBook(book.slug)}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid var(--line-strong)',
                  background: selectedSlug === book.slug ? 'var(--moss)' : 'var(--bg-card)',
                  color: selectedSlug === book.slug ? '#fff' : 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                📖 {book.title}
              </button>
            ))}
          </div>
        </div>

        {/* Active Book Status Banner */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px', marginBottom: '28px' }}>
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

          <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '16px' }}>
            {selectedBook.originNote}
          </p>

          {/* Prominent Tradition Lens Canonical Status Label */}
          <div style={{ background: 'var(--parchment-deep)', border: '1px solid var(--gold)', borderRadius: '10px', padding: '14px 16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--gold)', marginBottom: '4px' }}>
              {statusBadge.label}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
              {statusBadge.details}
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>
            <i className="ti ti-loader-2 spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
            <span>Loading passage text & source attribution...</span>
          </div>
        )}

        {/* Ingested Passage Reader Box */}
        {!loading && passage && (
          <div className="card" style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
              <h4 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600 }}>
                {selectedBook.title} — Chapter {passage.chapter}
              </h4>
              <span style={{ fontSize: '12px', color: 'var(--ink-soft)', fontStyle: 'italic' }}>
                📜 {passage.attribution}
              </span>
            </div>

            <div style={{ fontFamily: 'var(--font-display)', fontSize: '17.5px', lineHeight: 1.85, color: 'var(--ink)' }}>
              {passage.verses.map(v => (
                <div key={v.num} style={{ marginBottom: '10px' }}>
                  <sup style={{ color: 'var(--gold)', fontWeight: 700, marginRight: '6px' }}>{v.num}</sup>
                  {v.text}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
