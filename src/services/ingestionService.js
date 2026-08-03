import { supabase } from '../lib/supabase';

/**
 * Repeatable Content Ingestion Pipeline & QA Validation Service
 *
 * Source File / Raw Text -> Parser -> Chapter & Verse Segmentation -> QA Check -> Supabase Insertion
 */

// Expected Reference Counts for Beyond-Canon texts QA
const KNOWN_CHAPTER_COUNTS = {
  didache: 16,
  tobit: 14,
  judith: 16,
  wisdom_of_solomon: 19,
  sirach: 51,
  baruch: 6,
  '1_maccabees': 16,
  '2_maccabees': 15,
  '1_enoch': 108,
  jubilees: 50,
  '1_clement': 65,
  shepherd_of_hermas: 114,
};

/**
 * Parses raw text into structured chapter and verse objects.
 * Format expected: "Chapter 1\n1. In the beginning...\n2. And God..." or "1:1 In..."
 */
export function parseRawText(rawText) {
  if (!rawText || typeof rawText !== 'string') {
    return { chapters: [], totalVerses: 0, error: 'Invalid or empty raw text input' };
  }

  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const chapters = [];
  let currentChapter = null;
  let totalVerses = 0;

  for (const line of lines) {
    // Detect Chapter Heading (e.g. "Chapter 1", "CHAPTER 2", "Chapter I")
    const chapterMatch = line.match(/^chapter\s+([0-9]+)/i);
    if (chapterMatch) {
      const chNum = parseInt(chapterMatch[1], 10);
      currentChapter = { chapter: chNum, verses: [] };
      chapters.push(currentChapter);
      continue;
    }

    if (!currentChapter) {
      currentChapter = { chapter: 1, verses: [] };
      chapters.push(currentChapter);
    }

    // Detect Verse Number (e.g. "1. Verse text...", "[1] Verse text...", "1:1 Verse text...")
    const verseMatch = line.match(/^(?:(?:[0-9]+:)?([0-9]+)[\.\s\]\:]|\[([0-9]+)\])\s*(.+)/);
    if (verseMatch) {
      const verseNum = parseInt(verseMatch[1] || verseMatch[2], 10);
      const text = verseMatch[3].trim();
      currentChapter.verses.push({ verseNumber: verseNum, text });
      totalVerses++;
    } else if (currentChapter.verses.length > 0) {
      // Append multi-line verse text to previous verse
      currentChapter.verses[currentChapter.verses.length - 1].text += ` ${line}`;
    }
  }

  return {
    chapters,
    totalVerses,
    error: null,
  };
}

/**
 * Automated QA Check comparing ingested chapter counts against reference standards
 */
export function runIngestionQACheck(bookSlug, parsedChapters) {
  const expectedChapters = KNOWN_CHAPTER_COUNTS[bookSlug];
  const actualCount = parsedChapters.length;

  const warnings = [];
  let isPass = true;

  if (expectedChapters && actualCount !== expectedChapters) {
    warnings.push(`Chapter count mismatch for ${bookSlug}: Ingested ${actualCount} chapters, expected ${expectedChapters}.`);
    isPass = false;
  }

  // Check for empty chapters
  parsedChapters.forEach(ch => {
    if (!ch.verses || ch.verses.length === 0) {
      warnings.push(`Chapter ${ch.chapter} has 0 verses.`);
      isPass = false;
    }
  });

  return {
    isPass,
    expectedChapters: expectedChapters || null,
    actualChapters: actualCount,
    warnings,
  };
}

/**
 * Ingest validated text payload into Supabase database (book, translation, verse)
 */
export async function ingestTextToSupabase({ bookSlug, translationCode = 'ENG', source, attribution, rawText }) {
  const parsed = parseRawText(rawText);
  if (parsed.error) return { success: false, error: parsed.error };

  const qa = runIngestionQACheck(bookSlug, parsed.chapters);

  try {
    const { data: book, error: bookErr } = await supabase
      .from('book')
      .select('id')
      .eq('slug', bookSlug)
      .single();

    if (bookErr || !book) {
      return { success: false, error: `Book '${bookSlug}' not found in database migration.` };
    }

    // Insert translation record
    const { data: translation, error: transErr } = await supabase
      .from('translation')
      .upsert({
        book_id: book.id,
        code: translationCode,
        source: source || 'Public Domain',
        attribution: attribution || 'Public Domain Translation',
        license: 'public_domain',
      })
      .select()
      .single();

    if (transErr) return { success: false, error: transErr.message };

    // Insert verse rows
    const verseRows = [];
    parsed.chapters.forEach(ch => {
      ch.verses.forEach(v => {
        verseRows.push({
          translation_id: translation.id,
          chapter: ch.chapter,
          verse_number: v.verseNumber,
          text: v.text,
        });
      });
    });

    if (verseRows.length > 0) {
      const { error: verseErr } = await supabase.from('verse').upsert(verseRows);
      if (verseErr) return { success: false, error: verseErr.message };
    }

    return {
      success: true,
      qa,
      totalChapters: parsed.chapters.length,
      totalVerses: parsed.totalVerses,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
