import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  tradition,
  sidebarOpen,
  setSidebarOpen
}) {
  const navItems = [
    { id: 'read', label: 'Scripture Reader', icon: 'ti-book-2' },
    { id: 'interlinear', label: 'Original Languages', icon: 'ti-language' },
    { id: 'beyond', label: 'Beyond Canon', icon: 'ti-scroll' },
    { id: 'memorize', label: 'Verse Memorization', icon: 'ti-brain' },
    { id: 'community', label: 'Community & Prayer', icon: 'ti-users' },
    { id: 'diagrams', label: 'Visual Diagrams', icon: 'ti-sitemap' },
    { id: 'plans', label: 'Reading Plans', icon: 'ti-calendar' },
    { id: 'notes', label: 'Journal & Notes', icon: 'ti-notes' },
    { id: 'search', label: 'Search Scripture', icon: 'ti-search' }
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div>
        {/* Sidebar Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px 18px', borderBottom: '1px solid var(--line)', marginBottom: '14px' }}>
          <img src="/berea_logo.png" alt="Berea Logo" style={{ width: '28px', height: '28px', borderRadius: '6px', border: '1px solid var(--line-strong)' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 600, color: 'var(--ink)' }}>
            Berea
          </span>
        </div>

        <div className="nav-group">
          <div className="nav-label">Study Workspace</div>
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => handleSelectTab(item.id)}
            >
              <i className={`ti ${item.icon}`}></i>
              {item.label}
            </button>
          ))}

          {/* Tradition Lens Info Card */}
          <div style={{ marginTop: '16px', background: 'var(--parchment-deep)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--line)' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--gold)', fontWeight: 700 }}>
              Active Tradition
            </div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--ink)', marginTop: '2px' }}>
              📜 {tradition.charAt(0).toUpperCase() + tradition.slice(1)} Canon
            </div>
          </div>
        </div>
      </div>

      <div className="nav-group">
        {/* Streak Badge */}
        <div style={{ background: 'rgba(184, 134, 59, 0.12)', border: '1px solid rgba(184, 134, 59, 0.3)', padding: '8px 12px', borderRadius: '8px', marginBottom: '10px', fontSize: '12px', color: 'var(--gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
          🔥 7-Day Study Streak
        </div>

        <button className="nav-item" onClick={() => handleSelectTab('settings')}>
          <i className="ti ti-settings"></i>Settings
        </button>
      </div>
    </nav>
  );
}
