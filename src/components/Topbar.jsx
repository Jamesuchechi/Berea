import React from 'react';

export default function Topbar({
  theme = 'light',
  setTheme,
  translation,
  setTranslation,
  tradition,
  setTradition,
  sidebarOpen,
  setSidebarOpen,
  assistantOpen,
  setAssistantOpen,
  onNavigateLanding,
  onLogout,
  // Reader navigation
  currentBook = null,
  currentChapter = null,
  onOpenBookPicker = null
}) {
  const isDark = theme === 'dark';

  const bookLabel = currentBook ? currentBook.title : 'Select Book';
  const chapterLabel = currentChapter ? String(currentChapter) : '';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-btn hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open menu"
        >
          <i className="ti ti-menu-2" />
        </button>
        <div className="brand-container" onClick={onNavigateLanding} style={{ cursor: 'pointer' }}>
          <img src="/berea_logo.jpg" alt="Berea Logo" className="brand-logo-img" />
          <span className="brand">Berea</span>
        </div>

        {/* Live Breadcrumb — clickable to open book picker */}
        <button
          className="crumb"
          onClick={onOpenBookPicker}
          title="Change book & chapter"
          aria-label={`Currently reading ${bookLabel} ${chapterLabel}. Click to change.`}
          style={{
            background: 'none', border: 'none', cursor: onOpenBookPicker ? 'pointer' : 'default',
            padding: '4px 8px', borderRadius: '6px', fontFamily: 'inherit',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={e => { if (onOpenBookPicker) e.currentTarget.style.background = 'var(--parchment-deep)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
        >
          {bookLabel}
          {chapterLabel && (
            <> <b>{chapterLabel}</b></>
          )}
          {onOpenBookPicker && (
            <i className="ti ti-chevron-down" style={{ fontSize: '11px', marginLeft: '3px', opacity: 0.6 }} />
          )}
        </button>
      </div>

      <div className="topbar-mid">
        <select
          className="chip"
          aria-label="Bible Translation"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        >
          <option value="KJV">KJV</option>
          <option value="WEB">WEB</option>
          <option value="ASV">ASV</option>
          <option value="YLT">YLT</option>
          <option value="DARBY">Darby</option>
          <option value="NET">NET</option>
        </select>

        <select
          className="chip"
          aria-label="Tradition / Canon"
          value={tradition}
          onChange={(e) => setTradition(e.target.value)}
        >
          <option value="protestant">Protestant (66)</option>
          <option value="catholic">Catholic (73)</option>
          <option value="orthodox">Orthodox (76+)</option>
          <option value="ethiopian">Ethiopian (81+)</option>
        </select>

        {/* Theme Toggle */}
        <button
          className={`theme-switch ${isDark ? 'active' : ''}`}
          onClick={() => setTheme && setTheme(isDark ? 'light' : 'dark')}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          <span className="theme-switch-track">
            <span className="theme-switch-icon sun"><i className="ti ti-sun" /></span>
            <span className="theme-switch-icon moon"><i className="ti ti-moon" /></span>
            <span className="theme-switch-thumb" />
          </span>
        </button>
      </div>

      <div className="topbar-right">
        <button className="icon-btn" aria-label="Search">
          <i className="ti ti-search" />
        </button>
        <button
          className="icon-btn"
          onClick={() => setAssistantOpen(!assistantOpen)}
          aria-label="Toggle assistant"
        >
          <i className="ti ti-sparkles" />
        </button>
        <div className="avatar" title="Account">JU</div>
      </div>
    </header>
  );
}
