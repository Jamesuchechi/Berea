import React, { useState } from 'react';

const PASSAGES = {
  'John 3': {
    book: 'John',
    chapter: 3,
    testament: 'New Testament',
    verses: [
      { num: 1, text: 'Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews.' },
      { num: 2, text: 'This man came to Jesus by night and said to him, "Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do unless God is with him."' },
      { num: 3, text: 'Jesus answered him, "Truly, truly, I say to you, unless one is born again he cannot see the kingdom of God."' },
      { num: 14, text: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,', xref: 'a' },
      { num: 15, text: 'that whoever believes in him may have eternal life.', xref: 'b' },
      { num: 16, text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.', xref: 'c' },
      { num: 17, text: 'For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him.' }
    ]
  },
  'Tobit 1': {
    book: 'Tobit',
    chapter: 1,
    testament: 'Deuterocanon',
    verses: [
      { num: 1, text: 'The book of the words of Tobit son of Tobiel, son of Ananiel, son of Aduel, son of Gabael, of the descendants of Asiel, of the tribe of Naphtali,' },
      { num: 2, text: 'who in the days of King Shalmaneser of the Assyrians was taken into captivity from Thisbe, which is to the south of Kedesh Naphtali in Upper Galilee.' },
      { num: 3, text: 'I, Tobit, walked in the ways of truth and righteousness all the days of my life, and I performed many acts of charity for my kindred.' }
    ]
  },
  '1 Enoch 1': {
    book: '1 Enoch',
    chapter: 1,
    testament: 'Pseudepigrapha / Ethiopian Canon',
    verses: [
      { num: 1, text: 'The words of the blessing of Enoch, wherewith he blessed the elect and righteous, who will be living in the day of tribulation, when all the wicked and godless are to be removed.' },
      { num: 9, text: 'And behold! He cometh with ten thousands of His holy ones to execute judgment upon all, and to destroy all the ungodly.', xref: 'Jude 1:14' }
    ]
  }
};

export default function ReaderView({ translation = 'ESV', tradition = 'Protestant' }) {
  const [selectedPassageKey, setSelectedPassageKey] = useState('John 3');
  const [activeVerse, setActiveVerse] = useState(16);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState('1.0x');
  const [highlightedVerses, setHighlightedVerses] = useState([16]);

  const currentPassage = PASSAGES[selectedPassageKey] || PASSAGES['John 3'];

  const toggleHighlight = (num) => {
    setHighlightedVerses(prev =>
      prev.includes(num) ? prev.filter(v => v !== num) : [...prev, num]
    );
  };

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '680px', margin: '0 auto' }}>
        
        {/* Quick Chapter Selector Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '24px', paddingBottom: '14px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {Object.keys(PASSAGES).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedPassageKey(key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '999px',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  border: '1px solid var(--line-strong)',
                  background: selectedPassageKey === key ? 'var(--moss)' : 'var(--bg-card)',
                  color: selectedPassageKey === key ? '#fff' : 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                📖 {key}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '12px', background: 'var(--parchment-deep)', padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--line-strong)', color: 'var(--gold)', fontWeight: 600 }}>
            {translation} • {tradition} Lens
          </div>
        </div>

        {/* Passage Eyebrow */}
        <div className="ref-eyebrow" style={{ fontSize: '13px', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 600 }}>
          {currentPassage.testament} • {currentPassage.book} Chapter {currentPassage.chapter}
        </div>

        {/* Verses Reading Display */}
        <div className="verse" style={{ fontFamily: 'var(--font-display)', fontSize: '20px', lineHeight: 1.9, color: 'var(--ink)' }}>
          {currentPassage.verses.map((v) => {
            const isHighlighted = highlightedVerses.includes(v.num);
            return (
              <span
                key={v.num}
                onClick={() => setActiveVerse(v.num)}
                style={{
                  background: isHighlighted ? 'rgba(184, 134, 59, 0.2)' : 'transparent',
                  borderRadius: '4px',
                  padding: '2px 4px',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease',
                  display: 'inline'
                }}
              >
                <span className="vnum" style={{ color: 'var(--gold)', fontSize: '13px', fontWeight: 700, verticalAlign: 'super', marginRight: '4px' }}>
                  {v.num}
                </span>
                {v.text}{' '}
                {v.xref && (
                  <span style={{ fontSize: '11px', color: 'var(--moss)', fontWeight: 600, background: 'var(--parchment-deep)', padding: '1px 5px', borderRadius: '4px', border: '1px solid var(--line)', marginLeft: '2px' }} title={`Cross reference: ${v.xref}`}>
                    [{v.xref}]
                  </span>
                )}
              </span>
            );
          })}
        </div>

        {/* Verse Action Toolbar */}
        <div className="verse-actions" style={{ marginTop: '28px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            className="tag-btn"
            onClick={() => toggleHighlight(activeVerse)}
            style={{ background: 'var(--parchment-deep)', color: 'var(--ink)', border: '1px solid var(--line-strong)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}
          >
            <i className="ti ti-highlight" style={{ color: 'var(--gold)' }}></i> Highlight Verse {activeVerse}
          </button>
          
          <button
            className="tag-btn"
            onClick={() => alert(`Created note anchor for ${currentPassage.book} ${currentPassage.chapter}:${activeVerse}`)}
            style={{ background: 'var(--parchment-deep)', color: 'var(--ink)', border: '1px solid var(--line-strong)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}
          >
            <i className="ti ti-notes" style={{ color: 'var(--gold)' }}></i> Add Study Note
          </button>

          <button
            className="tag-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            style={{ background: 'var(--parchment-deep)', color: 'var(--ink)', border: '1px solid var(--line-strong)', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' }}
          >
            <i className={isPlaying ? "ti ti-player-pause" : "ti ti-player-play"} style={{ color: 'var(--gold)' }}></i> {isPlaying ? "Pause Audio" : "Listen Chapter"}
          </button>
        </div>

        {/* Audio Player Bar */}
        <div className="audio-player-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{ background: 'var(--moss)', color: '#fff', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <i className={isPlaying ? "ti ti-player-pause" : "ti ti-player-play"} style={{ fontSize: '18px' }}></i>
            </button>

            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                {currentPassage.book} {currentPassage.chapter} Narrated
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-soft)' }}>
                {translation} • Reverent Studio Audio
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setPlaybackSpeed(s => s === '1.0x' ? '1.25x' : s === '1.25x' ? '1.5x' : '1.0x')}
              style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', color: 'var(--ink)', fontSize: '11px', fontWeight: 600, padding: '4px 8px', borderRadius: '6px', cursor: 'pointer' }}
            >
              ⚡ {playbackSpeed}
            </button>
          </div>
        </div>

      </div>
    </main>
  );
}
