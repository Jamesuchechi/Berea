import React, { useState } from 'react';

const LINEAGE_TREE = [
  { name: 'Abraham', era: '2000 BC', note: 'Father of the Promise (Genesis 12)' },
  { name: 'Isaac', era: '1900 BC', note: 'Son of the Covenant (Genesis 21)' },
  { name: 'Jacob (Israel)', era: '1850 BC', note: 'Father of the Twelve Tribes (Genesis 32)' },
  { name: 'Judah', era: '1800 BC', note: 'Scepter Tribe (Genesis 49:10)' },
  { name: 'Jesse of Bethlehem', era: '1050 BC', note: 'Root of Jesse (Isaiah 11:1)' },
  { name: 'King David', era: '1000 BC', note: 'Davidic Covenant (2 Samuel 7)' },
  { name: 'Jesus Christ', era: '1 AD', note: 'Son of David, Messiah (Matthew 1:1)' }
];

const CANON_TIMELINE = [
  { year: '586 BC', event: 'Babylonian Exile', desc: 'Temple destroyed; Jewish diaspora begins speaking Aramaic & Greek.' },
  { year: '250 BC', event: 'Septuagint (LXX) Translation', desc: 'Greek translation in Alexandria includes Deuterocanonical books (Tobit, Wisdom, Sirach, Maccabees).' },
  { year: '167 BC', event: 'Maccabean Revolt', desc: 'Hasmonaean uprising commemorated in 1 & 2 Maccabees and Hanukkah.' },
  { year: '90 AD', event: 'Rabbinic Jamnia Decisions', desc: 'Jewish Sages define Hebrew Tanakh core, excluding Septuagint additions.' },
  { year: '393-397 AD', event: 'Councils of Hippo & Carthage', desc: 'Early Western Church ratifies 73-book canon including Septuagint Deuterocanon.' }
];

const MAPS_DATA = [
  {
    id: 'assyrian',
    title: 'Tobit & The Assyrian Exile (722–612 BC)',
    region: 'Nineveh, Upper Galilee, Rages in Media',
    desc: 'Tracks Tobit’s journey from Thisbe in Naphtali to Nineveh, and Tobias’s journey to Media with Raphael.'
  },
  {
    id: 'maccabean',
    title: 'Hasmonaean Judea & Maccabean Revolt (167–160 BC)',
    region: 'Modin, Beth-Horon, Emmaus, Jerusalem',
    desc: 'Key battle sites of Judas Maccabeus against Seleucid forces, leading to the cleansing of the Temple.'
  },
  {
    id: 'paul',
    title: 'Paul’s Missionary Journeys & Early Church (46–62 AD)',
    region: 'Antioch, Ephesus, Thessalonica, Berea, Rome',
    desc: 'The spread of the Gospel across Asia Minor, Macedonia (Berea), and Rome.'
  }
];

export default function DiagramsView() {
  const [activeTab, setActiveTab] = useState('lineage');
  const [selectedMapId, setSelectedMapId] = useState('assyrian');

  const selectedMap = MAPS_DATA.find(m => m.id === selectedMapId) || MAPS_DATA[0];

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>Visual Diagrams & Historical Maps</h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '6px' }}>
            Interactive timelines, lineage trees, and Biblical geography maps.
          </p>

          {/* Tab Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
            <button
              onClick={() => setActiveTab('lineage')}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeTab === 'lineage' ? 'var(--moss)' : 'var(--bg-card)',
                color: activeTab === 'lineage' ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              🌳 Patriarchal Lineage
            </button>

            <button
              onClick={() => setActiveTab('timeline')}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeTab === 'timeline' ? 'var(--moss)' : 'var(--bg-card)',
                color: activeTab === 'timeline' ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              📜 Canon History Timeline
            </button>

            <button
              onClick={() => setActiveTab('maps')}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeTab === 'maps' ? 'var(--moss)' : 'var(--bg-card)',
                color: activeTab === 'maps' ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              🗺️ Historical Maps
            </button>
          </div>
        </div>

        {/* Tab 1: Lineage Tree */}
        {activeTab === 'lineage' && (
          <div className="card" style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: '16px', border: '1px solid var(--line-strong)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--gold)', marginBottom: '20px', fontWeight: 600, textAlign: 'center' }}>
              The Lineage of the Promise (Matthew 1 / Luke 3)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
              {LINEAGE_TREE.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--parchment-deep)', border: '2px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--moss)', fontSize: '14px', zIndex: 2 }}>
                    {idx + 1}
                  </div>

                  <div style={{ flex: 1, background: 'var(--parchment-deep)', padding: '12px 18px', borderRadius: '10px', border: '1px solid var(--line)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '16px', color: 'var(--ink)' }}>{item.name}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>{item.era}</span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                      {item.note}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Canon Timeline */}
        {activeTab === 'timeline' && (
          <div className="card" style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: '16px', border: '1px solid var(--line-strong)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--gold)', marginBottom: '20px', fontWeight: 600, textAlign: 'center' }}>
              Deuterocanon & Septuagint Historical Formation
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {CANON_TIMELINE.map((item, idx) => (
                <div key={idx} style={{ background: 'var(--parchment-deep)', padding: '16px 20px', borderRadius: '12px', borderLeft: '4px solid var(--gold)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '17px', color: 'var(--ink)', fontWeight: 600 }}>{item.event}</h4>
                    <span style={{ fontSize: '12px', background: 'var(--moss)', color: '#fff', padding: '2px 10px', borderRadius: '6px', fontWeight: 600 }}>
                      {item.year}
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Historical Maps */}
        {activeTab === 'maps' && (
          <div className="card" style={{ background: 'var(--bg-card)', padding: '28px', borderRadius: '16px', border: '1px solid var(--line-strong)' }}>
            <h3 style={{ fontSize: '20px', color: 'var(--gold)', marginBottom: '16px', fontWeight: 600, textAlign: 'center' }}>
              Interactive Biblical Geography Maps
            </h3>

            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
              {MAPS_DATA.map(m => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMapId(m.id)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    fontWeight: 600,
                    border: '1px solid var(--line-strong)',
                    background: selectedMapId === m.id ? 'var(--moss)' : 'var(--parchment-deep)',
                    color: selectedMapId === m.id ? '#fff' : 'var(--ink)',
                    cursor: 'pointer'
                  }}
                >
                  📍 {m.title.split(' ')[0]} {m.title.split(' ')[1]}
                </button>
              ))}
            </div>

            <div style={{ background: 'var(--parchment-deep)', padding: '24px', borderRadius: '14px', border: '1px solid var(--line-strong)', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700, marginBottom: '6px' }}>
                {selectedMap.region}
              </div>
              <h4 style={{ fontSize: '19px', color: 'var(--ink)', fontWeight: 600, marginBottom: '8px' }}>
                {selectedMap.title}
              </h4>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.6, maxWidth: '560px', margin: '0 auto' }}>
                {selectedMap.desc}
              </p>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
