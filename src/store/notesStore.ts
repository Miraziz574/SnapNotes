import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Note, Folder, AppSettings, Toast, SearchFilters, ViewMode } from '../types';

const SAMPLE_NOTES: Note[] = [
  {
    id: 'sample-1',
    title: 'Calculus: Derivatives & Integrals',
    content: 'Key formulas for derivatives:\n• d/dx(xⁿ) = nxⁿ⁻¹\n• d/dx(sin x) = cos x\n• d/dx(eˣ) = eˣ\n• Chain rule: d/dx[f(g(x))] = f\'(g(x))·g\'(x)\n\nIntegration by parts:\n∫u dv = uv − ∫v du\n\nRemember to practice the quotient rule before the exam!',
    subject: 'Mathematics',
    folder: 'default',
    tags: ['calculus', 'derivatives', 'math', 'exam-prep'],
    isPinned: true,
    isStarred: true,
    images: [],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    color: 'blue',
    versions: [],
  },
  {
    id: 'sample-2',
    title: 'World War II Timeline',
    content: 'Key events:\n1939 - Germany invades Poland, war begins\n1940 - Battle of Britain, Fall of France\n1941 - Pearl Harbor, US enters war\n1942 - Battle of Stalingrad begins\n1944 - D-Day invasion of Normandy\n1945 - V-E Day (May 8), Hiroshima/Nagasaki, V-J Day\n\nCauses: Treaty of Versailles, Rise of fascism, Great Depression',
    subject: 'History',
    folder: 'default',
    tags: ['history', 'wwii', 'war', 'timeline'],
    isPinned: false,
    isStarred: true,
    images: [],
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    color: 'yellow',
    versions: [],
  },
  {
    id: 'sample-3',
    title: 'Cell Biology: Mitosis Phases',
    content: 'Phases of Mitosis:\n1. Prophase - chromosomes condense, spindle forms\n2. Metaphase - chromosomes align at cell equator\n3. Anaphase - sister chromatids separate\n4. Telophase - nuclear envelope reforms\n5. Cytokinesis - cytoplasm divides\n\nMnemonic: "PMAT" - Prophase, Metaphase, Anaphase, Telophase\n\nDifference from meiosis: mitosis produces 2 identical diploid cells!',
    subject: 'Biology',
    folder: 'default',
    tags: ['biology', 'cells', 'mitosis', 'science'],
    isPinned: false,
    isStarred: false,
    images: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    color: 'green',
    versions: [],
  },
  {
    id: 'sample-4',
    title: 'Shakespeare: Hamlet Analysis',
    content: 'Major themes in Hamlet:\n• Revenge and justice - Hamlet\'s quest to avenge his father\n• Appearance vs Reality - "To be or not to be"\n• Corruption and mortality - "Something is rotten in the state of Denmark"\n• Madness - real vs feigned madness\n\nKey characters: Hamlet, Ophelia, Claudius, Gertrude, Horatio\n\nFavorite quote: "This above all: to thine own self be true"',
    subject: 'Literature',
    folder: 'default',
    tags: ['shakespeare', 'hamlet', 'literature', 'themes'],
    isPinned: false,
    isStarred: true,
    images: [],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    color: 'purple',
    versions: [],
  },
  {
    id: 'sample-5',
    title: 'Weekly Goals & Tasks',
    content: 'This week\'s priorities:\n✓ Complete calculus homework\n☐ Study for history midterm\n☐ Finish biology lab report\n☐ Read chapters 5-7 of Hamlet\n☐ Review chemistry notes\n\nPersonal:\n☐ Exercise 3x this week\n☐ Call grandma\n☐ Organize study space\n\nRemember: Progress over perfection!',
    subject: 'Personal',
    folder: 'default',
    tags: ['goals', 'tasks', 'productivity', 'weekly'],
    isPinned: true,
    isStarred: false,
    images: [],
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    color: 'orange',
    checklist: [
      { id: 'cl-1', text: 'Complete calculus homework', completed: true },
      { id: 'cl-2', text: 'Study for history midterm', completed: false },
      { id: 'cl-3', text: 'Finish biology lab report', completed: false },
    ],
    versions: [],
  },
  {
    id: 'sample-6',
    title: 'Chemistry: Periodic Table Notes',
    content: 'Groups to remember:\n• Group 1 (Alkali metals): Li, Na, K - highly reactive\n• Group 17 (Halogens): F, Cl, Br - want 1 electron\n• Group 18 (Noble gases): He, Ne, Ar - stable, full outer shell\n\nAtomic structure:\n- Protons: positive charge, in nucleus\n- Neutrons: neutral, in nucleus\n- Electrons: negative, in orbitals\n\nMolar mass = protons + neutrons (atomic mass units)',
    subject: 'Chemistry',
    folder: 'default',
    tags: ['chemistry', 'periodic-table', 'atoms', 'science'],
    isPinned: false,
    isStarred: false,
    images: [],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    color: 'red',
    versions: [],
  },
];

