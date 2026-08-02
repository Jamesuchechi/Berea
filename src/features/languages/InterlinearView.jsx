import React, { useState } from 'react';

const INTERLINEAR_SAMPLE = {
  ref: 'John 3:16',
  language: 'Greek (Koine)',
  words: [
    { original: 'Οὕτως', translit: 'Houtōs', strongs: 'G3779', english: 'For so', pos: 'Adverb', def: 'In this manner, so, thus' },
    { original: 'γὰρ', translit: 'gar', strongs: 'G1063', english: 'for', pos: 'Conjunction', def: 'For, indeed, giving reason' },
    { original: 'ἠγάπησεν', translit: 'ēgapēsen', strongs: 'G25', english: 'loved', pos: 'Verb (Aorist)', def: 'Agapao: to love unconditionally, value, cherish' },
    { original: 'ὁ', translit: 'ho', strongs: 'G3588', english: 'the', pos: 'Article', def: 'Definite article: the' },
    { original: 'Θεὸς', translit: 'Theos', strongs: 'G2316', english: 'God', pos: 'Noun (Nominative)', def: 'Theos: God, the Supreme Divinity' },
    { original: 'τὸν', translit: 'ton', strongs: 'G3588', english: 'the', pos: 'Article', def: 'Definite article: the' },
    { original: 'Υἱὸν', translit: 'Huion', strongs: 'G5207', english: 'Son', pos: 'Noun (Accusative)', def: 'Huios: Son, offspring, divine heir' },
    { original: 'τὸν', translit: 'ton', strongs: 'G3588', english: 'the', pos: 'Article', def: 'Definite article: the' },
    { original: 'μονογενῆ', translit: 'monogenē', strongs: 'G3439', english: 'only begotten', pos: 'Adjective', def: 'Monogenes: unique, sole of its kind, one and only' },
    { original: 'ἔδωκεν', translit: 'edōken', strongs: 'G1325', english: 'He gave', pos: 'Verb (Aorist)', def: 'Didomi: to give, bestow, offer freely' }
  ]
};

const HEBREW_SAMPLE = {
  ref: 'Genesis 1:1',
  language: 'Hebrew (Biblical)',
  words: [
    { original: 'בְּרֵאשִׁית', translit: "B'reshit", strongs: 'H7225', english: 'In the beginning', pos: 'Preposition + Noun', def: 'Reshit: beginning, chief, first portion' },
    { original: 'בָּרָא', translit: 'Bara', strongs: 'H1254', english: 'created', pos: 'Verb (Qal)', def: 'Bara: to create out of nothing (divine act)' },
    { original: 'אֱלֹהִים', translit: 'Elohim', strongs: 'H430', english: 'God', pos: 'Noun (Plural)', def: 'Elohim: God, Supreme Deity' },
    { original: 'אֵת', translit: 'Et', strongs: 'H853', english: '[object mark]', pos: 'Particle', def: 'Direct object marker' },
    { original: 'הַשָּׁמַיִם', translit: 'Hashamayim', strongs: 'H8064', english: 'the heavens', pos: 'Noun (Dual)', def: 'Shamayim: heavens, sky, abode of God' },
    { original: 'וְאֵת', translit: "V'et", strongs: 'H853', english: 'and', pos: 'Conjunction', def: 'And (object marker)' },
    { original: 'הָאָרֶץ', translit: "Ha'aretz", strongs: 'H776', english: 'the earth', pos: 'Noun', def: 'Eretz: earth, land, world' }
  ]
};

export default function InterlinearView() {
  const [activeSample, setActiveSample] = useState(INTERLINEAR_SAMPLE);
  const [selectedWord, setSelectedWord] = useState(INTERLINEAR_SAMPLE.words[2]);

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Phase 4 • Original Language Tools
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Original Language Interlinear & Lexicon
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Examine original Koine Greek and Biblical Hebrew texts with Strong's Concordance numbers.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '16px' }}>
            <button
              onClick={() => { setActiveSample(INTERLINEAR_SAMPLE); setSelectedWord(INTERLINEAR_SAMPLE.words[2]); }}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeSample.ref === 'John 3:16' ? 'var(--moss)' : 'var(--bg-card)',
                color: activeSample.ref === 'John 3:16' ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              🏛️ John 3:16 (Greek)
            </button>

            <button
              onClick={() => { setActiveSample(HEBREW_SAMPLE); setSelectedWord(HEBREW_SAMPLE.words[1]); }}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeSample.ref === 'Genesis 1:1' ? 'var(--moss)' : 'var(--bg-card)',
                color: activeSample.ref === 'Genesis 1:1' ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              📜 Genesis 1:1 (Hebrew)
            </button>
          </div>
        </div>

        {/* Passage Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600 }}>
            {activeSample.ref} — {activeSample.language}
          </h3>
          <span style={{ fontSize: '12px', background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', padding: '4px 10px', borderRadius: '6px', color: 'var(--gold)', fontWeight: 600 }}>
            Strong's Concordance Active
          </span>
        </div>

        {/* Interlinear Word Tiles Grid */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px', direction: activeSample.language.includes('Hebrew') ? 'rtl' : 'ltr' }}>
          {activeSample.words.map((w, idx) => {
            const isSelected = selectedWord?.strongs === w.strongs;
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
                  minWidth: '100px',
                  transition: 'all 0.2s ease',
                  boxShadow: isSelected ? '0 4px 14px rgba(184, 134, 59, 0.2)' : 'none'
                }}
              >
                <div style={{ fontSize: '22px', fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600, marginBottom: '4px' }}>
                  {w.original}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--gold)', fontStyle: 'italic', marginBottom: '2px' }}>
                  {w.translit}
                </div>
                <div style={{ fontSize: '11px', background: 'rgba(184, 134, 59, 0.15)', color: 'var(--moss-dark)', fontWeight: 700, borderRadius: '4px', padding: '1px 6px', display: 'inline-block', marginBottom: '6px' }}>
                  {w.strongs}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)' }}>
                  {w.english}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Word Lexicon Card */}
        {selectedWord && (
          <div className="card" style={{ background: 'var(--parchment-deep)', border: '2px solid var(--gold)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '11.5px', background: 'var(--moss)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                  Strong's {selectedWord.strongs}
                </span>
                <h4 style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--ink)', fontWeight: 600, marginTop: '4px' }}>
                  {selectedWord.original} ({selectedWord.translit})
                </h4>
              </div>
              <div style={{ fontSize: '13px', color: 'var(--gold)', fontWeight: 600 }}>
                {selectedWord.pos}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--line-strong)', paddingTop: '12px' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ink-soft)', fontWeight: 700, marginBottom: '4px' }}>
                Lexicon Definition & Usage:
              </div>
              <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--ink)' }}>
                {selectedWord.def}
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
