import { describe, it, expect } from 'vitest';
import { calculateSM2NextReview, isItemDueForReview } from '../sm2Algorithm';
import { calculateCatchUpSchedule } from '../readingPlanService';
import { detectVerseLinksInNoteText, exportNotesToMarkdown, exportNotesToJSON } from '../noteExportService';

describe('sm2Algorithm', () => {
  it('should reset repetitions and interval when quality is low (<3)', () => {
    const result = calculateSM2NextReview({ quality: 1, repetitions: 4, intervalDays: 10, easeFactor: 2.5 });
    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBeLessThan(2.5);
  });

  it('should increase repetitions and interval when quality is high (>=3)', () => {
    const result = calculateSM2NextReview({ quality: 4, repetitions: 2, intervalDays: 6, easeFactor: 2.5 });
    expect(result.repetitions).toBe(3);
    expect(result.intervalDays).toBe(15);
    expect(result.easeFactor).toBeGreaterThan(2.4);
  });

  it('should correctly evaluate due review dates', () => {
    const pastDate = new Date(Date.now() - 10000).toISOString();
    expect(isItemDueForReview(pastDate)).toBe(true);

    const futureDate = new Date(Date.now() + 1000000).toISOString();
    expect(isItemDueForReview(futureDate)).toBe(false);
  });
});

describe('readingPlanService', () => {
  it('should calculate catch-up schedule when user is behind', () => {
    const catchUp = calculateCatchUpSchedule(5, 30, [1, 2]); // Current day 5, completed days 1 & 2 -> 2 days behind
    expect(catchUp.isBehind).toBe(true);
    expect(catchUp.missedCount).toBe(2);
    expect(catchUp.recommendedDailyReadings).toBeGreaterThan(1);
  });

  it('should report on-track when user is not behind', () => {
    const catchUp = calculateCatchUpSchedule(3, 30, [1, 2]); // Current day 3, completed days 1 & 2 -> on track
    expect(catchUp.isBehind).toBe(false);
    expect(catchUp.missedCount).toBe(0);
  });
});

describe('noteExportService', () => {
  it('should detect scripture reference links inside note text', () => {
    const noteText = 'Studying John 3:16 along with Tobit 1:3 today.';
    const links = detectVerseLinksInNoteText(noteText);
    expect(links.length).toBe(2);
    expect(links[0].rawText).toContain('John 3:16');
    expect(links[1].rawText).toContain('Tobit 1:3');
  });

  it('should format notes into Markdown string', () => {
    const sampleNotes = [
      { id: '1', bookTitle: 'John', chapter: 3, verseNumber: 16, content: 'For God so loved the world...' },
    ];
    const md = exportNotesToMarkdown(sampleNotes, []);
    expect(md).toContain('Berea Christian Study App');
    expect(md).toContain('John 3:16');
  });

  it('should format notes into JSON backup string', () => {
    const sampleNotes = [{ id: '1', content: 'Test note' }];
    const jsonStr = exportNotesToJSON(sampleNotes, []);
    const parsed = JSON.parse(jsonStr);
    expect(parsed.notes.length).toBe(1);
  });
});