const SAMPLE_FOLDERS: Folder[] = [
  { id: 'default', name: 'All Notes', color: '#007AFF', createdAt: new Date().toISOString() },
  { id: 'school', name: 'School', color: '#34C759', createdAt: new Date().toISOString() },
  { id: 'personal', name: 'Personal', color: '#FF9500', createdAt: new Date().toISOString() },
  { id: 'work', name: 'Work', color: '#5856D6', createdAt: new Date().toISOString() },
];

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  font: 'sf-pro',
  cardStyle: 'elevated',
  accentColor: '#007AFF',
  autoSave: true,
  biometricLock: false,
  showOnboarding: true,
};

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  folder: '',
  tags: [],
  isStarred: false,
  isPinned: false,
  dateFrom: '',
  dateTo: '',
  sortField: 'updatedAt',
  sortOrder: 'desc',
};

interface NotesState {
  notes: Note[];
  folders: Folder[];
  settings: AppSettings;
  filters: SearchFilters;
  viewMode: ViewMode;
  toasts: Toast[];
  searchHistory: string[];

  // Note actions
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => Note;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  pinNote: (id: string) => void;
  starNote: (id: string) => void;
  duplicateNote: (id: string) => void;
  saveVersion: (id: string) => void;

  // Folder actions
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;

  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void;

  // Filters
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  setViewMode: (mode: ViewMode) => void;

  // Toast
  addToast: (message: string, type?: Toast['type']) => void;
  removeToast: (id: string) => void;

  // Search history
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;

  // Export/Import
  exportData: () => string;
  importData: (json: string) => boolean;
  clearAllData: () => void;

  // Getters
  getFilteredNotes: () => Note[];
  getNoteById: (id: string) => Note | undefined;
  getFolderById: (id: string) => Folder | undefined;
  getStats: () => { total: number; today: number; week: number; subjects: Record<string, number> };
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: SAMPLE_NOTES,
      folders: SAMPLE_FOLDERS,
      settings: DEFAULT_SETTINGS,
      filters: DEFAULT_FILTERS,
      viewMode: 'grid',
      toasts: [],
      searchHistory: [],

