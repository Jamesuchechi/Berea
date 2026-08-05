import { supabase } from '../lib/supabase';
import { GENEALOGY_DATA, TIMELINE_DATA, MAP_LOCATIONS_DATA, CROSS_REF_NETWORK_DATA } from '../data/diagramData';

/**
 * Diagram & Interactive Visualizations Service
 *
 * Drives genealogy trees, visual timelines, Leaflet/SVG interactive maps,
 * and cross-reference network graphs from database rows or local datasets.
 */

export async function fetchDiagramDefinitions(typeFilter = 'All') {
  try {
    let query = supabase.from('diagram_definition').select('*').eq('is_public', true);

    if (typeFilter !== 'All') {
      const typeMap = {
        'Genealogy': 'lineage',
        'Timeline': 'timeline',
        'Map': 'map',
        'Network': 'network',
      };
      if (typeMap[typeFilter]) {
        query = query.eq('type', typeMap[typeFilter]);
      }
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getLocalDiagramDefinitions(typeFilter);
    }

    return data.map(d => ({
      id: d.id,
      slug: d.slug,
      type: d.type,
      title: d.title,
      description: d.description,
      data: d.data,
    }));
  } catch {
    return getLocalDiagramDefinitions(typeFilter);
  }
}

export async function getDiagramBySlug(slug) {
  try {
    const { data, error } = await supabase
      .from('diagram_definition')
      .select('*')
      .eq('slug', slug)
      .single();

    if (!error && data) return data;
  } catch {}

  // Fallback match
  if (slug === 'genealogy') return { type: 'lineage', title: GENEALOGY_DATA.title, data: GENEALOGY_DATA };
  if (slug === 'timeline') return { type: 'timeline', title: 'Chronological Timeline', data: TIMELINE_DATA };
  if (slug === 'map') return { type: 'map', title: MAP_LOCATIONS_DATA.title, data: MAP_LOCATIONS_DATA };
  if (slug === 'cross_ref') return { type: 'network', title: CROSS_REF_NETWORK_DATA.title, data: CROSS_REF_NETWORK_DATA };

  return { type: 'lineage', title: GENEALOGY_DATA.title, data: GENEALOGY_DATA };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLocalDiagramDefinitions(filter) {
  const all = [
    { id: 'diag_1', slug: 'genealogy', type: 'lineage', title: 'Patriarchal & Davidic Lineage Tree', description: 'Interactive node-link graph from Abraham to King David and Christ.', data: GENEALOGY_DATA },
    { id: 'diag_2', slug: 'timeline', type: 'timeline', title: 'Scripture & Church Chronology', description: 'Visual horizontal timeline scrubber covering 2000 BCE to 100 CE.', data: TIMELINE_DATA },
    { id: 'diag_3', slug: 'map', type: 'map', title: 'Sacred Near East & Mediterranean Map', description: 'Interactive map rendering coordinates & polylines for Tobit and Paul’s journeys.', data: MAP_LOCATIONS_DATA },
    { id: 'diag_4', slug: 'cross_ref', type: 'network', title: 'Treasury of Scripture Cross-Reference Graph', description: 'Verse-to-verse relationship graph connecting Canonical & Deuterocanonical texts.', data: CROSS_REF_NETWORK_DATA },
  ];

  if (filter === 'All') return all;
  if (filter === 'Genealogy') return all.filter(d => d.type === 'lineage');
  if (filter === 'Timeline') return all.filter(d => d.type === 'timeline');
  if (filter === 'Map') return all.filter(d => d.type === 'map');
  if (filter === 'Network') return all.filter(d => d.type === 'network');
  return all;
}
