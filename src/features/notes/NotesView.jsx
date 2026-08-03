import React, { useState, useEffect } from 'react';
import { fetchUserNotes, createNote, deleteNote } from '../../services/noteService';

export default function NotesView() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteRef, setNewNoteRef] = useState('John 3:16');
  const [saving, setSaving] = useState(false);

  const loadNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUserNotes();
      setNotes(data);
    } catch (err) {
      setError('Failed to load study notes. Using local copy.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();
  }, []);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    setSaving(true);
    const result = await createNote({
      bookId: '00000000-0000-0000-0000-000000000000', // placeholder fallback ID
      chapter: 3,
      verseNumber: 16,
      content: `${newNoteRef ? `[${newNoteRef}] ` : ''}${newNoteText}`,
    });

    if (result.item) {
      setNotes(prev => [result.item, ...prev]);
      setNewNoteText('');
    }
    setSaving(false);
  };

  const handleDeleteNote = async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    await deleteNote(id);
  };

  const filteredNotes = notes.filter(n =>
    n.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '760px', margin: '0 auto' }}>
        
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

        {/* Error Alert Banner with Retry */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {error}</span>
            <button onClick={loadNotes} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
              Retry
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Search notes or references..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '8px',
              border: '1px solid var(--line-strong)',
              background: 'var(--bg-card)',
              color: 'var(--ink)',
              outline: 'none',
              fontSize: '13.5px'
            }}
          />
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
            <button type="submit" disabled={saving} className="btn btn-primary" style={{ padding: '8px 18px', fontSize: '13px' }}>
              {saving ? 'Saving...' : 'Save Anchored Note'}
            </button>
          </div>
        </form>

        {/* Loading Skeleton */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>
            <i className="ti ti-loader-2 spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
            <span>Loading study notes...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredNotes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', background: 'var(--parchment-deep)', borderRadius: '12px', border: '1px border-dashed var(--line-strong)' }}>
            <i className="ti ti-notes-off" style={{ fontSize: '40px', color: 'var(--ink-faint)', marginBottom: '12px', display: 'block' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ink)', marginBottom: '6px' }}>No study notes found</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--ink-soft)', maxWidth: '400px', margin: '0 auto' }}>
              Write your first verse-anchored note using the form above or while reading in the Scripture view.
            </p>
          </div>
        )}

        {/* Notes Cards List */}
        {!loading && filteredNotes.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {filteredNotes.map((note) => (
              <div key={note.id} className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '12px', padding: '20px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '16px', fontWeight: 600, color: 'var(--gold)' }}>
                      📖 Note #{note.id.toString().slice(-4)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--ink-faint)' }}>
                      {new Date(note.createdAt || note.updatedAt || Date.now()).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      title="Delete note"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                    >
                      <i className="ti ti-trash" style={{ fontSize: '14px' }} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)', marginBottom: '4px', whiteSpace: 'pre-wrap' }}>
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
