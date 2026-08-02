import React from 'react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  tradition,
  sidebarOpen,
  setSidebarOpen
}) {
  const navItems = [
    { id: 'read', label: 'Read', icon: 'ti-book-2' },
    { id: 'beyond', label: 'Beyond canon', icon: 'ti-scroll' },
    { id: 'diagrams', label: 'Diagrams', icon: 'ti-sitemap' },
    { id: 'plans', label: 'Reading plans', icon: 'ti-calendar' },
    { id: 'notes', label: 'Notes', icon: 'ti-notes' },
    { id: 'search', label: 'Search', icon: 'ti-search' }
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    setSidebarOpen(false);
  };

  return (
    <nav class={`sidebar ${sidebarOpen ? 'open' : ''}`}>
      <div class="nav-group">
        <div class="nav-label">Study</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            class={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => handleSelectTab(item.id)}
          >
            <i class={`ti ${item.icon}`}></i>
            {item.label}
          </button>
        ))}
        <div class="canon-note">viewing: {tradition} lens</div>
      </div>
      <div class="nav-group">
        <button class="nav-item" onClick={() => handleSelectTab('settings')}>
          <i class="ti ti-settings"></i>Settings
        </button>
      </div>
    </nav>
  );
}
