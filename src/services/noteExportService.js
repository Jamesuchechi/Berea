import { parseScriptureReference } from './referenceParser';

/**
 * Study Notes Auto-Linking, Tagging & Export Service
 */

/**
 * Detect verse reference patterns in note text
 * e.g. "Loved reading John 3:16 today and comparing with Tobit 1:3."
 */
export function detectVerseLinksInNoteText(text) {
  if (!text || typeof text !== 'string') return [];

  // Match scripture reference strings: "John 3:16", "1 John 1:9", "Tobit 1:3", "1 En 1:9"
  const regex = /\b(?:[1-3]\s+)?[A-Za-z]+\s+[0-9]+:[0-9]+(?:-[0-9]+)?\b/g;
  const matches = text.match(regex) || [];

  const links = [];
  matches.forEach(refStr => {
    const parsed = parseScriptureReference(refStr);
    if (parsed.isReference) {
      links.push({
        rawText: refStr,
        bookTitle: parsed.bookTitle,
        chapter: parsed.chapter,
        verse: parsed.startVerse,
      });
    }
  });

  return links;
}

/**
 * Format notes array into Markdown string
 */
export function exportNotesToMarkdown(notes = [], highlights = []) {
  let md = `# Berea Christian Study App — Exported Notes & Highlights\n`;
  md += `*Exported on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*\n\n---\n\n`;

  md += `## 📝 User Study Notes (${notes.length})\n\n`;

  if (notes.length === 0) {
    md += `*No study notes found.*\n\n`;
  } else {
    notes.forEach((note, idx) => {
      md += `### ${idx + 1}. Note on ${note.bookTitle || note.book_slug || 'Passage'} ${note.chapter}:${note.verseNumber || note.verse_number}\n`;
      md += `**Date:** ${note.created_at ? new Date(note.created_at).toLocaleDateString() : 'N/A'}\n`;
      if (note.tags && note.tags.length > 0) {
        md += `**Tags:** \`${note.tags.join('`, `')}\`  \n`;
      }
      md += `\n> ${note.content}\n\n`;

      const links = detectVerseLinksInNoteText(note.content);
      if (links.length > 0) {
        md += `*Linked Verses:* ${links.map(l => `[${l.rawText}](#)`).join(', ')}\n\n`;
      }
      md += `---\n\n`;
    });
  }

  md += `## 🖍️ Scripture Highlights (${highlights.length})\n\n`;
  if (highlights.length === 0) {
    md += `*No highlights found.*\n\n`;
  } else {
    highlights.forEach((h, idx) => {
      md += `${idx + 1}. **${h.bookTitle || h.book_slug} ${h.chapter}:${h.verseNumber || h.verse_number}** (Color: ${h.color || 'yellow'})\n`;
    });
  }

  return md;
}

/**
 * Format notes array into JSON backup string
 */
export function exportNotesToJSON(notes = [], highlights = []) {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    notes,
    highlights,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Browser file download helper
 */
export function downloadFile(content, filename, contentType = 'text/plain') {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
