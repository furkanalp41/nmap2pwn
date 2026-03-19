import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GlobalVarsProvider } from './context/GlobalVarsContext';
import { ExportProvider } from './context/ExportContext';
import Header from './components/Layout/Header';
import GlobalVarsPanel from './components/GlobalVars/GlobalVarsPanel';
import ExportPanel from './components/Export/ExportPanel';
import Sidebar from './components/Layout/Sidebar';
import Home from './pages/Home';
import BrowsePorts from './pages/BrowsePorts';
import PortDetail from './pages/PortDetail';

export default function App() {
  const [panelOpen, setPanelOpen] = useState(false);

  return (
    <GlobalVarsProvider>
      <ExportProvider>
      <div className="min-h-screen flex flex-col">
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#0f1729',
              color: '#e2e8f0',
              border: '1px solid #1e293b',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
            },
            success: {
              iconTheme: { primary: '#34d399', secondary: '#0f1729' },
            },
            error: {
              iconTheme: { primary: '#f87171', secondary: '#0f1729' },
            },
          }}
        />
        <Header panelOpen={panelOpen} onTogglePanel={() => setPanelOpen((p) => !p)} />
        <GlobalVarsPanel open={panelOpen} onClose={() => setPanelOpen(false)} />
        <div className="flex flex-1">
          <Routes>
            <Route
              path="/"
              element={
                <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
                  <Home />
                </main>
              }
            />
            <Route
              path="/ports"
              element={
                <>
                  <Sidebar />
                  <main className="flex-1 max-w-5xl px-4 sm:px-6 py-8">
                    <BrowsePorts />
                  </main>
                </>
              }
            />
            <Route
              path="/ports/:id"
              element={
                <>
                  <Sidebar />
                  <main className="flex-1 max-w-5xl px-4 sm:px-6 py-8">
                    <PortDetail />
                  </main>
                </>
              }
            />
          </Routes>
        </div>
        <ExportPanel />
      </div>
      </ExportProvider>
    </GlobalVarsProvider>
  );
}
