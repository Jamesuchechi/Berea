import React, { useState, useEffect } from 'react';

export default function AccessibilitySettingsView({ theme = 'light', setTheme }) {
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('berea_font_size') || '18px');
  const [dyslexicFont, setDyslexicFont] = useState(() => localStorage.getItem('berea_dyslexic') === 'true');
  const [readingStreak, setReadingStreak] = useState(7);

  useEffect(() => {
    document.documentElement.style.setProperty('--user-reader-font-size', fontSize);
    localStorage.setItem('berea_font_size', fontSize);
  }, [fontSize]);

  useEffect(() => {
    if (dyslexicFont) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
    localStorage.setItem('berea_dyslexic', dyslexicFont);
  }, [dyslexicFont]);

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '720px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Phase 5 • Settings & Accessibility
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Accessibility & Habit Settings
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Customize font sizing, reading modes, theme, and habit notifications.
          </p>
        </div>

        {/* 1. Theme & Appearance Control */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎨 Appearance & Theme Mode
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '15px' }}>App Theme Mode</strong>
              <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Switch between Light Parchment and Dark Forest themes.</span>
            </div>

            <button
              className={`theme-switch ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
            >
              <span className="theme-switch-track">
                <span className="theme-switch-icon sun"><i className="ti ti-sun"></i></span>
                <span className="theme-switch-icon moon"><i className="ti ti-moon"></i></span>
                <span className="theme-switch-thumb"></span>
              </span>
            </button>
          </div>
        </div>

        {/* 2. Reader Typography & Font Sizing */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📖 Reader Typography & Sizing
          </h3>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', color: 'var(--ink)' }}>
              <strong>Adjustable Scripture Font Size:</strong>
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{fontSize}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['14px', '16px', '18px', '22px', '26px'].map(size => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--line-strong)',
                    background: fontSize === size ? 'var(--moss)' : 'var(--parchment-deep)',
                    color: fontSize === size ? '#fff' : 'var(--ink)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '15px' }}>Dyslexia-Friendly Font</strong>
              <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Applies OpenDyslexic specialized font spacing.</span>
            </div>

            <button
              onClick={() => setDyslexicFont(!dyslexicFont)}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                border: 'none',
                background: dyslexicFont ? 'var(--moss)' : 'var(--line-strong)',
                color: dyslexicFont ? '#fff' : 'var(--ink)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {dyslexicFont ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* 3. Habit Tracking & Streak Stats */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔥 Habit Tracking & Reading Streaks
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--parchment-deep)', padding: '16px', borderRadius: '10px' }}>
            <div>
              <strong style={{ fontSize: '20px', color: 'var(--gold)' }}>🔥 {readingStreak} Consecutive Days</strong>
              <p style={{ fontSize: '13px', color: 'var(--ink-soft)', marginTop: '2px' }}>
                You have met your daily scripture reading goal 7 days in a row!
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
