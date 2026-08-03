import React, { useState, useEffect } from 'react';
import { subscribeQueueStatus, triggerQueueSync } from '../services/offlineQueue';

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

  const [networkStatus, setNetworkStatus] = useState({ isOnline: true, queuedCount: 0 });

  useEffect(() => {
    const unsubscribe = subscribeQueueStatus((status) => {
      setNetworkStatus(status);
    });
    return unsubscribe;
  }, []);

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

          {/* Sync / Offline Network Indicator Badge */}
          {!networkStatus.isOnline ? (
            <span
              style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '10px',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '8px'
              }}
              title="Working offline. Writes are saved locally and will sync when reconnected."
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></span>
              Offline {networkStatus.queuedCount > 0 && `(${networkStatus.queuedCount})`}
            </span>
          ) : networkStatus.queuedCount > 0 ? (
            <button
              onClick={triggerQueueSync}
              style={{
                fontSize: '0.7rem',
                padding: '2px 6px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                color: '#f59e0b',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                marginLeft: '8px',
                cursor: 'pointer'
              }}
              title="Click to sync queued offline changes"
            >
              <i className="ti ti-refresh" style={{ fontSize: '10px' }} />
              Syncing ({networkStatus.queuedCount})
            </button>
          ) : null}
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
