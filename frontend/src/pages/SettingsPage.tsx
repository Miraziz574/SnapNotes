import React, { useRef } from 'react';
import { Moon, Sun, Monitor, Waves, Leaf, Sunset, Download, Upload, Trash2, Info, Check } from 'lucide-react';
import { useNotesStore } from '../store/notesStore';
import type { Theme, Font, CardStyle } from '../types';
import { exportAsJSON } from '../utils/exportUtils';
import { Header } from '../components/Layout/Header';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';

interface SettingsPageProps {
  onMenuClick: () => void;
}

const THEMES: { value: Theme; label: string; icon: React.ReactNode; preview: string }[] = [
  { value: 'light', label: 'Light', icon: <Sun size={18} />, preview: 'bg-white border-gray-200' },
  { value: 'dark', label: 'Dark', icon: <Moon size={18} />, preview: 'bg-gray-900 border-gray-700' },
  { value: 'system', label: 'System', icon: <Monitor size={18} />, preview: 'bg-gradient-to-br from-white to-gray-900 border-gray-400' },
  { value: 'ocean', label: 'Ocean', icon: <Waves size={18} />, preview: 'bg-blue-950 border-blue-800' },
  { value: 'forest', label: 'Forest', icon: <Leaf size={18} />, preview: 'bg-green-950 border-green-800' },
  { value: 'sunset', label: 'Sunset', icon: <Sunset size={18} />, preview: 'bg-orange-950 border-orange-800' },
];

const FONTS: { value: Font; label: string; preview: string }[] = [
  { value: 'sf-pro', label: 'SF Pro', preview: 'font-sans' },
  { value: 'roboto', label: 'Roboto', preview: 'font-roboto' },
  { value: 'georgia', label: 'Georgia', preview: 'font-georgia' },
  { value: 'mono', label: 'Mono', preview: 'font-mono' },
];

const CARD_STYLES: { value: CardStyle; label: string; desc: string }[] = [
  { value: 'flat', label: 'Flat', desc: 'Clean minimal borders' },
  { value: 'elevated', label: 'Elevated', desc: 'Subtle shadows' },
  { value: 'gradient', label: 'Gradient', desc: 'Gradient background' },
];

const ACCENT_COLORS = ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#FF2D55', '#00C7BE', '#30B0C7'];

export function SettingsPage({ onMenuClick }: SettingsPageProps) {
  const { settings, updateSettings, exportData, importData, clearAllData, addToast, notes } = useNotesStore();
  const [showClearConfirm, setShowClearConfirm] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = exportData();
    exportAsJSON(data, `quicknotes-backup-${new Date().toISOString().slice(0, 10)}.json`);
    addToast('Data exported successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const success = importData(ev.target?.result as string);
      if (success) addToast('Notes imported successfully! ✨');
      else addToast('Failed to import. Invalid file format.', 'error');
    };
    reader.readAsText(file);
  };

  const handleClearAll = () => {
    clearAllData();
    addToast('All data cleared');
    setShowClearConfirm(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Settings" onMenuClick={onMenuClick} />

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 md:p-6 space-y-6">
        {/* Appearance */}
        <section className="card-elevated rounded-2xl p-5">
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Appearance</h2>

          {/* Theme */}
          <div className="mb-5">
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>Theme</h3>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map(({ value, label, icon, preview }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ theme: value })}
                  className={`relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:opacity-90 ${settings.theme === value ? 'border-blue-500' : ''}`}
                  style={settings.theme !== value ? { borderColor: 'var(--color-border)' } : undefined}
                >
                  <div className={`w-full h-10 rounded-lg border ${preview}`} />
                  <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--color-text)' }}>
                    {icon} {label}
                  </div>
                  {settings.theme === value && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Font */}
          <div className="mb-5">
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>Font</h3>
            <div className="grid grid-cols-2 gap-2">
              {FONTS.map(({ value, label, preview }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ font: value })}
                  className={`p-3 rounded-xl border-2 text-left transition-all hover:opacity-90 ${settings.font === value ? 'border-blue-500' : ''}`}
                  style={settings.font !== value ? { borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' } : { backgroundColor: 'var(--color-surface)' }}
                >
                  <div className={`text-base mb-0.5 ${preview}`} style={{ color: 'var(--color-text)' }}>Aa</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Card style */}
          <div className="mb-5">
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>Card Style</h3>
            <div className="grid grid-cols-3 gap-2">
              {CARD_STYLES.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ cardStyle: value })}
                  className={`p-3 rounded-xl border-2 text-left transition-all hover:opacity-90 ${settings.cardStyle === value ? 'border-blue-500' : ''}`}
                  style={settings.cardStyle !== value ? { borderColor: 'var(--color-border)' } : undefined}
                >
                  <div className="text-sm font-medium mb-0.5" style={{ color: 'var(--color-text)' }}>{label}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Accent color */}
          <div>
            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-text-secondary)' }}>Accent Color</h3>
            <div className="flex gap-2 flex-wrap">
              {ACCENT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    updateSettings({ accentColor: c });
                    document.documentElement.style.setProperty('--color-primary', c);
                  }}
                  className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${settings.accentColor === c ? 'scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c, borderColor: settings.accentColor === c ? 'white' : 'transparent', boxShadow: settings.accentColor === c ? `0 0 0 2px ${c}` : 'none' }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Behavior */}
        <section className="card-elevated rounded-2xl p-5">
          <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Behavior</h2>

          <div className="space-y-4">
            {[
              { key: 'autoSave' as const, label: 'Auto-save', desc: 'Automatically save notes every 2 seconds' },
              { key: 'biometricLock' as const, label: 'App Lock', desc: 'Require authentication to open the app' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{label}</div>
                  <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{desc}</div>
                </div>
                <button
                  onClick={() => updateSettings({ [key]: !settings[key] })}
                  className={`w-11 h-6 rounded-full transition-all ${settings[key] ? 'bg-blue-500' : ''}`}
                  style={!settings[key] ? { backgroundColor: 'var(--color-border)' } : undefined}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform mx-0.5 ${settings[key] ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Data */}
        <section className="card-elevated rounded-2xl p-5">
          <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--color-text)' }}>Data & Backup</h2>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>{notes.length} notes stored locally</p>

          <div className="space-y-2">
            <Button onClick={handleExport} variant="secondary" icon={<Download size={16} />} className="w-full justify-start">
              Export All Notes (JSON)
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="secondary" icon={<Upload size={16} />} className="w-full justify-start">
              Import Notes from JSON
            </Button>
            <Button onClick={() => setShowClearConfirm(true)} variant="danger" icon={<Trash2 size={16} />} className="w-full justify-start">
              Clear All Data
            </Button>
          </div>

          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </section>

        {/* About */}
        <section className="card-elevated rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <Info size={20} className="text-white" />
            </div>
            <div>
              <div className="font-semibold" style={{ color: 'var(--color-text)' }}>QuickNotes</div>
              <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Version 1.0.0</div>
            </div>
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            A beautiful, fast note-taking app with OCR support, smart organization, and offline capability.
            All data is stored locally on your device.
          </p>
          <div className="mt-3 flex gap-3 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            <span>⌘N — New note</span>
            <span>⌘K — Search</span>
            <span>⌘S — Save</span>
          </div>
        </section>
      </div>

      <Modal isOpen={showClearConfirm} onClose={() => setShowClearConfirm(false)} title="Clear All Data">
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          This will permanently delete all your notes and settings. This action cannot be undone.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setShowClearConfirm(false)} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleClearAll} className="flex-1">Delete Everything</Button>
        </div>
      </Modal>
    </div>
  );
}