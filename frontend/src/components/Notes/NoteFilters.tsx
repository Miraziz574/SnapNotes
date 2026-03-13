
import { X, SortAsc, SortDesc } from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';
import type { SortField } from '../../types';

export function NoteFilters() {
  const { filters, folders, setFilters, resetFilters } = useNotesStore();
  const hasActiveFilters = filters.isStarred || filters.isPinned || filters.folder || filters.tags.length > 0 || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
      {/* Sort */}
      <select
        value={filters.sortField}
        onChange={(e) => setFilters({ sortField: e.target.value as SortField })}
        className="text-xs px-2 py-1.5 rounded-lg border outline-none"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
      >
        <option value="updatedAt">Last Modified</option>
        <option value="createdAt">Created</option>
        <option value="title">Title</option>
        <option value="subject">Subject</option>
      </select>

      <button
        onClick={() => setFilters({ sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' })}
        className="p-1.5 rounded-lg border transition-colors hover:bg-black/5"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
      >
        {filters.sortOrder === 'asc' ? <SortAsc size={14} /> : <SortDesc size={14} />}
      </button>

      {/* Folder filter */}
      <select
        value={filters.folder}
        onChange={(e) => setFilters({ folder: e.target.value })}
        className="text-xs px-2 py-1.5 rounded-lg border outline-none"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
      >
        <option value="">All Folders</option>
        {folders.filter(f => f.id !== 'default').map((f) => (
          <option key={f.id} value={f.id}>{f.name}</option>
        ))}
      </select>

      {/* Starred toggle */}
      <button
        onClick={() => setFilters({ isStarred: !filters.isStarred })}
        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${filters.isStarred ? 'bg-yellow-100 border-yellow-300 text-yellow-700' : 'hover:bg-black/5'}`}
        style={!filters.isStarred ? { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' } : undefined}
      >
        ⭐ Starred
      </button>

      {/* Pinned toggle */}
      <button
        onClick={() => setFilters({ isPinned: !filters.isPinned })}
        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${filters.isPinned ? 'bg-blue-100 border-blue-300 text-blue-700' : 'hover:bg-black/5'}`}
        style={!filters.isPinned ? { borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' } : undefined}
      >
        📌 Pinned
      </button>

      {/* Reset */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors border border-red-200"
        >
          <X size={12} /> Clear
        </button>
      )}
    </div>
  );
}