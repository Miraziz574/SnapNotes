'use client';

import { useState, useCallback } from 'react';

interface Note {
  id: number;
  text: string;
  subject: string;
  image_data: string | null;
  created_at: string;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: number) => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  Math: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Physics: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Chemistry: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  Biology: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  History: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  English: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  'Computer Science': 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300',
  General: 'bg-gray-100 text-gray-600 dark:bg-gray-800/60 dark:text-gray-300',
};

function getSubjectColor(subject: string): string {
  return (
    SUBJECT_COLORS[subject] ??
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
  );
}

function formatRelativeTime(dateStr: string): string {
  // SQLite stores datetime() in UTC; replace space separator to produce a valid ISO string
  const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
  const date = new Date(normalized.endsWith('Z') ? normalized : normalized + 'Z');
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
  const [copied, setCopied] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(note.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }, [note.text]);

  const handleDelete = useCallback(async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notes?id=${note.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDelete(note.id);
      }
    } finally {
      setDeleting(false);
      setShowConfirm(false);
    }
  }, [note.id, onDelete]);

  return (
    <div className="bg-ios-surface dark:bg-ios-surface-dark rounded-ios shadow-ios dark:shadow-ios-dark p-4 flex flex-col gap-3 animate-fade-in transition-all duration-200 hover:shadow-ios-md dark:hover:shadow-ios-dark-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getSubjectColor(note.subject)}`}
        >
          {note.subject}
        </span>
        <span className="text-xs text-ios-gray flex-shrink-0 mt-0.5">
          {formatRelativeTime(note.created_at)}
        </span>
      </div>

      {/* Text */}
      <p className="text-sm leading-relaxed text-ios-label dark:text-ios-label-dark line-clamp-3 whitespace-pre-wrap break-words">
        {note.text}
      </p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-1 border-t border-ios-gray-5 dark:border-white/10">
        {/* Copy */}
        <button
          onClick={handleCopy}
          title="Copy to clipboard"
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-ios-sm transition-all duration-150 ${
            copied
              ? 'text-ios-green bg-green-50 dark:bg-green-900/20'
              : 'text-ios-blue dark:text-ios-blue-dark bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30'
          }`}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>

        {/* Delete */}
        {showConfirm ? (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowConfirm(false)}
              className="text-xs font-medium px-2.5 py-1.5 rounded-ios-sm text-ios-gray bg-ios-gray-5 dark:bg-white/10 hover:bg-ios-gray-4 dark:hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-xs font-medium px-2.5 py-1.5 rounded-ios-sm text-white bg-ios-red hover:bg-red-600 disabled:opacity-60 transition-colors"
            >
              {deleting ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            title="Delete note"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-ios-sm text-ios-red bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
