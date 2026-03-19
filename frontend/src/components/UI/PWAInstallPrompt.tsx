import { useState, useEffect } from 'react';
import { Download, X, Wifi, WifiOff } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineBadge, setShowOfflineBadge] = useState(!navigator.onLine);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      const dismissed = sessionStorage.getItem('pwa-install-dismissed');
      if (!dismissed) setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBadge(true);
      // Hide the 'Back online' badge after 3 seconds
      setTimeout(() => setShowOfflineBadge(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBadge(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  return (
    <>
      {/* Offline / Online badge */}
      {showOfflineBadge && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-white shadow-lg animate-fade-in"
          style={{ backgroundColor: isOnline ? '#34C759' : '#FF3B30' }}
        >
          {isOnline ? <Wifi size={14} /> : <WifiOff size={14} />}
          {isOnline ? 'Back online' : 'You are offline — changes saved locally'}
        </div>
      )}

      {/* Install banner */}
      {showBanner && (
        <div
          className="fixed bottom-4 right-4 z-50 flex items-center gap-3 p-4 rounded-2xl shadow-2xl max-w-sm animate-slide-up"
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Download size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
              Install SnapNotes
            </div>
            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Add to home screen for offline access
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleInstall}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)' }}
            >
              Install
            </button>
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-xl hover:bg-black/5 transition-colors"
            >
              <X size={14} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
