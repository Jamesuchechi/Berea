import React, { useState, useEffect } from 'react';
import { getInterlinearPassage, getLexiconEntry, speakOriginalWord } from '../../services/languageService';

const POPULAR_PASSAGES = [
  { label: '🏛️ John 3:16 (Greek)', book: 'john', ch: 3, v: 16 },
  { label: '📜 Genesis 1:1 (Hebrew)', book: 'genesis', ch: 1, v: 1 },
  { label: '📖 Matthew 1:1 (Greek)', book: 'matthew', ch: 1, v: 1 },
  { label: '🕊️ Psalm 23:1 (Hebrew)', book: 'psalms', ch: 23, v: 1 },
];

export default function InterlinearView({ initialBook = 'john', initialChapter = 3, initialVerse = 16 }) {
  const [selectedBook, setSelectedBook] = useState(initialBook);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [selectedVerse, setSelectedVerse] = useState(initialVerse);

  const [passageData, setPassageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedWord, setSelectedWord] = useState(null);
  const [lexiconDetails, setLexiconDetails] = useState(null);
  const [lexiconLoading, setLexiconLoading] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Load Interlinear Passage
  useEffect(() => {
    let isMounted = true;
    async function loadPassage() {
      setLoading(true);
      const data = await getInterlinearPassage(selectedBook, selectedChapter, selectedVerse);
      if (isMounted) {
        setPassageData(data);
        if (data.words && data.words.length > 0) {
          setSelectedWord(data.words[0]);
        }
        setLoading(false);
      }
    }
    loadPassage();
    return () => { isMounted = false; };
  }, [selectedBook, selectedChapter, selectedVerse]);

  // Load Lexicon Entry when word is selected
  useEffect(() => {
    let isMounted = true;
    async function loadLexicon() {
      if (!selectedWord?.strongsId) {
        setLexiconDetails(null);
        return;
      }
      setLexiconLoading(true);
      const entry = await getLexiconEntry(selectedWord.strongsId);
      if (isMounted) {
        setLexiconDetails(entry);
        setLexiconLoading(false);
      }
    }
    loadLexicon();
    return () => { isMounted = false; };
  }, [selectedWord]);

  const handleAudioPlay = (text, lang) => {
    setIsPlayingAudio(true);
    speakOriginalWord(text, lang);
    setTimeout(() => setIsPlayingAudio(false), 1200);
  };

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '840px', margin: '0 auto' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Original Language Tools • Strong's Concordance Engine
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Interactive Interlinear & Lexicon Inspector
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Study word-by-word Koine Greek & Biblical Hebrew text, Strong's concordance codes, and lexicon derivations.
          </p>

          {/* Preset Quick Passages */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '16px' }}>
            {POPULAR_PASSAGES.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSelectedBook(p.book);
                  setSelectedChapter(p.ch);
                  setSelectedVerse(p.v);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: '1px solid var(--line-strong)',
                  background: selectedBook === p.book && selectedChapter === p.ch && selectedVerse === p.v ? 'var(--moss)' : 'var(--bg-card)',
                  color: selectedBook === p.book && selectedChapter === p.ch && selectedVerse === p.v ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Passage Navigation Controls */}
        <div style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)' }}>Book:</label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontWeight: 600, fontSize: '13.5px' }}
            >
              <option value="john">John (Greek)</option>
              <option value="genesis">Genesis (Hebrew)</option>
              <option value="matthew">Matthew (Greek)</option>
              <option value="psalms">Psalms (Hebrew)</option>
              <option value="romans">Romans (Greek)</option>
              <option value="isaiah">Isaiah (Hebrew)</option>
            </select>

            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', marginLeft: '8px' }}>Ch:</label>
            <input
              type="number"
              min="1"
              max="150"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(parseInt(e.target.value, 10) || 1)}
              style={{ width: '56px', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontWeight: 600, textAlign: 'center' }}
            />

            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink-soft)', marginLeft: '8px' }}>V:</label>
            <input
              type="number"
              min="1"
              max="176"
              value={selectedVerse}
              onChange={(e) => setSelectedVerse(parseInt(e.target.value, 10) || 1)}
              style={{ width: '56px', padding: '6px 8px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontWeight: 600, textAlign: 'center' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', background: 'rgba(184, 134, 59, 0.15)', color: 'var(--gold)', fontWeight: 700, padding: '4px 10px', borderRadius: '6px' }}>
              {passageData?.language || 'Koine Greek / Biblical Hebrew'}
            </span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>
            ⚡ Loading interlinear text &amp; Strong's concordance lexicon...
          </div>
        ) : (
          <>
            {/* Active Passage Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600 }}>
                {passageData?.bookTitle} {passageData?.chapter}:{passageData?.verseNumber} — {passageData?.language}
              </h3>
              <span style={{ fontSize: '12px', color: 'var(--ink-soft)' }}>
                Click any word tile for Strong's dictionary lookup
              </span>
            </div>

            {/* Word Tiles Grid */}
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '32px',
                direction: passageData?.direction || 'ltr'
              }}
            >
              {passageData?.words?.map((w, idx) => {
                const isSelected = selectedWord?.strongsId === w.strongsId && selectedWord?.original === w.original;
                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedWord(w)}
                    style={{
                      background: isSelected ? 'var(--parchment-deep)' : 'var(--bg-card)',
                      border: isSelected ? '2px solid var(--gold)' : '1px solid var(--line-strong)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      textAlign: 'center',
                      minWidth: '105px',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 14px rgba(184, 134, 59, 0.25)' : 'none',
                      direction: 'ltr' // keeps internal tile LTR
                    }}
                  >
                    <div style={{ fontSize: '22px', fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600, marginBottom: '4px' }}>
                      {w.original}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--gold)', fontStyle: 'italic', marginBottom: '2px' }}>
                      {w.translit}
                    </div>
                    <div style={{ fontSize: '11px', background: 'rgba(184, 134, 59, 0.15)', color: 'var(--moss-dark)', fontWeight: 700, borderRadius: '4px', padding: '1px 6px', display: 'inline-block', marginBottom: '6px' }}>
                      {w.strongsId}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                      {w.gloss}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Word Lexicon Card */}
            {selectedWord && (
              <div className="card" style={{ background: 'var(--parchment-deep)', border: '2px solid var(--gold)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '11.5px', background: 'var(--moss)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                        Strong's {selectedWord.strongsId}
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>
                        {selectedWord.pos}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '26px', fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      {selectedWord.original} ({selectedWord.translit})
                      <button
                        onClick={() => handleAudioPlay(selectedWord.original, passageData?.language)}
                        disabled={isPlayingAudio}
                        title="Listen to pronunciation"
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--line-strong)',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--gold)',
                          fontSize: '14px'
                        }}
                      >
                        🔊
                      </button>
                    </h4>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '13px', color: 'var(--ink-soft)', fontWeight: 600 }}>
                      English Gloss:
                    </div>
                    <div style={{ fontSize: '18px', color: 'var(--moss)', fontWeight: 700 }}>
                      "{selectedWord.gloss}"
                    </div>
                  </div>
                </div>

                {/* Lexicon Details */}
                <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: '14px' }}>
                  {lexiconLoading ? (
                    <div style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                      Loading Strong's lexicon entry...
                    </div>
                  ) : lexiconDetails ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div>
                        <strong style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-soft)' }}>Short Definition: </strong>
                        <span style={{ fontSize: '14.5px', color: 'var(--ink)', fontWeight: 600 }}>{lexiconDetails.shortDef || lexiconDetails.definition}</span>
                      </div>
                      <div>
                        <strong style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ink-soft)' }}>Full Concordance Definition: </strong>
                        <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)', marginTop: '4px' }}>{lexiconDetails.definition}</p>
                      </div>
                      {lexiconDetails.derivation && (
                        <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', fontStyle: 'italic', marginTop: '4px' }}>
                          Etymology/Derivation: {lexiconDetails.derivation}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13.5px', color: 'var(--ink-soft)' }}>
                      Concordance entry: {selectedWord.gloss} ({selectedWord.pos})
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </main>
  );
}
