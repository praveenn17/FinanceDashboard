import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Transactions } from './pages/Transactions';
import { Insights } from './pages/Insights';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
          <Sidebar />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-muted/30">
            <div className="container mx-auto px-6 py-8 md:px-10 md:py-10">
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
