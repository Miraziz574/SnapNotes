'use client';

import { useState, useEffect, useCallback } from 'react';
import NoteCard from '@/components/NoteCard';
import SubjectPill from '@/components/SubjectPill';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Note {
  id: number;
  text: string;
  subject: string;
  image_data: string | null;
  created_at: string;
}

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [activeSubject, setActiveSubject] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async (subject?: string) => {
    setLoading(true);
    try {
      const url =
        subject && subject !== 'All'
          ? `/api/notes?subject=${encodeURIComponent(subject)}`
          : '/api/notes';
      const res = await fetch(url);
      if (res.ok) {
        const data = (await res.json()) as { notes: Note[] };
        setNotes(data.notes);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      const res = await fetch('/api/notes?subjects=true');
      if (res.ok) {
        const data = (await res.json()) as { subjects: string[] };
        setSubjects(data.subjects);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    void fetchNotes(activeSubject);
    void fetchSubjects();
  }, [activeSubject, fetchNotes, fetchSubjects]);

  const handleDelete = useCallback(
    (id: number) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      void fetchSubjects();
    },
    [fetchSubjects]
  );

  const handleSubjectChange = (subject: string) => {
    setActiveSubject(subject);
  };

  const filtered = notes.filter((n) =>
    search.trim()
      ? n.text.toLowerCase().includes(search.toLowerCase()) ||
        n.subject.toLowerCase().includes(search.toLowerCase())
      : true
  );

  const allSubjects = ['All', ...subjects];

  return (
    <div className="min-h-screen bg-ios-background dark:bg-ios-background-dark">
      {/* Header */}
      <div className="sticky top-0 z-40 glass border-b border-ios-separator dark:border-white/10">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-3">
          <h1 className="text-2xl font-bold text-ios-label dark:text-ios-label-dark mb-3 tracking-tight">
            QuickNotes
          </h1>

          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8E8E93"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes…"
              className="w-full pl-9 pr-4 py-2 bg-ios-gray-5 dark:bg-white/10 rounded-full text-sm text-ios-label dark:text-ios-label-dark placeholder-ios-gray focus:outline-none focus:ring-2 focus:ring-ios-blue/40 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute inset-y-0 right-3 flex items-center text-ios-gray hover:text-ios-label transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Subject pills */}
        {subjects.length > 0 && (
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
            {allSubjects.map((subj) => (
              <SubjectPill
                key={subj}
                label={subj}
                active={activeSubject === subj}
                onClick={() => handleSubjectChange(subj)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size={32} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
            <div className="w-20 h-20 rounded-ios-2xl bg-ios-surface dark:bg-ios-surface-dark shadow-ios flex items-center justify-center mb-5">
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#8E8E93"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-ios-label dark:text-ios-label-dark mb-2">
              {search ? 'No results found' : 'No notes yet'}
            </h2>
            <p className="text-sm text-ios-gray max-w-xs leading-relaxed">
              {search
                ? `No notes match "${search}". Try a different search term.`
                : 'Tap the Camera tab to capture and extract text from images.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-3 animate-fade-in">
            {filtered.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
