import React, { useState, useEffect } from 'react';
import { fetchDiagramDefinitions } from '../../services/diagramService';
import GenealogyGraph from './GenealogyGraph';
import InteractiveTimeline from './InteractiveTimeline';
import BiblicalMap from './BiblicalMap';
import CrossReferenceGraph from './CrossReferenceGraph';

export default function DiagramsView() {
  const [activeTab, setActiveTab] = useState('All');
  const [diagrams, setDiagrams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchDiagramDefinitions(activeTab);
      setDiagrams(list);
    } catch (err) {
      setError('Failed to load diagram definitions. Using local dataset.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '820px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Data-Driven Interactive Visualizations
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Visual Diagrams, Timelines & Maps
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '6px' }}>
            Interactive SVG genealogy trees, visual timelines, Leaflet/SVG ancient maps, and cross-reference network graphs.
          </p>

          {/* Category Tab Switcher */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '20px' }}>
            {[
              { id: 'All', label: 'All Visualizations' },
              { id: 'Genealogy', label: '🌳 Genealogy Trees' },
              { id: 'Timeline', label: '⏳ Timelines' },
              { id: 'Map', label: '🗺️ Interactive Maps' },
              { id: 'Network', label: '🔗 Cross-Ref Network' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: '1px solid var(--line-strong)',
                  background: activeTab === tab.id ? 'var(--moss)' : 'var(--bg-card)',
                  color: activeTab === tab.id ? '#fff' : 'var(--ink)',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {error}</span>
            <button onClick={loadData} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
              Retry
            </button>
          </div>
        )}

        {/* Loading Indicator */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ink-soft)' }}>
            <i className="ti ti-loader-2 spin" style={{ fontSize: '28px', display: 'block', marginBottom: '12px' }} />
            <span>Loading interactive diagram graphs & maps...</span>
          </div>
        )}

        {/* Interactive Diagram Views */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {diagrams.map(diag => {
              if (diag.type === 'lineage') {
                return <GenealogyGraph key={diag.id} graphData={diag.data} />;
              }
              if (diag.type === 'timeline') {
                return <InteractiveTimeline key={diag.id} timelineData={diag.data} />;
              }
              if (diag.type === 'map') {
                return <BiblicalMap key={diag.id} mapData={diag.data} />;
              }
              if (diag.type === 'network') {
                return <CrossReferenceGraph key={diag.id} networkData={diag.data} />;
              }
              return null;
            })}
          </div>
        )}

      </div>
    </main>
  );
}
