import React, { useState } from 'react';
import { AppView } from './types';
import { AdminPanel } from './components/AdminPanel';
import { ClientView } from './components/ClientView';

const App = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CLIENT);

  return (
    <>
      {currentView === AppView.CLIENT ? (
        <ClientView onAdminClick={() => setCurrentView(AppView.ADMIN)} />
      ) : (
        <AdminPanel onLogout={() => setCurrentView(AppView.CLIENT)} />
      )}
    </>
  );
};

export default App;