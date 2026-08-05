import React, { useState } from 'react';

export default function GenealogyGraph({ graphData }) {
  const [selectedNode, setSelectedNode] = useState(graphData?.nodes?.[0] || null);

  if (!graphData || !graphData.nodes) return null;

  const nodes = graphData.nodes;

  return (
    <div style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
            INTERACTIVE GENEALOGY TREE
          </span>
          <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600 }}>{graphData.title}</h3>
        </div>
        <span style={{ fontSize: '12px', background: 'var(--moss)', color: '#fff', padding: '3px 10px', borderRadius: '6px', fontWeight: 600 }}>
          🌳 {nodes.length} Lineage Nodes
        </span>
      </div>

      {/* SVG Tree Graph Canvas */}
      <div style={{ position: 'relative', overflowX: 'auto', padding: '20px 10px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--line)' }}>
        <svg width="680" height="220" style={{ display: 'block', margin: '0 auto' }}>
          {/* Connector Lines */}
          {nodes.map((node, idx) => {
            if (idx === 0) return null;
            const startX = 60 + (idx - 1) * 62;
            const startY = 110;
            const endX = 60 + idx * 62;
            const endY = 110;
            const isSelected = selectedNode?.id === node.id || selectedNode?.id === nodes[idx - 1]?.id;

            return (
              <line
                key={`line-${node.id}`}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={isSelected ? 'var(--gold)' : 'var(--line-strong)'}
                strokeWidth={isSelected ? '3' : '1.5'}
                strokeDasharray={isSelected ? 'none' : '4 2'}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node, idx) => {
            const cx = 60 + idx * 62;
            const cy = 110;
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? '18' : '14'}
                  fill={isSelected ? 'var(--gold)' : 'var(--parchment-deep)'}
                  stroke={isSelected ? 'var(--gold)' : 'var(--moss)'}
                  strokeWidth="2.5"
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text
                  x={cx}
                  y={cy + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill={isSelected ? '#fff' : 'var(--ink)'}
                >
                  {node.name.charAt(0)}
                </text>

                {/* Node Label Below */}
                <text
                  x={cx}
                  y={cy + 36}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontWeight={isSelected ? '700' : '500'}
                  fill={isSelected ? 'var(--gold)' : 'var(--ink)'}
                >
                  {node.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Person Detail Drawer */}
      {selectedNode && (
        <div style={{ marginTop: '20px', background: 'var(--parchment-deep)', border: '1px solid var(--gold)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h4 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600 }}>
              📜 {selectedNode.name}
            </h4>
            <span style={{ fontSize: '11px', background: 'var(--moss)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
              {selectedNode.era} Era
            </span>
          </div>
          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)' }}>
            {selectedNode.bio}
          </p>
        </div>
      )}
    </div>
  );
}
