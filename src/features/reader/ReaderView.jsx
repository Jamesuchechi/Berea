import React from 'react';

export default function ReaderView({ translation, tradition }) {
  return (
    <main class="reader">
      <div class="reader-inner">
        <div class="ref-eyebrow">
          {translation} · John 3 · New Testament ({tradition} canon view)
        </div>
        <p class="verse">
          <span class="vnum">14</span>And as Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,
          <span class="vnum">15</span>that whoever believes in him may have eternal life.
          <span class="vnum">16</span>For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.
          <span class="vnum">17</span>For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him.
        </p>
        <div class="verse-actions">
          <button class="tag-btn"><i class="ti ti-highlight"></i>Highlight</button>
          <button class="tag-btn"><i class="ti ti-notes"></i>Add note</button>
          <button class="tag-btn"><i class="ti ti-player-play"></i>Listen</button>
          <button class="tag-btn"><i class="ti ti-git-branch"></i>Cross-refs</button>
        </div>
      </div>
    </main>
  );
}
