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
import InterlinearView from './features/languages/InterlinearView';
import MemorizationView from './features/memorization/MemorizationView';
import AccessibilitySettingsView from './features/settings/AccessibilitySettingsView';
import CommunityHubView from './features/community/CommunityHubView';

import { listenToAuthState, signOutUser } from './services/authService';
import { getUserSettings, updateUserSettings, recordReadingActivity } from './services/userSettingsService';

export default function App() {
  const [route, setRoute] = useState('landing'); // 'landing' | 'login' | 'signup' | 'verify-email' | 'app'
  const [hydrating, setHydrating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('berea_auth') === 'true';
  });
  const [pendingEmail, setPendingEmail] = useState('');
  const [activeTab, setActiveTab] = useState('read');
  const [translation, setTranslation] = useState('KJV');
  const [tradition, setTradition] = useState('protestant');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(true);

  // Reader navigation state — shared between Topbar breadcrumb and ReaderView
  const [readerBook, setReaderBook] = useState(null);
  const [readerChapter, setReaderChapter] = useState(null);
  const [readerOpenPicker, setReaderOpenPicker] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('berea_theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    updateUserSettings({ theme });
  }, [theme]);

  useEffect(() => {
    updateUserSettings({ tradition });
  }, [tradition]);

  // Real Supabase Auth State Change Listener & Settings Hydration
  useEffect(() => {
    const { data: authListener } = listenToAuthState((event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        localStorage.setItem('berea_auth', 'true');
        
        // Hydrate settings from remote DB on login
        getUserSettings().then(settings => {
          if (settings.theme) setTheme(settings.theme);
          if (settings.tradition) setTradition(settings.tradition);
        });

        // Record activity for streak tracking
        recordReadingActivity();

        if (event === 'SIGNED_IN') {
          setHydrating(true);
          setRoute('app');
        }
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        localStorage.removeItem('berea_auth');
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (selectedTradition) => {
    if (selectedTradition) setTradition(selectedTradition.toLowerCase());
    setIsAuthenticated(true);
    localStorage.setItem('berea_auth', 'true');
    setHydrating(true);
    setRoute('app');
  };

  const handleLogout = async () => {
    await signOutUser();
    setIsAuthenticated(false);
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
      case 'interlinear':
        return <InterlinearView />;
      case 'memorize':
        return <MemorizationView />;
      case 'community':
        return <CommunityHubView />;
      case 'settings':
        return <AccessibilitySettingsView theme={theme} setTheme={setTheme} />;
      case 'beyond':
        return <CanonComparisonView currentTradition={tradition} setTradition={setTradition} />;
      case 'read':
      default:
        return (
          <ReaderView
            translation={translation}
            tradition={tradition}
            onNavigationChange={({ book, chapter }) => {
              setReaderBook(book);
              setReaderChapter(chapter);
            }}
            triggerOpenPicker={readerOpenPicker}
            onPickerOpened={() => setReaderOpenPicker(false)}
          />
        );
    }
  };

  return (
    <div className={`app ${!assistantOpen ? 'app-no-assistant' : ''}`}>
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
        currentBook={activeTab === 'read' ? readerBook : null}
        currentChapter={activeTab === 'read' ? readerChapter : null}
        onOpenBookPicker={activeTab === 'read' ? () => {
          setReaderOpenPicker(true);
        } : null}
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
          setAssistantOpen={setAssistantOpen}
          translation={translation}
          tradition={tradition}
        />
      )}

      <div className="bottombar">
        <button
          className={`bb-item ${activeTab === 'read' ? 'active' : ''}`}
          onClick={() => setActiveTab('read')}
        >
          <i className="ti ti-book-2"></i>Read
        </button>
        <button
          className={`bb-item ${activeTab === 'search' ? 'active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          <i className="ti ti-search"></i>Search
        </button>
        <button
          className={`bb-item ${activeTab === 'plans' ? 'active' : ''}`}
          onClick={() => setActiveTab('plans')}
        >
          <i className="ti ti-calendar"></i>Plans
        </button>
        <button
          className={`bb-item ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <i className="ti ti-notes"></i>Notes
        </button>
        <button
          className="bb-item"
          onClick={() => setAssistantOpen(!assistantOpen)}
        >
          <i className="ti ti-sparkles"></i>Assistant
        </button>
      </div>
    </div>
  );
}
