import { describe, it, expect } from 'vitest';
import { parseScriptureReference } from '../referenceParser';
import { performUnifiedSearch } from '../searchService';

describe('referenceParser', () => {
  it('should parse canonical references like John 3:16', () => {
    const result = parseScriptureReference('John 3:16');
    expect(result.isReference).toBe(true);
    expect(result.bookSlug).toBe('john');
    expect(result.chapter).toBe(3);
    expect(result.verseStart).toBe(16);
  });

  it('should parse book abbreviations like Jn 3:16-18', () => {
    const result = parseScriptureReference('Jn 3:16-18');
    expect(result.isReference).toBe(true);
    expect(result.bookSlug).toBe('john');
    expect(result.chapter).toBe(3);
    expect(result.verseStart).toBe(16);
    expect(result.verseEnd).toBe(18);
  });

  it('should parse deuterocanon references like Tobit 1:3 or Tob 1:3', () => {
    const result = parseScriptureReference('Tob 1:3');
    expect(result.isReference).toBe(true);
    expect(result.bookSlug).toBe('tobit');
    expect(result.chapter).toBe(1);
    expect(result.verseStart).toBe(3);
  });

  it('should return isReference false for non-reference keyword queries', () => {
    const result = parseScriptureReference('eternal life in christ');
    expect(result.isReference).toBe(false);
  });
});

describe('searchService', () => {
  it('should return matching results for keyword queries', async () => {
    const searchRes = await performUnifiedSearch('eternal life');
    expect(searchRes.results.length).toBeGreaterThan(0);
    expect(searchRes.totalCount).toBeGreaterThan(0);
  });

  it('should attach referenceMatch when reference query is passed', async () => {
    const searchRes = await performUnifiedSearch('John 3:16');
    expect(searchRes.referenceMatch).not.toBeNull();
    expect(searchRes.referenceMatch.bookTitle).toBe('John');
  });
});
