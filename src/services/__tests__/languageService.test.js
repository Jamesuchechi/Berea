import { describe, it, expect } from 'vitest';
import { getInterlinearPassage, getLexiconEntry, isHebrewBook } from '../languageService';

describe('languageService', () => {
  it('should resolve NT Greek interlinear passage for John 3:16 with LTR direction', async () => {
    const passage = await getInterlinearPassage('john', 3, 16);
    expect(passage).toBeDefined();
    expect(passage.language).toContain('Greek');
    expect(passage.direction).toBe('ltr');
    expect(passage.words.length).toBeGreaterThan(0);
    expect(passage.words[0].original).toBe('Οὕτως');
    expect(passage.words[0].strongsId).toBe('G3779');
  });

  it('should resolve OT Hebrew interlinear passage for Genesis 1:1 with RTL direction', async () => {
    const passage = await getInterlinearPassage('genesis', 1, 1);
    expect(passage).toBeDefined();
    expect(passage.language).toContain('Hebrew');
    expect(passage.direction).toBe('rtl');
    expect(passage.words.length).toBeGreaterThan(0);
    expect(passage.words[0].original).toBe('בְּרֵאשִׁית');
    expect(passage.words[0].strongsId).toBe('H7225');
  });

  it('should fetch Strongs G3779 lexicon dictionary entry', async () => {
    const entry = await getLexiconEntry('G3779');
    expect(entry).toBeDefined();
    expect(entry.strongsId).toBe('G3779');
    expect(entry.language).toBe('greek');
    expect(entry.shortDef).toContain('thus, so');
  });

  it('should fetch Strongs H7225 lexicon dictionary entry', async () => {
    const entry = await getLexiconEntry('H7225');
    expect(entry).toBeDefined();
    expect(entry.strongsId).toBe('H7225');
    expect(entry.language).toBe('hebrew');
    expect(entry.shortDef).toContain('beginning');
  });

  it('should identify OT Hebrew books correctly', () => {
    expect(isHebrewBook('genesis')).toBe(true);
    expect(isHebrewBook('psalms')).toBe(true);
    expect(isHebrewBook('john')).toBe(false);
    expect(isHebrewBook('matthew')).toBe(false);
  });
});
