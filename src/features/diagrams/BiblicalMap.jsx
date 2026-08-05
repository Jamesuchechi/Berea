import React, { useState } from 'react';

export default function BiblicalMap({ mapData }) {
  const [selectedLoc, setSelectedLoc] = useState(mapData?.locations?.[0] || null);
  const [activeRoute, setActiveRoute] = useState(mapData?.routes?.[0] || null);

  if (!mapData || !mapData.locations) return null;

  const locations = mapData.locations;
  const routes = mapData.routes || [];

  return (
    <div style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
            INTERACTIVE ANCIENT GEOGRAPHY & JOURNEYS
          </span>
          <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600 }}>{mapData.title}</h3>
        </div>

        {/* Route Selector */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {routes.map(r => (
            <button
              key={r.id}
              onClick={() => setActiveRoute(r)}
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11.5px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: activeRoute?.id === r.id ? r.color : 'var(--bg-card)',
                color: activeRoute?.id === r.id ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              📍 {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* SVG Map Canvas with Coordinate Plotting */}
      <div style={{ position: 'relative', overflowX: 'auto', padding: '16px', background: '#eef2f5', borderRadius: '14px', border: '1.5px solid var(--line-strong)' }}>
        <svg width="680" height="260" style={{ display: 'block', margin: '0 auto', background: '#d4e6f1', borderRadius: '10px' }}>
          {/* Ancient Coastlines & Sea Decor */}
          <rect x="0" y="0" width="680" height="260" fill="#d4e6f1" />
          <path d="M 50 20 Q 200 120 400 60 T 680 180 L 680 260 L 0 260 Z" fill="#e8f8f5" opacity="0.6" />

          {/* Route Polylines */}
          {activeRoute && (
            <polyline
              points={activeRoute.path.map(p => {
                // Map lat/long to SVG canvas x/y
                const x = Math.min(640, Math.max(40, (p.lng - 10) * 14 + 100));
                const y = Math.min(240, Math.max(20, (45 - p.lat) * 12 + 20));
                return `${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke={activeRoute.color}
              strokeWidth="3.5"
              strokeDasharray="6 3"
            />
          )}

          {/* Location Pins */}
          {locations.map((loc) => {
            const x = Math.min(640, Math.max(40, (loc.lng - 10) * 14 + 100));
            const y = Math.min(240, Math.max(20, (45 - loc.lat) * 12 + 20));
            const isSelected = selectedLoc?.id === loc.id;

            return (
              <g key={loc.id} onClick={() => setSelectedLoc(loc)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? '14' : '9'}
                  fill={isSelected ? 'var(--gold)' : 'var(--moss)'}
                  stroke="#fff"
                  strokeWidth="2"
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight={isSelected ? '700' : '600'}
                  fill="#2B2420"
                >
                  📍 {loc.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Location Popup Info */}
      {selectedLoc && (
        <div style={{ marginTop: '20px', background: 'var(--parchment-deep)', border: '1px solid var(--gold)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
            <h4 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600 }}>
              🗺️ {selectedLoc.name}
            </h4>
            <span style={{ fontSize: '12px', color: 'var(--gold)', fontWeight: 600 }}>
              GPS: {selectedLoc.lat.toFixed(2)}° N, {selectedLoc.lng.toFixed(2)}° E
            </span>
          </div>

          <div style={{ fontSize: '12px', background: 'var(--moss)', color: '#fff', padding: '2px 8px', borderRadius: '4px', display: 'inline-block', fontWeight: 600, marginBottom: '8px' }}>
            {selectedLoc.era}
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)' }}>
            {selectedLoc.details}
          </p>
        </div>
      )}
    </div>
  );
}
