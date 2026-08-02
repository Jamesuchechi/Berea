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
  onNavigateLanding
}) {
  const isDark = theme === 'dark';

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="icon-btn hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open menu"
        >
          <i className="ti ti-menu-2"></i>
        </button>
        <div className="brand-container" onClick={onNavigateLanding}>
          <img src="/berea_logo.png" alt="Berea Logo" className="brand-logo-img" />
          <span className="brand">Berea</span>
        </div>
        <div className="crumb">John <b>3</b></div>
      </div>
      <div className="topbar-mid">
        <select
          className="chip"
          aria-label="Translation"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        >
          <option value="ESV">ESV</option>
          <option value="KJV">KJV</option>
          <option value="WEB">WEB</option>
        </select>
        <select
          className="chip"
          aria-label="Tradition"
          value={tradition}
          onChange={(e) => setTradition(e.target.value)}
        >
          <option value="Protestant">Protestant</option>
          <option value="Catholic">Catholic</option>
          <option value="Orthodox">Orthodox</option>
          <option value="Ethiopian">Ethiopian</option>
        </select>

        {/* Interactive Theme Switcher Toggle */}
        <button
          className={`theme-switch ${isDark ? 'active' : ''}`}
          onClick={() => setTheme && setTheme(isDark ? 'light' : 'dark')}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle Theme"
        >
          <span className="theme-switch-track">
            <span className="theme-switch-icon sun"><i className="ti ti-sun"></i></span>
            <span className="theme-switch-icon moon"><i className="ti ti-moon"></i></span>
            <span className="theme-switch-thumb"></span>
          </span>
        </button>
      </div>
      <div className="topbar-right">
        <button className="icon-btn" aria-label="Search">
          <i className="ti ti-search"></i>
        </button>
        <button
          className="icon-btn"
          onClick={() => setAssistantOpen(!assistantOpen)}
          aria-label="Toggle assistant"
        >
          <i className="ti ti-sparkles"></i>
        </button>
        <div className="avatar" title="Account">JU</div>
      </div>
    </header>
  );
}