      addNote: (noteData) => {
        const note: Note = {
          ...noteData,
          id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          versions: [],
        };
        set((state) => ({ notes: [note, ...state.notes] }));
        return note;
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }));
      },

      pinNote: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isPinned: !n.isPinned, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },

      starNote: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, isStarred: !n.isStarred, updatedAt: new Date().toISOString() } : n
          ),
        }));
      },

      duplicateNote: (id) => {
        const note = get().notes.find((n) => n.id === id);
        if (!note) return;
        const newNote: Note = {
          ...note,
          id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
          title: `${note.title} (copy)`,
          isPinned: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          versions: [],
        };
        set((state) => ({ notes: [newNote, ...state.notes] }));
      },

      saveVersion: (id) => {
        const note = get().notes.find((n) => n.id === id);
        if (!note) return;
        const version = {
          id: `v-${Date.now()}`,
          content: note.content,
          title: note.title,
          savedAt: new Date().toISOString(),
        };
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id
              ? { ...n, versions: [...(n.versions || []).slice(-9), version] }
              : n
          ),
        }));
      },

      addFolder: (folderData) => {
        const folder: Folder = {
          ...folderData,
          id: `folder-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ folders: [...state.folders, folder] }));
      },

      updateFolder: (id, updates) => {
        set((state) => ({
          folders: state.folders.map((f) => (f.id === id ? { ...f, ...updates } : f)),
        }));
      },

      deleteFolder: (id) => {
        if (id === 'default') return;
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== id),
          notes: state.notes.map((n) => (n.folder === id ? { ...n, folder: 'default' } : n)),
        }));
      },

      updateSettings: (updates) => {
        set((state) => ({ settings: { ...state.settings, ...updates } }));
      },

      setFilters: (filters) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }));
      },

      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS });
      },

      setViewMode: (mode) => {
        set({ viewMode: mode });
      },

      addToast: (message, type = 'success') => {
        const toast: Toast = { id: `toast-${Date.now()}`, message, type };
        set((state) => ({ toasts: [...state.toasts, toast] }));
        setTimeout(() => get().removeToast(toast.id), 3500);
      },

      removeToast: (id) => {
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
      },

      addSearchHistory: (query) => {
        if (!query.trim()) return;
        set((state) => ({
          searchHistory: [query, ...state.searchHistory.filter((q) => q !== query)].slice(0, 10),
        }));
      },

      clearSearchHistory: () => {
        set({ searchHistory: [] });
      },

      exportData: () => {
        const { notes, folders, settings } = get();
        return JSON.stringify({ notes, folders, settings, exportedAt: new Date().toISOString() }, null, 2);
      },

      importData: (json) => {
        try {
          const data = JSON.parse(json);
          if (data.notes && Array.isArray(data.notes)) {
            set((state) => ({
              notes: [...data.notes, ...state.notes.filter((n) => !data.notes.find((dn: Note) => dn.id === n.id))],
              folders: data.folders ? [...data.folders, ...state.folders.filter((f) => !data.folders.find((df: Folder) => df.id === f.id))] : state.folders,
            }));
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      clearAllData: () => {
        set({ notes: [], folders: SAMPLE_FOLDERS, settings: DEFAULT_SETTINGS, filters: DEFAULT_FILTERS, searchHistory: [] });
      },

      getFilteredNotes: () => {
        const { notes, filters } = get();
        let result = [...notes];

        if (filters.query) {
          const q = filters.query.toLowerCase();
          result = result.filter(
            (n) =>
              n.title.toLowerCase().includes(q) ||
              n.content.toLowerCase().includes(q) ||
              n.tags.some((t) => t.toLowerCase().includes(q)) ||
              n.subject.toLowerCase().includes(q)
          );
        }

        if (filters.folder) {
          result = result.filter((n) => n.folder === filters.folder);
        }

        if (filters.tags.length > 0) {
          result = result.filter((n) => filters.tags.every((t) => n.tags.includes(t)));
        }

        if (filters.isStarred) {
          result = result.filter((n) => n.isStarred);
        }

        if (filters.isPinned) {
          result = result.filter((n) => n.isPinned);
        }

        if (filters.dateFrom) {
          result = result.filter((n) => n.createdAt >= filters.dateFrom);
        }

        if (filters.dateTo) {
          result = result.filter((n) => n.createdAt <= filters.dateTo + 'T23:59:59');
        }

        // Sort: pinned first, then by sort field
        result.sort((a, b) => {
          if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
          const aVal = a[filters.sortField] ?? '';
          const bVal = b[filters.sortField] ?? '';
          const cmp = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return filters.sortOrder === 'asc' ? cmp : -cmp;
        });

        return result;
      },

      getNoteById: (id) => get().notes.find((n) => n.id === id),

      getFolderById: (id) => get().folders.find((f) => f.id === id),

      getStats: () => {
        const { notes } = get();
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekStart = new Date(now.getTime() - 7 * 86400000).toISOString();
        const subjects: Record<string, number> = {};
        notes.forEach((n) => {
          if (n.subject) subjects[n.subject] = (subjects[n.subject] || 0) + 1;
        });
        return {
          total: notes.length,
          today: notes.filter((n) => n.createdAt >= todayStart).length,
          week: notes.filter((n) => n.createdAt >= weekStart).length,
          subjects,
        };
      },
    }),
    {
      name: 'quicknotes-storage',
      partialize: (state) => ({
        notes: state.notes,
        folders: state.folders,
        settings: state.settings,
        searchHistory: state.searchHistory,
        viewMode: state.viewMode,
      }),
    }
  )
);
