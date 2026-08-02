import React from 'react';

export default function Topbar({
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
  return (
    <header class="topbar">
      <div class="topbar-left">
        <button
          class="icon-btn hamburger"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Open menu"
        >
          <i class="ti ti-menu-2"></i>
        </button>
        <div class="brand" onClick={onNavigateLanding}>Berea</div>
        <div class="crumb">John <b>3</b></div>
      </div>
      <div class="topbar-mid">
        <select
          class="chip"
          aria-label="Translation"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        >
          <option value="ESV">ESV</option>
          <option value="KJV">KJV</option>
          <option value="WEB">WEB</option>
        </select>
        <select
          class="chip"
          aria-label="Tradition"
          value={tradition}
          onChange={(e) => setTradition(e.target.value)}
        >
          <option value="Protestant">Protestant</option>
          <option value="Catholic">Catholic</option>
          <option value="Orthodox">Orthodox</option>
          <option value="Ethiopian">Ethiopian</option>
        </select>
      </div>
      <div class="topbar-right">
        <button class="icon-btn" aria-label="Search">
          <i class="ti ti-search"></i>
        </button>
        <button
          class="icon-btn"
          onClick={() => setAssistantOpen(!assistantOpen)}
          aria-label="Toggle assistant"
        >
          <i class="ti ti-sparkles"></i>
        </button>
        <div class="avatar" title="Account">JU</div>
      </div>
    </header>
  );
}
