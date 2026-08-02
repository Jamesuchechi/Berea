import React, { useState } from 'react';
import LandingPage from './routes/LandingPage';
import LoginPage from './routes/LoginPage';
import SignupPage from './routes/SignupPage';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import AssistantPanel from './components/AssistantPanel';
import ReaderView from './features/reader/ReaderView';
import NotesView from './features/notes/NotesView';
import DiagramsView from './features/diagrams/DiagramsView';
import PlansView from './features/plans/PlansView';

export default function App() {
  const [route, setRoute] = useState('landing'); // 'landing' | 'login' | 'signup' | 'app'
  const [activeTab, setActiveTab] = useState('read');
  const [translation, setTranslation] = useState('ESV');
  const [tradition, setTradition] = useState('Protestant');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(true);

  if (route === 'landing') {
    return (
      <LandingPage
        onNavigateLogin={() => setRoute('login')}
        onNavigateSignup={() => setRoute('signup')}
        onEnterApp={() => setRoute('app')}
      />
    );
  }

  if (route === 'login') {
    return (
      <LoginPage
        onNavigateSignup={() => setRoute('signup')}
        onEnterApp={() => setRoute('app')}
      />
    );
  }

  if (route === 'signup') {
    return (
      <SignupPage
        onNavigateLogin={() => setRoute('login')}
        onEnterApp={(selectedTradition) => {
          if (selectedTradition) setTradition(selectedTradition);
          setRoute('app');
        }}
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
      case 'read':
      case 'beyond':
      default:
        return <ReaderView translation={translation} tradition={tradition} />;
    }
  };

  return (
    <div class={`app ${!assistantOpen ? 'app-no-assistant' : ''}`}>
      <Topbar
        translation={translation}
        setTranslation={setTranslation}
        tradition={tradition}
        setTradition={setTradition}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        assistantOpen={assistantOpen}
        setAssistantOpen={setAssistantOpen}
        onNavigateLanding={() => setRoute('landing')}
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tradition={tradition}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
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
