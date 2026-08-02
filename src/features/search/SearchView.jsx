import React, { useState } from 'react';
import { searchScripture } from '../../services/bibleService';

export default function SearchView() {
  const [query, setQuery] = useState('eternal life');
  const [results, setResults] = useState(() => searchScripture('eternal life'));

  const handleSearch = (e) => {
    e.preventDefault();
    const res = searchScripture(query);
    setResults(res);
  };

  return (
    <main class="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div class="reader-inner" style={{ maxWidth: '760px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>Scripture & History Search</h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Instant keyword search across Canonical books, Deuterocanon, and Apocrypha.
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', marginBottom: '28px' }}>
          <input
            type="text"
            placeholder="Type a word, phrase, or reference (e.g. 'light', 'wisdom', 'Tobit')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1.5px solid var(--line-strong)',
              background: 'var(--bg-card)',
              color: 'var(--ink)',
              fontSize: '15px',
              outline: 'none'
            }}
          />

          <button
            type="submit"
            class="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: 600 }}
          >
            🔍 Search
          </button>
        </form>

        {/* Search Results Summary */}
        <div style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {results.length} Matches Found for "{query}"
        </div>

        {/* Search Results List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {results.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', background: 'var(--parchment-deep)', borderRadius: '12px', color: 'var(--ink-soft)' }}>
              No matches found for "{query}". Try searching for terms like "love", "light", "born again", or "Tobit".
            </div>
          ) : (
            results.map((res, idx) => (
              <div
                key={idx}
                class="card"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--line-strong)',
                  borderRadius: '12px',
                  padding: '18px 20px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>
                    📖 {res.book} {res.chapter}:{res.verseNum}
                  </span>
                  <span style={{ fontSize: '11px', background: 'var(--parchment-deep)', padding: '2px 8px', borderRadius: '4px', color: 'var(--ink-soft)', fontWeight: 600 }}>
                    {res.translation}
                  </span>
                </div>

                <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)' }}>
                  "{res.text}"
                </p>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}
