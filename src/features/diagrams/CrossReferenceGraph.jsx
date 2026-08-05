import React, { useState } from 'react';

export default function CrossReferenceGraph({ networkData }) {
  const [selectedNode, setSelectedNode] = useState(networkData?.nodes?.[0] || null);

  if (!networkData || !networkData.nodes) return null;

  const nodes = networkData.nodes;
  const links = networkData.links || [];

  return (
    <div style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
            TREASURY OF SCRIPTURE KNOWLEDGE
          </span>
          <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600 }}>Cross-Reference Network Graph</h3>
        </div>
        <span style={{ fontSize: '12px', background: 'var(--moss)', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontWeight: 600 }}>
          🔗 {links.length} Connected Links
        </span>
      </div>

      {/* SVG Network Canvas */}
      <div style={{ position: 'relative', overflowX: 'auto', padding: '20px 10px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--line)' }}>
        <svg width="680" height="240" style={{ display: 'block', margin: '0 auto' }}>
          {/* Central Hub Lines */}
          {links.map((link, idx) => {
            const angle = (idx / links.length) * (2 * Math.PI);
            const cx = 340;
            const cy = 120;
            const targetX = cx + Math.cos(angle) * 160;
            const targetY = cy + Math.sin(angle) * 80;

            return (
              <line
                key={`link-${idx}`}
                x1={cx}
                y1={cy}
                x2={targetX}
                y2={targetY}
                stroke="var(--gold)"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
            );
          })}

          {/* Central Node (John 3:16) */}
          <g onClick={() => setSelectedNode(nodes[0])} style={{ cursor: 'pointer' }}>
            <circle cx="340" cy="120" r="26" fill="var(--gold)" stroke="#fff" strokeWidth="3" />
            <text x="340" y="124" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2B2420">
              Jn 3:16
            </text>
          </g>

          {/* Satellite Nodes */}
          {nodes.slice(1).map((node, idx) => {
            const angle = (idx / (nodes.length - 1)) * (2 * Math.PI);
            const cx = 340 + Math.cos(angle) * 160;
            const cy = 120 + Math.sin(angle) * 80;
            const isSelected = selectedNode?.id === node.id;

            return (
              <g key={node.id} onClick={() => setSelectedNode(node)} style={{ cursor: 'pointer' }}>
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '20' : '16'}
                  fill={node.group === 'deuterocanon' ? 'rgba(184, 134, 59, 0.2)' : node.group === 'early_church' ? 'rgba(245, 158, 11, 0.2)' : 'var(--parchment-deep)'}
                  stroke={isSelected ? 'var(--gold)' : 'var(--moss)'}
                  strokeWidth="2.5"
                />
                <text x={cx} y={cy + 4} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="var(--ink)">
                  {node.label.split(' ')[0]}
                </text>
                <text x={cx} y={cy + 32} textAnchor="middle" fontSize="10" fontWeight="600" fill="var(--gold)">
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div style={{ marginTop: '20px', background: 'var(--parchment-deep)', border: '1px solid var(--gold)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600 }}>
              📖 {selectedNode.label}
            </h4>
            <span style={{ fontSize: '11px', background: 'var(--moss)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600, textTransform: 'uppercase' }}>
              {selectedNode.group}
            </span>
          </div>

          <p style={{ fontSize: '14.5px', lineHeight: 1.65, color: 'var(--ink)' }}>
            "{selectedNode.text}"
          </p>
        </div>
      )}
    </div>
  );
}
