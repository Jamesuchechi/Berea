import React, { useState, useEffect, useCallback } from 'react';
import { getChapterPassage } from '../../services/bibleService';
import { getBookBySlug, getChapterCount } from '../../data/canonMetadata';
import BookPickerModal from './BookPickerModal';
import ChapterPickerModal from './ChapterPickerModal';
import { addBookmark, saveHighlight } from '../../services/bookmarkService';

// Default opening passage
const DEFAULT_BOOK_SLUG = 'john';
const DEFAULT_CHAPTER = 3;

export default function ReaderView({
  translation = 'KJV',
  tradition = 'protestant',
  // Breadcrumb callback to keep Topbar in sync
  onNavigationChange = null,
  // Triggered from Topbar breadcrumb click
  triggerOpenPicker = false,
  onPickerOpened = null,
  onNavigateInterlinear = null,
}) {
  const [selectedBook, setSelectedBook] = useState(() => getBookBySlug(DEFAULT_BOOK_SLUG));
  const [selectedChapter, setSelectedChapter] = useState(DEFAULT_CHAPTER);
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [showBookPicker, setShowBookPicker] = useState(false);
  const [showChapterPicker, setShowChapterPicker] = useState(false);

  // Reader interactions
  const [activeVerse, setActiveVerse] = useState(null);
  const [highlightedVerses, setHighlightedVerses] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [fontSize, setFontSize] = useState(20);

  // Open book picker when Topbar breadcrumb is clicked
  useEffect(() => {
    if (triggerOpenPicker) {
      setShowBookPicker(true);
      if (onPickerOpened) onPickerOpened();
    }
  }, [triggerOpenPicker]);

  // Load chapter whenever book, chapter, or translation changes
  useEffect(() => {
    if (!selectedBook) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      setPassage(null);

      try {
        const data = await getChapterPassage(selectedBook.slug, selectedChapter, translation);
        if (!cancelled) {
          setPassage(data);
          // Notify parent of navigation change for breadcrumb update
          if (onNavigationChange) {
            onNavigationChange({ book: selectedBook, chapter: selectedChapter });
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to load this passage. Please check your connection and try again.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [selectedBook?.slug, selectedChapter, translation]);

  const handleSelectBook = useCallback((book) => {
    setSelectedBook(book);
    setShowBookPicker(false);
    setShowChapterPicker(true);
    setHighlightedVerses([]);
    setActiveVerse(null);
  }, []);

  const handleSelectChapter = useCallback((ch) => {
    setSelectedChapter(ch);
    setShowChapterPicker(false);
    setHighlightedVerses([]);
    setActiveVerse(null);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const openBookPicker = () => {
    setShowBookPicker(true);
    setShowChapterPicker(false);
  };

  const goToPrevChapter = () => {
    if (selectedChapter > 1) {
      setSelectedChapter(c => c - 1);
      setActiveVerse(null);
    }
  };

  const goToNextChapter = () => {
    const maxChapters = selectedBook ? getChapterCount(selectedBook.slug) : 1;
    if (selectedChapter < maxChapters) {
      setSelectedChapter(c => c + 1);
      setActiveVerse(null);
    }
  };

  const toggleHighlight = async (num) => {
    const nextHighlights = highlightedVerses.includes(num)
      ? highlightedVerses.filter(v => v !== num)
      : [...highlightedVerses, num];

    setHighlightedVerses(nextHighlights);

    if (selectedBook) {
      await saveHighlight({
        bookSlug: selectedBook.slug,
        chapter: selectedChapter,
        verseNumber: num,
        color: 'amber',
      });
    }
  };

  const maxChapters = selectedBook ? getChapterCount(selectedBook.slug) : 1;
  const hasPrev = selectedChapter > 1;
  const hasNext = selectedChapter < maxChapters;

  const testamentAccent = {
    'OT': 'var(--gold)',
    'NT': '#3b82f6',
    'Deuterocanon': '#10b981',
    'Anagignoskomena': '#6366f1',
    'Ethiopian Canon': '#8b5cf6',
    'Early Church': '#f59e0b'
  };
  const accentColor = selectedBook ? (testamentAccent[selectedBook.testament] || 'var(--gold)') : 'var(--gold)';

  return (
    <>
      {/* ── Modals ── */}
      {showBookPicker && (
        <BookPickerModal
          tradition={tradition}
          onSelectBook={handleSelectBook}
          onClose={() => setShowBookPicker(false)}
        />
      )}
      {showChapterPicker && selectedBook && (
        <ChapterPickerModal
          book={selectedBook}
          onSelectChapter={handleSelectChapter}
          onBack={() => { setShowChapterPicker(false); setShowBookPicker(true); }}
          onClose={() => setShowChapterPicker(false)}
        />
      )}

      {/* ── Main Reader ── */}
      <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
        <div className="reader-inner" style={{ maxWidth: '680px', margin: '0 auto', paddingBottom: '80px' }}>

          {/* ─── Navigation Bar ─── */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            marginBottom: '24px', paddingBottom: '14px',
            borderBottom: '1px solid var(--line)',
            flexWrap: 'wrap'
          }}>
            {/* Book + Chapter Selector Button */}
            <button
              id="book-chapter-selector"
              onClick={openBookPicker}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--parchment-deep)',
                border: `1px solid ${accentColor}40`,
                borderRadius: '10px',
                padding: '8px 14px',
                cursor: 'pointer',
                fontFamily: 'var(--font-display)',
                fontSize: '17px', fontWeight: 700,
                color: 'var(--ink)',
                flex: 1,
                maxWidth: '300px'
              }}
            >
              <i className="ti ti-book-2" style={{ color: accentColor, fontSize: '18px' }} />
              <span>{selectedBook ? selectedBook.title : 'Select Book'}</span>
              {selectedBook && (
                <span style={{ color: accentColor, fontWeight: 600, fontSize: '16px' }}>{selectedChapter}</span>
              )}
              <i className="ti ti-chevron-down" style={{ color: 'var(--ink-soft)', fontSize: '14px', marginLeft: 'auto' }} />
            </button>

            {/* Prev / Next Chapter */}
            <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
              <button
                onClick={goToPrevChapter}
                disabled={!hasPrev}
                aria-label="Previous chapter"
                title={hasPrev ? `${selectedBook?.title} ${selectedChapter - 1}` : 'First chapter'}
                style={{
                  background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)',
                  borderRadius: '8px', padding: '8px 12px', cursor: hasPrev ? 'pointer' : 'not-allowed',
                  color: hasPrev ? 'var(--ink)' : 'var(--ink-soft)', opacity: hasPrev ? 1 : 0.4,
                  display: 'flex', alignItems: 'center'
                }}
              >
                <i className="ti ti-chevron-left" />
              </button>
              <button
                onClick={goToNextChapter}
                disabled={!hasNext}
                aria-label="Next chapter"
                title={hasNext ? `${selectedBook?.title} ${selectedChapter + 1}` : 'Last chapter'}
                style={{
                  background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)',
                  borderRadius: '8px', padding: '8px 12px', cursor: hasNext ? 'pointer' : 'not-allowed',
                  color: hasNext ? 'var(--ink)' : 'var(--ink-soft)', opacity: hasNext ? 1 : 0.4,
                  display: 'flex', alignItems: 'center'
                }}
              >
                <i className="ti ti-chevron-right" />
              </button>

              {/* Font size control */}
              <button
                onClick={() => setFontSize(f => Math.min(f + 2, 28))}
                aria-label="Increase font size"
                title="Larger text"
                style={{
                  background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)',
                  borderRadius: '8px', padding: '8px 10px', cursor: 'pointer',
                  color: 'var(--ink)', fontSize: '12px', fontWeight: 700
                }}
              >A+</button>
              <button
                onClick={() => setFontSize(f => Math.max(f - 2, 14))}
                aria-label="Decrease font size"
                title="Smaller text"
                style={{
                  background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)',
                  borderRadius: '8px', padding: '8px 10px', cursor: 'pointer',
                  color: 'var(--ink)', fontSize: '11px', fontWeight: 700
                }}
              >A-</button>
            </div>
          </div>

          {/* ─── Passage Eyebrow ─── */}
          {selectedBook && (
            <div style={{
              fontSize: '12px', color: accentColor, letterSpacing: '0.08em',
              textTransform: 'uppercase', marginBottom: '20px', fontWeight: 700,
              display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'
            }}>
              <span>{selectedBook.testament}</span>
              <span style={{ color: 'var(--line-strong)' }}>·</span>
              <span>{selectedBook.title}</span>
              <span style={{ color: 'var(--line-strong)' }}>·</span>
              <span>Chapter {selectedChapter}</span>
              {passage?.translation && (
                <>
                  <span style={{ color: 'var(--line-strong)' }}>·</span>
                  <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: '11px', background: 'var(--parchment-deep)', padding: '2px 8px', borderRadius: '6px', border: '1px solid var(--line-strong)' }}>
                    {passage.translation}
                  </span>
                </>
              )}
            </div>
          )}

          {/* ─── Loading State ─── */}
          {loading && (
            <div style={{ padding: '40px 0' }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} style={{
                  height: '22px', background: 'var(--parchment-deep)',
                  borderRadius: '6px', marginBottom: '16px',
                  width: `${70 + (i % 3) * 10}%`,
                  animation: 'pulse 1.5s ease-in-out infinite',
                  animationDelay: `${i * 0.08}s`
                }} />
              ))}
            </div>
          )}

          {/* ─── Error State ─── */}
          {!loading && error && (
            <div style={{
              padding: '32px', textAlign: 'center',
              background: 'var(--parchment-deep)', borderRadius: '12px',
              border: '1px solid var(--line-strong)'
            }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📡</div>
              <div style={{ fontWeight: 700, color: 'var(--ink)', marginBottom: '8px' }}>Passage Unavailable</div>
              <div style={{ fontSize: '13px', color: 'var(--ink-soft)', marginBottom: '16px' }}>{error}</div>
              <button
                onClick={() => setSelectedBook(prev => ({ ...prev }))}
                style={{
                  background: accentColor, color: '#fff', border: 'none',
                  borderRadius: '8px', padding: '8px 20px', cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 600
                }}
              >Try Again</button>
            </div>
          )}

          {/* ─── Empty State — no book selected ─── */}
          {!loading && !error && !passage && !selectedBook && (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--ink)', fontFamily: 'var(--font-display)', marginBottom: '8px' }}>
                Choose a Book to Begin
              </div>
              <div style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: '24px' }}>
                Browse {tradition.charAt(0).toUpperCase() + tradition.slice(1)} canon — all books, every chapter
              </div>
              <button
                onClick={openBookPicker}
                style={{
                  background: accentColor, color: '#fff', border: 'none',
                  borderRadius: '10px', padding: '12px 28px', cursor: 'pointer',
                  fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '16px'
                }}
              >
                <i className="ti ti-book-2" /> Browse Books
              </button>
            </div>
          )}

          {/* ─── Verses ─── */}
          {!loading && !error && passage?.verses && (
            <>
              {/* Source note for local/public-domain texts */}
              {passage.source && (
                <div style={{
                  fontSize: '11px', color: 'var(--ink-soft)', fontStyle: 'italic',
                  marginBottom: '20px', padding: '6px 12px',
                  background: 'var(--parchment-deep)', borderRadius: '6px',
                  border: '1px solid var(--line)'
                }}>
                  📜 Source: {passage.source}
                </div>
              )}

              <div
                className="verse"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: `${fontSize}px`,
                  lineHeight: 2.0,
                  color: 'var(--ink)'
                }}
              >
                {passage.verses.map((v) => {
                  const isHighlighted = highlightedVerses.includes(v.num);
                  const isActive = activeVerse === v.num;

                  return (
                    <span
                      key={v.num}
                      onClick={() => setActiveVerse(v.num === activeVerse ? null : v.num)}
                      onDoubleClick={() => toggleHighlight(v.num)}
                      title="Click to select · Double-click to highlight"
                      style={{
                        background: isHighlighted
                          ? `${accentColor}25`
                          : isActive
                            ? `${accentColor}12`
                            : 'transparent',
                        borderRadius: '4px',
                        padding: '2px 4px',
                        cursor: 'pointer',
                        transition: 'background 0.2s ease',
                        display: 'inline',
                        outline: isActive ? `2px solid ${accentColor}40` : 'none',
                        outlineOffset: '2px'
                      }}
                    >
                      <sup style={{
                        color: accentColor,
                        fontSize: '12px', fontWeight: 700,
                        marginRight: '3px', userSelect: 'none'
                      }}>
                        {v.num}
                      </sup>
                      {v.text}{' '}
                      {v.xref && (
                        <span
                          title={`Cross reference: ${typeof v.xref === 'string' ? v.xref : JSON.stringify(v.xref)}`}
                          style={{
                            fontSize: '10px', color: '#10b981', fontWeight: 600,
                            background: 'var(--parchment-deep)', padding: '1px 5px',
                            borderRadius: '4px', border: '1px solid var(--line)',
                            marginLeft: '2px'
                          }}
                        >
                          [{typeof v.xref === 'string' ? v.xref : String(v.xref)}]
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>

              {/* ─── Verse Action Toolbar ─── */}
              {activeVerse !== null && (
                <div style={{
                  marginTop: '24px',
                  padding: '14px',
                  background: 'var(--parchment-deep)',
                  borderRadius: '12px',
                  border: '1px solid var(--line-strong)',
                  display: 'flex', gap: '8px', flexWrap: 'wrap',
                  alignItems: 'center'
                }}>
                  <div style={{ fontSize: '12px', color: accentColor, fontWeight: 700, width: '100%', marginBottom: '4px' }}>
                    {selectedBook?.title} {selectedChapter}:{activeVerse}
                  </div>
                  <button
                    onClick={() => toggleHighlight(activeVerse)}
                    style={{
                      background: highlightedVerses.includes(activeVerse) ? `${accentColor}20` : 'var(--parchment)',
                      color: 'var(--ink)', border: `1px solid ${accentColor}50`,
                      padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
                      fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}
                  >
                    <i className="ti ti-highlight" style={{ color: accentColor }} />
                    {highlightedVerses.includes(activeVerse) ? 'Remove Highlight' : 'Highlight'}
                  </button>
                  <button
                    onClick={() => alert(`Created note anchor for ${selectedBook?.title} ${selectedChapter}:${activeVerse}`)}
                    style={{
                      background: 'var(--parchment)', color: 'var(--ink)',
                      border: '1px solid var(--line-strong)', padding: '7px 14px',
                      borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                      fontWeight: 600, fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}
                  >
                    <i className="ti ti-notes" style={{ color: accentColor }} /> Add Note
                  </button>
                  <button
                    onClick={() => {
                      const text = `${selectedBook?.title} ${selectedChapter}:${activeVerse} — ${passage.verses.find(v => v.num === activeVerse)?.text}`;
                      navigator.clipboard?.writeText(text).catch(() => {});
                    }}
                    style={{
                      background: 'var(--parchment)', color: 'var(--ink)',
                      border: '1px solid var(--line-strong)', padding: '7px 14px',
                      borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                      fontWeight: 600, fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}
                  >
                    <i className="ti ti-copy" style={{ color: accentColor }} /> Copy
                  </button>
                  {onNavigateInterlinear && (
                    <button
                      onClick={() => onNavigateInterlinear({ book: selectedBook?.slug, chapter: selectedChapter, verse: activeVerse })}
                      style={{
                        background: 'var(--parchment)', color: 'var(--ink)',
                        border: '1px solid var(--line-strong)', padding: '7px 14px',
                        borderRadius: '8px', cursor: 'pointer', fontSize: '13px',
                        fontWeight: 600, fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', gap: '5px'
                      }}
                    >
                      <i className="ti ti-language" style={{ color: accentColor }} /> View Interlinear
                    </button>
                  )}
                </div>
              )}

              {/* ─── Audio Player Bar ─── */}
              <div className="audio-player-bar" style={{ marginTop: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    style={{
                      background: accentColor, color: '#fff', border: 'none',
                      borderRadius: '50%', width: '38px', height: '38px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', flexShrink: 0
                    }}
                  >
                    <i className={isPlaying ? 'ti ti-player-pause' : 'ti ti-player-play'} style={{ fontSize: '18px' }} />
                  </button>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                      {selectedBook?.title} {selectedChapter} — Narrated
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
                      {passage?.translation} · Reverent Studio Audio
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPlaybackSpeed(s => s === '1.0x' ? '1.25x' : s === '1.25x' ? '1.5x' : '1.0x')}
                  style={{
                    background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)',
                    color: 'var(--ink)', fontSize: '11px', fontWeight: 600,
                    padding: '4px 8px', borderRadius: '6px', cursor: 'pointer'
                  }}
                >⚡ {playbackSpeed}</button>
              </div>

              {/* ─── Chapter Navigation Footer ─── */}
              <div style={{
                marginTop: '36px', display: 'flex',
                justifyContent: 'space-between', gap: '12px'
              }}>
                <button
                  onClick={goToPrevChapter}
                  disabled={!hasPrev}
                  style={{
                    flex: 1, padding: '12px 16px',
                    background: hasPrev ? 'var(--parchment-deep)' : 'transparent',
                    border: `1px solid ${hasPrev ? 'var(--line-strong)' : 'transparent'}`,
                    borderRadius: '10px', cursor: hasPrev ? 'pointer' : 'default',
                    color: hasPrev ? 'var(--ink)' : 'transparent',
                    fontWeight: 600, fontFamily: 'inherit', fontSize: '14px',
                    display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'
                  }}
                >
                  <i className="ti ti-chevron-left" />
                  {hasPrev ? `← Chapter ${selectedChapter - 1}` : ''}
                </button>
                <button
                  onClick={goToNextChapter}
                  disabled={!hasNext}
                  style={{
                    flex: 1, padding: '12px 16px',
                    background: hasNext ? `${accentColor}15` : 'transparent',
                    border: `1px solid ${hasNext ? accentColor + '40' : 'transparent'}`,
                    borderRadius: '10px', cursor: hasNext ? 'pointer' : 'default',
                    color: hasNext ? accentColor : 'transparent',
                    fontWeight: 700, fontFamily: 'inherit', fontSize: '14px',
                    display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center'
                  }}
                >
                  {hasNext ? `Chapter ${selectedChapter + 1} →` : ''}
                  {hasNext && <i className="ti ti-chevron-right" />}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
}
