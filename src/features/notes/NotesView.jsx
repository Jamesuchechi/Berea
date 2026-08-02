import React from 'react';

export default function NotesView() {
  return (
    <main class="reader">
      <div class="reader-inner">
        <h2 style={{ marginBottom: '18px' }}>Your Study Notes</h2>
        <div class="card" style={{ marginBottom: '14px' }}>
          <div class="ref-eyebrow">John 3:16 · ESV</div>
          <p style={{ fontSize: '14px', lineHeight: 1.6 }}>
            "Nicodemus night visitor context — compare with Serpent in Wilderness (Numbers 21)."
          </p>
        </div>
      </div>
    </main>
  );
}
