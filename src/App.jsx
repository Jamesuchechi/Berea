import React, { useState, useEffect } from 'react';
import LandingPage from './routes/LandingPage';
import LoginPage from './routes/LoginPage';
import SignupPage from './routes/SignupPage';
import VerifyEmailPage from './routes/VerifyEmailPage';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import AssistantPanel from './components/AssistantPanel';
import ReaderView from './features/reader/ReaderView';
import NotesView from './features/notes/NotesView';
import DiagramsView from './features/diagrams/DiagramsView';
import PlansView from './features/plans/PlansView';

import AppHydrationSplash from './components/AppHydrationSplash';
import SearchView from './features/search/SearchView';
import CanonComparisonView from './features/beyond/CanonComparisonView';

export default function App() {
  const [route, setRoute] = useState('landing'); // 'landing' | 'login' | 'signup' | 'verify-email' | 'app'
  const [hydrating, setHydrating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('berea_auth') === 'true';
  });
  const [pendingEmail, setPendingEmail] = useState('');
  const [activeTab, setActiveTab] = useState('read');
  const [translation, setTranslation] = useState('ESV');
  const [tradition, setTradition] = useState('Protestant');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('berea_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('berea_theme', theme);
  }, [theme]);

  const handleLoginSuccess = (selectedTradition) => {
    if (selectedTradition) setTradition(selectedTradition);
    setIsAuthenticated(true);
    localStorage.setItem('berea_auth', 'true');
    setHydrating(true);
    setRoute('app');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('berea_auth');
    setRoute('login');
  };

  if (hydrating) {
    return <AppHydrationSplash onHydrated={() => setHydrating(false)} />;
  }

  // Route Guard: Protected Main Dashboard
  if (route === 'app' && !isAuthenticated) {
    return (
      <LoginPage
        onNavigateLanding={() => setRoute('landing')}
        onNavigateSignup={() => setRoute('signup')}
        onEnterApp={handleLoginSuccess}
      />
    );
  }

  if (route === 'landing') {
    return (
      <LandingPage
        theme={theme}
        setTheme={setTheme}
        onNavigateLogin={() => setRoute('login')}
        onNavigateSignup={() => setRoute('signup')}
        onEnterApp={() => {
          if (isAuthenticated) {
            setRoute('app');
          } else {
            setRoute('login');
          }
        }}
      />
    );
  }

  if (route === 'login') {
    return (
      <LoginPage
        onNavigateLanding={() => setRoute('landing')}
        onNavigateSignup={() => setRoute('signup')}
        onEnterApp={handleLoginSuccess}
      />
    );
  }

  if (route === 'signup') {
    return (
      <SignupPage
        onNavigateLanding={() => setRoute('landing')}
        onNavigateLogin={() => setRoute('login')}
        onNavigateVerifyEmail={(email, selTradition) => {
          setPendingEmail(email);
          if (selTradition) setTradition(selTradition);
          setRoute('verify-email');
        }}
        onEnterApp={handleLoginSuccess}
      />
    );
  }

  if (route === 'verify-email') {
    return (
      <VerifyEmailPage
        email={pendingEmail || 'user@example.com'}
        onNavigateLanding={() => setRoute('landing')}
        onNavigateLogin={() => setRoute('login')}
        onVerifySuccess={() => handleLoginSuccess()}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'notes':
        return <NotesView />;
      case 'diagrams':
        return <DiagramsView />;
      case 'plans':
        return <PlansView />;
      case 'search':
        return <SearchView />;
      case 'beyond':
        return <CanonComparisonView currentTradition={tradition} setTradition={setTradition} />;
      case 'read':
      default:
        return <ReaderView translation={translation} tradition={tradition} />;
    }
  };

  return (
    <div class={`app ${!assistantOpen ? 'app-no-assistant' : ''}`}>
      <Topbar
        theme={theme}
        setTheme={setTheme}
        translation={translation}
        setTranslation={setTranslation}
        tradition={tradition}
        setTradition={setTradition}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        assistantOpen={assistantOpen}
        setAssistantOpen={setAssistantOpen}
        onNavigateLanding={() => setRoute('landing')}
        onLogout={handleLogout}
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tradition={tradition}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      {renderTabContent()}

      {assistantOpen && (
        <AssistantPanel
          assistantOpen={assistantOpen}
          translation={translation}
          tradition={tradition}
        />
      )}

      <div class="bottombar">
        <button
          class={`bb-item ${activeTab === 'read' ? 'active' : ''}`}
          onClick={() => setActiveTab('read')}
        >
          <i class="ti ti-book-2"></i>Read
        </button>
        <button
          class={`bb-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <i class="ti ti-search"></i>Search
        </button>
        <button
          class={`bb-item ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          <i class="ti ti-calendar"></i>Plans
        </button>
        <button
          class={`bb-item ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <i class="ti ti-notes"></i>Notes
        </button>
        <button
          class="bb-item"
          onClick={() => setAssistantOpen(!assistantOpen)}
        >
          <i class="ti ti-sparkles"></i>Assistant
        </button>
      </div>
    </div>
  );
}
