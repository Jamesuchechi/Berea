import { describe, it, expect } from 'vitest';
import { parseRawText, runIngestionQACheck } from '../ingestionService';
import { resolveTraditionStatusBadge } from '../beyondCanonService';

describe('ingestionService', () => {
  it('should parse raw text into chapters and verses', () => {
    const rawSample = `
Chapter 1
1. First verse text.
2. Second verse text.
`;
    const parsed = parseRawText(rawSample);
    expect(parsed.chapters.length).toBe(1);
    expect(parsed.chapters[0].verses.length).toBe(2);
    expect(parsed.chapters[0].verses[0].text).toBe('First verse text.');
  });

  it('should run QA checks and flag chapter count mismatches', () => {
    const fakeChapters = [{ chapter: 1, verses: [{ verseNumber: 1, text: 'Sample' }] }];
    const qa = runIngestionQACheck('didache', fakeChapters);
    expect(qa.isPass).toBe(false);
    expect(qa.warnings.length).toBeGreaterThan(0);
  });
});

describe('beyondCanonService', () => {
  it('should resolve Tobit as Deuterocanon under Catholic lens and Apocrypha under Protestant lens', () => {
    const catholicBadge = resolveTraditionStatusBadge('tobit', 'catholic');
    expect(catholicBadge.isCanonical).toBe(true);
    expect(catholicBadge.label).toContain('Deuterocanonical');

    const protestantBadge = resolveTraditionStatusBadge('tobit', 'protestant');
    expect(protestantBadge.isCanonical).toBe(false);
    expect(protestantBadge.label).toContain('Apocrypha');
  });

  it('should resolve 1 Enoch as Canonical under Ethiopian lens', () => {
    const ethiopianBadge = resolveTraditionStatusBadge('1_enoch', 'ethiopian');
    expect(ethiopianBadge.isCanonical).toBe(true);
    expect(ethiopianBadge.label).toContain('Ethiopian');
  });
});
