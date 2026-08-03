import React, { useEffect, useState } from 'react';

export default function AppHydrationSplash({ onHydrated }) {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Initializing Berea Study Engine...');

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(50);
      setStatusText('Hydrating core canons & public-domain translations...');
    }, 400);

    const t2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Syncing local notes & tradition preferences...');
    }, 800);

    const t3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Ready');
      if (onHydrated) onHydrated();
    }, 1200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onHydrated]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--parchment)',
        color: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '24px'
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '380px', width: '100%' }}>
        <img
          src="/berea_logo.jpg"
          alt="Berea Logo"
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '16px',
            marginBottom: '20px',
            border: '2px solid var(--gold)',
            boxShadow: '0 8px 32px rgba(184, 134, 59, 0.25)',
            animation: 'pulse 2s infinite ease-in-out'
          }}
        />

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '26px', fontWeight: 600, color: 'var(--ink)', marginBottom: '8px' }}>
          Berea
        </h1>
        <p style={{ fontSize: '13.5px', color: 'var(--gold)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '28px', fontWeight: 600 }}>
          Scripture & History Workspace
        </p>

        {/* Progress Track */}
        <div style={{ width: '100%', height: '6px', background: 'var(--line-strong)', borderRadius: '999px', overflow: 'hidden', marginBottom: '14px' }}>
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--gold)',
              borderRadius: '999px',
              transition: 'width 0.4s ease-in-out'
            }}
          ></div>
        </div>

        <div style={{ fontSize: '12.5px', color: 'var(--ink-soft)', fontStyle: 'italic' }}>
          {statusText}
        </div>
      </div>
    </div>
  );
}
