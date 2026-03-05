'use client';

import { useState, useEffect } from 'react';

function SettingsRow({
  label,
  value,
  href,
  children,
}: {
  label: string;
  value?: string;
  href?: string;
  children?: React.ReactNode;
}) {
  const inner = (
    <div className="flex items-center justify-between px-4 py-3 bg-ios-surface dark:bg-ios-surface-dark">
      <span className="text-sm text-ios-label dark:text-ios-label-dark">{label}</span>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-ios-gray">{value}</span>}
        {children}
        {href && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block hover:opacity-80 transition-opacity">
        {inner}
      </a>
    );
  }
  return inner;
}

function SettingsSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-8">
      {title && (
        <h2 className="text-xs font-semibold uppercase tracking-wider text-ios-gray px-4 mb-2">
          {title}
        </h2>
      )}
      <div className="rounded-ios shadow-ios dark:shadow-ios-dark overflow-hidden divide-y divide-ios-gray-5 dark:divide-white/10">
        {children}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-ios-background dark:bg-ios-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-ios-separator dark:border-white/10">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-4">
          <h1 className="text-2xl font-bold text-ios-label dark:text-ios-label-dark tracking-tight">
            Settings
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* Appearance */}
        <SettingsSection title="Appearance">
          <SettingsRow label="Dark Mode">
            <button
              role="switch"
              aria-checked={darkMode}
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                darkMode ? 'bg-ios-blue' : 'bg-ios-gray-4 dark:bg-ios-gray-3'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-ios transition-transform duration-200 ${
                  darkMode ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </SettingsRow>
        </SettingsSection>

        {/* AI Configuration */}
        <SettingsSection title="AI Configuration">
          <SettingsRow label="Gemini API Key">
            <div className="flex items-center gap-2">
              <span className="text-xs text-ios-gray font-mono">
                {apiKeyVisible ? 'Set via .env.local' : '••••••••'}
              </span>
              <button
                onClick={() => setApiKeyVisible((v) => !v)}
                className="text-ios-blue dark:text-ios-blue-dark text-xs font-medium"
              >
                {apiKeyVisible ? 'Hide' : 'Show'}
              </button>
            </div>
          </SettingsRow>
          <SettingsRow
            label="Get API Key"
            href="https://makersuite.google.com/app/apikey"
          />
        </SettingsSection>

        {/* About */}
        <SettingsSection title="About">
          <SettingsRow label="App Name" value="QuickNotes" />
          <SettingsRow label="Version" value="1.0.0" />
          <SettingsRow label="Built with" value="Next.js 14 + Gemini AI" />
        </SettingsSection>

        {/* How to use */}
        <SettingsSection title="How to Use">
          <div className="bg-ios-surface dark:bg-ios-surface-dark px-4 py-4 space-y-3">
            {[
              { icon: '📷', text: 'Tap Camera tab to capture notes or documents' },
              { icon: '🤖', text: 'AI extracts and organizes text automatically' },
              { icon: '📚', text: 'Notes are saved by subject for easy filtering' },
              { icon: '📋', text: 'Copy any note text to clipboard instantly' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <span className="text-lg leading-tight">{icon}</span>
                <p className="text-sm text-ios-secondary-label dark:text-white/70 leading-snug">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Configure key instruction */}
        <div className="mb-8 p-4 rounded-ios bg-ios-blue/10 dark:bg-ios-blue-dark/10 border border-ios-blue/20 dark:border-ios-blue-dark/20">
          <p className="text-xs text-ios-blue dark:text-ios-blue-dark leading-relaxed font-medium">
            💡 To enable AI text extraction, create a{' '}
            <code className="font-mono bg-ios-blue/10 px-1 rounded">.env.local</code> file
            with <code className="font-mono bg-ios-blue/10 px-1 rounded">GEMINI_API_KEY=your_key_here</code>
          </p>
        </div>
      </div>
    </div>
  );
}
