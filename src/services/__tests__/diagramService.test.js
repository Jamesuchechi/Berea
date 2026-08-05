import { describe, it, expect } from 'vitest';
import { fetchDiagramDefinitions, getDiagramBySlug } from '../diagramService';

describe('diagramService', () => {
  it('should fetch diagram definitions with default fallback list', async () => {
    const list = await fetchDiagramDefinitions('All');
    expect(list.length).toBeGreaterThan(0);
    expect(list.some(d => d.type === 'lineage')).toBe(true);
    expect(list.some(d => d.type === 'map')).toBe(true);
  });

  it('should filter diagram definitions by type', async () => {
    const mapsOnly = await fetchDiagramDefinitions('Map');
    expect(mapsOnly.every(d => d.type === 'map')).toBe(true);
  });

  it('should fetch diagram definition by slug', async () => {
    const diag = await getDiagramBySlug('genealogy');
    expect(diag).not.toBeNull();
    expect(diag.type).toBe('lineage');
    expect(diag.data.nodes.length).toBeGreaterThan(0);
  });
});
