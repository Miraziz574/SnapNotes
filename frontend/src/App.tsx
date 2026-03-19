import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Dashboard } from './pages/Dashboard';
import { NotesPage } from './pages/NotesPage';
import { NoteEditor } from './pages/NoteEditor';
import { CameraPage } from './pages/CameraPage';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { Sidebar } from './components/Layout/Sidebar';
import { ToastContainer } from './components/UI/Toast';
import { ThemeProvider } from './components/UI/ThemeProvider';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useNotesStore } from './store/notesStore';
import { Button } from './components/UI/Button';
import { PWAInstallPrompt } from './components/UI/PWAInstallPrompt';

const queryClient = new QueryClient();

function OnboardingModal() {
  const { settings, updateSettings } = useNotesStore();

  if (!settings.showOnboarding) return null;

  return (
    <div className="onboarding-overlay">
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-slide-up"
        style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>Welcome to QuickNotes!</h2>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Your beautiful, smart note-taking companion.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {[
            { emoji: '⌘N', text: 'New note — press Cmd+N anywhere' },
            { emoji: '🔍', text: 'Search — press Cmd+K to find notes' },
            { emoji: '📷', text: 'Capture — OCR scan handwritten notes' },
            { emoji: '🎨', text: 'Themes — customize in Settings' },
          ].map(({ emoji, text }) => (
            <div key={emoji} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--color-bg)' }}>
              <span className="text-lg w-8 text-center">{emoji}</span>
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>{text}</span>
            </div>
          ))}
        </div>

        <Button
          onClick={() => updateSettings({ showOnboarding: false })}
          className="w-full"
          size="lg"
        >
          Get Started 🚀
        </Button>
      </div>
    </div>
  );
}

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useKeyboardShortcuts();

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/notes" element={<NotesPage onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/notes/:id" element={<NoteEditor />} />
          <Route path="/camera" element={<CameraPage onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/search" element={<SearchPage onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/settings" element={<SettingsPage onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <OnboardingModal />
      <ToastContainer />
      <PWAInstallPrompt />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AppLayout />
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;