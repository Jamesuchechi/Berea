import React, { useState, useEffect, useCallback } from 'react';
import { performUnifiedSearch } from '../../services/searchService';

export default function SearchView() {
  const [query, setQuery] = useState('eternal life');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchResults, setSearchResults] = useState({ referenceMatch: null, results: [], totalCount: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeSearch = useCallback(async (q, cat) => {
    if (!q || !q.trim()) {
      setSearchResults({ referenceMatch: null, results: [], totalCount: 0 });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await performUnifiedSearch(q, cat);
      setSearchResults(res);
    } catch (err) {
      setError('Search query failed. Please try a different term.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    executeSearch(query, filterCategory);
  }, [filterCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(query, filterCategory);
  };

  const getSourceBadge = (type) => {
    switch (type) {
      case 'canon':
        return { label: 'Canonical Scripture', bg: 'var(--moss)', color: '#fff' };
      case 'deuterocanon':
        return { label: 'Deuterocanon', bg: 'rgba(184, 134, 59, 0.15)', color: 'var(--gold)' };
      case 'pseudepigrapha':
        return { label: 'Pseudepigrapha', bg: 'rgba(99, 102, 241, 0.15)', color: '#6366f1' };
      case 'early_church':
        return { label: 'Early Church Writing', bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' };
      case 'user_note':
        return { label: 'My Study Note', bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
      default:
        return { label: 'Scripture', bg: 'var(--parchment-deep)', color: 'var(--ink-soft)' };
    }
  };

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '760px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>Scripture & History Search</h2>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Instant keyword search & reference lookup across Canon, Deuterocanon, Apocrypha, and Notes.
          </p>

          {/* Category Filter Tabs */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '18px' }}>
            {[
              { id: 'All', label: 'All Sources' },
              { id: 'Scripture', label: '📖 Canonical Scripture' },
              { id: 'Beyond', label: '📜 Deuterocanon & Beyond' },
              { id: 'Notes', label: '📝 My Notes' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterCategory(tab.id)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: '1px solid var(--line-strong)',
                  background: filterCategory === tab.id ? 'var(--moss)' : 'var(--bg-card)',
                  color: filterCategory === tab.id ? '#fff' : 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search keyword or reference (e.g. 'love', 'John 3:16', 'Jn 3:16-18', 'Tobit 1:3')..."
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
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '12px 24px', borderRadius: '10px', fontSize: '15px', fontWeight: 600 }}
          >
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </form>

        {/* Error Alert */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', color: '#ef4444', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Instant Reference Quick-Match Card */}
        {searchResults.referenceMatch && (
          <div className="card" style={{ background: 'var(--parchment-deep)', border: '2px solid var(--gold)', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700, marginBottom: '6px' }}>
              🎯 INSTANT SCRIPTURE REFERENCE MATCH
            </div>
            <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600 }}>
              📖 {searchResults.referenceMatch.formatted}
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
              Direct passage lookup matched for <b>{searchResults.referenceMatch.bookTitle}</b> chapter {searchResults.referenceMatch.chapter}.
            </p>
          </div>
        )}

        {/* Results Summary */}
        {!loading && query.trim() && (
          <div style={{ fontSize: '12.5px', color: 'var(--gold)', fontWeight: 600, marginBottom: '16px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {searchResults.totalCount} Matches Found for "{query}"
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>
            <i className="ti ti-loader-2 spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
            <span>Searching canonical texts and study notes...</span>
          </div>
        )}

        {/* Search Results List */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {searchResults.results.length === 0 && query.trim() ? (
              <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--parchment-deep)', borderRadius: '12px', border: '1px border-dashed var(--line-strong)' }}>
                <i className="ti ti-search-off" style={{ fontSize: '40px', color: 'var(--ink-faint)', marginBottom: '12px', display: 'block' }} />
                <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>No matches found</h3>
                <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', maxWidth: '420px', margin: '0 auto' }}>
                  Try searching for keywords like "love", "light", "wisdom", or direct references like "John 3:16" or "Tobit 1:3".
                </p>
              </div>
            ) : (
              searchResults.results.map((res, idx) => {
                const badge = getSourceBadge(res.type);

                return (
                  <div
                    key={idx}
                    className="card"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--line-strong)',
                      borderRadius: '12px',
                      padding: '18px 20px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>
                        📖 {res.bookTitle} {res.chapter}:{res.verseNumber}
                      </span>
                      <span style={{ fontSize: '11px', background: badge.bg, color: badge.color, padding: '3px 9px', borderRadius: '4px', fontWeight: 600 }}>
                        {badge.label}
                      </span>
                    </div>

                    <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)', whiteSpace: 'pre-wrap' }}>
                      "{res.text}"
                    </p>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </main>
  );
}
