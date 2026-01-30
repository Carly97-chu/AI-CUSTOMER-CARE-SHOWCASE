import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ChatInterface } from './components/ChatInterface';
import { Dashboard } from './components/Dashboard';
import { ViewState } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);

  const renderView = () => {
    switch (currentView) {
      case ViewState.CHAT_DEMO:
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <ChatInterface onBack={() => setCurrentView(ViewState.HOME)} />
          </div>
        );
      case ViewState.ANALYSIS_DEMO:
        return (
          <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <Dashboard onBack={() => setCurrentView(ViewState.HOME)} />
          </div>
        );
      case ViewState.HOME:
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="text-textMain antialiased selection:bg-primary/30 selection:text-white bg-background min-h-screen">
      {renderView()}
    </div>
  );
}

export default App;