import React, { useState } from 'react';

const INITIAL_NOTES = [
  {
    id: 1,
    reference: 'John 3:16',
    translation: 'ESV',
    category: 'Highlights',
    date: 'Aug 2, 2026',
    content: 'Nicodemus night visitor context — compare with Serpent in Wilderness (Numbers 21). The phrase "only begotten" (monogenēs) highlights uniqueness rather than origin.',
    tags: ['Christology', 'John']
  },
  {
    id: 2,
    reference: 'Tobit 1:3',
    translation: 'NRSV Catholic Edition',
    category: 'Deuterocanon Notes',
    date: 'Aug 1, 2026',
    content: 'Tobit emphasizes almsgiving and personal righteousness during the Assyrian Exile in Nineveh. Shows post-exilic Jewish piety before the Roman period.',
    tags: ['Deuterocanon', 'Exile', 'Tobit']
  },
  {
    id: 3,
    reference: '1 Enoch 1:9',
    translation: 'Charles Apocrypha',
    category: 'Pseudepigrapha',
    date: 'Jul 29, 2026',
    content: 'Direct source quoted in Jude 1:14-15 ("Behold, the Lord comes with ten thousands of his holy ones..."). Preserved canonically in Ethiopian Tewahedo Church.',
    tags: ['Enoch', 'Jude', 'Ethiopian Canon']
  }
];

export default function NotesView() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteRef, setNewNoteRef] = useState('John 3:17');

  const filteredNotes = notes.filter(n => {
    const matchesCat = filterCategory === 'All' || n.category === filterCategory;
    const matchesSearch = n.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newObj = {
      id: Date.now(),
      reference: newNoteRef || 'General Note',
      translation: 'ESV',
      category: 'User Note',
      date: 'Just now',
      content: newNoteText,
      tags: ['Personal']
    };

    setNotes([newObj, ...notes]);
    setNewNoteText('');
  };

  return (
    <main class="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div class="reader-inner" style={{ maxWidth: '760px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '26px', color: 'var(--ink)', fontWeight: 600 }}>Your Study Notes & Journal</h2>
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginTop: '4px' }}>
              Every note anchors permanently to its canonical verse reference.
            </p>
          </div>

          <span style={{ background: 'var(--moss)', color: '#fff', fontSize: '12px', fontWeight: 600, padding: '6px 14px', borderRadius: '999px' }}>
            📝 {notes.length} Anchored Notes
          </span>
        </div>

        {/* Search & Category Filter Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Search notes or references..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              minWidth: '220px',
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--line-strong)',
              background: 'var(--bg-card)',
              color: 'var(--ink)',
              outline: 'none',
              fontSize: '13.5px'
            }}
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--line-strong)',
              background: 'var(--bg-card)',
              color: 'var(--ink)',
              outline: 'none',
              fontSize: '13.5px',
              fontWeight: 500
            }}
          >
            <option value="All">All Categories</option>
            <option value="Highlights">Highlights</option>
            <option value="Deuterocanon Notes">Deuterocanon Notes</option>
            <option value="Pseudepigrapha">Pseudepigrapha</option>
          </select>
        </div>

        {/* New Note Form */}
        <form onSubmit={handleAddNote} style={{ background: 'var(--parchment-deep)', padding: '18px', borderRadius: '12px', border: '1px solid var(--line-strong)', marginBottom: '28px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Verse ref (e.g. Genesis 1:1)"
              value={newNoteRef}
              onChange={(e) => setNewNoteRef(e.target.value)}
              style={{ width: '180px', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '13px' }}
            />
          </div>
          <textarea
            rows="3"
            placeholder="Write a verse-anchored study note..."
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '13.5px', outline: 'none', resize: 'vertical' }}
          ></textarea>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button type="submit" class="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              Save Anchored Note
            </button>
          </div>
        </form>

        {/* Notes Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredNotes.map((note) => (
            <div key={note.id} class="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>
                    📖 {note.reference}
                  </span>
                  <span style={{ fontSize: '11px', background: 'var(--parchment-deep)', padding: '2px 8px', borderRadius: '4px', color: 'var(--ink-soft)' }}>
                    {note.translation}
                  </span>
                </div>
                <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>{note.date}</span>
              </div>

              <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '12px' }}>
                {note.content}
              </p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {note.tags.map((t, idx) => (
                  <span key={idx} style={{ fontSize: '11px', background: 'rgba(184, 134, 59, 0.12)', color: 'var(--gold)', border: '1px solid rgba(184, 134, 59, 0.25)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
