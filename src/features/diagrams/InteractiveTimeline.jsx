import React, { useState } from 'react';

export default function InteractiveTimeline({ timelineData }) {
  const [selectedEra, setSelectedEra] = useState('All');
  const [activeEvent, setActiveEvent] = useState(timelineData?.[0] || null);

  if (!timelineData || timelineData.length === 0) return null;

  const eras = ['All', 'Patriarchal', 'Kingdom', 'Exile', 'Deuterocanonical', 'Apostolic'];

  const filteredEvents = timelineData.filter(e => selectedEra === 'All' || e.era === selectedEra);

  return (
    <div style={{ background: 'var(--parchment-deep)', border: '1px solid var(--line-strong)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
            INTERACTIVE SCRIPTURE CHRONOLOGY
          </span>
          <h3 style={{ fontSize: '20px', color: 'var(--ink)', fontWeight: 600 }}>Visual Timeline Scrubber</h3>
        </div>

        {/* Era Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {eras.map(era => (
            <button
              key={era}
              onClick={() => setSelectedEra(era)}
              style={{
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '11.5px',
                fontWeight: 600,
                border: '1px solid var(--line-strong)',
                background: selectedEra === era ? 'var(--moss)' : 'var(--bg-card)',
                color: selectedEra === era ? '#fff' : 'var(--ink)',
                cursor: 'pointer'
              }}
            >
              {era}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline Axis Bar */}
      <div style={{ position: 'relative', padding: '30px 10px 10px', background: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--line)', marginBottom: '20px' }}>
        <div style={{ height: '4px', background: 'var(--gold)', borderRadius: '999px', position: 'relative', margin: '20px 10px' }}>
          {filteredEvents.map((ev, idx) => {
            const isSelected = activeEvent?.id === ev.id;
            const pct = Math.min(95, Math.max(5, (idx / Math.max(1, filteredEvents.length - 1)) * 90 + 5));

            return (
              <div
                key={ev.id}
                onClick={() => setActiveEvent(ev)}
                style={{
                  position: 'absolute',
                  left: `${pct}%`,
                  top: '-10px',
                  transform: 'translateX(-50%)',
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                <div
                  style={{
                    width: isSelected ? '24px' : '16px',
                    height: isSelected ? '24px' : '16px',
                    borderRadius: '50%',
                    background: isSelected ? 'var(--gold)' : 'var(--moss)',
                    border: '3px solid var(--bg-card)',
                    margin: '0 auto',
                    transition: 'all 0.2s ease',
                    boxShadow: isSelected ? '0 0 10px rgba(184,134,59,0.5)' : 'none'
                  }}
                />
                <span style={{ fontSize: '10.5px', color: isSelected ? 'var(--gold)' : 'var(--ink-soft)', fontWeight: isSelected ? 700 : 500, display: 'block', marginTop: '6px' }}>
                  {ev.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Event Card Detail */}
      {activeEvent && (
        <div style={{ background: 'var(--parchment-deep)', border: '1px solid var(--gold)', borderRadius: '12px', padding: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
            <h4 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600 }}>
              ⏳ {activeEvent.title}
            </h4>
            <span style={{ fontSize: '12px', background: 'var(--gold)', color: '#2B2420', padding: '2px 10px', borderRadius: '4px', fontWeight: 700 }}>
              {activeEvent.label}
            </span>
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--ink)' }}>
            {activeEvent.summary}
          </p>
        </div>
      )}
    </div>
  );
}
