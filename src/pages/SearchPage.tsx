import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, Filter } from 'lucide-react';
import { useNotesStore } from '../store/notesStore';
import { NoteCard } from '../components/Notes/NoteCard';
import { EmptyState } from '../components/UI/EmptyState';
import { Header } from '../components/Layout/Header';

interface SearchPageProps {
  onMenuClick: () => void;
}

export function SearchPage({ onMenuClick }: SearchPageProps) {
  const { notes, searchHistory, addSearchHistory, clearSearchHistory, folders } = useNotesStore();
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [folderFilter, setFolderFilter] = useState('');
  const [starred, setStarred] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredNotes = React.useMemo(() => {
    let result = [...notes];
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q)) ||
        n.subject.toLowerCase().includes(q)
      ).sort((a, b) => {
        // Relevance scoring
        const scoreA = (a.title.toLowerCase().includes(q) ? 3 : 0) + (a.subject.toLowerCase().includes(q) ? 2 : 0) + (a.content.toLowerCase().includes(q) ? 1 : 0);
        const scoreB = (b.title.toLowerCase().includes(q) ? 3 : 0) + (b.subject.toLowerCase().includes(q) ? 2 : 0) + (b.content.toLowerCase().includes(q) ? 1 : 0);
        return scoreB - scoreA;
      });
    }
    if (folderFilter) result = result.filter(n => n.folder === folderFilter);
    if (starred) result = result.filter(n => n.isStarred);
    if (dateFrom) result = result.filter(n => n.createdAt >= dateFrom);
    if (dateTo) result = result.filter(n => n.createdAt <= dateTo + 'T23:59:59');
    return result;
  }, [notes, query, folderFilter, starred, dateFrom, dateTo]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (q.trim()) addSearchHistory(q.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) addSearchHistory(query.trim());
  };

  const hasFilters = folderFilter || starred || dateFrom || dateTo;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Search" onMenuClick={onMenuClick} />

      <div className="p-4 md:p-6 max-w-3xl mx-auto w-full">
        {/* Search bar */}
        <form onSubmit={handleSubmit} className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-secondary)' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search notes, tags, subjects..."
            className="w-full pl-11 pr-20 py-3.5 rounded-2xl border outline-none text-sm"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            {query && (
              <button type="button" onClick={() => setQuery('')} className="p-1.5 rounded-lg hover:bg-black/5">
                <X size={16} style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded-lg transition-colors ${showFilters || hasFilters ? 'text-white' : 'hover:bg-black/5'}`}
              style={showFilters || hasFilters ? { backgroundColor: 'var(--color-primary)' } : { color: 'var(--color-text-secondary)' }}
            >
              <Filter size={16} />
            </button>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="card-flat rounded-2xl p-4 mb-4 space-y-3 animate-slide-up">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>From Date</label>
                <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>To Date</label>
                <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                  style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }} />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Folder</label>
              <select value={folderFilter} onChange={(e) => setFolderFilter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border outline-none text-sm"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                <option value="">All Folders</option>
                {folders.filter(f => f.id !== 'default').map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={starred} onChange={(e) => setStarred(e.target.checked)} className="w-4 h-4 rounded accent-blue-500" />
              <span className="text-sm" style={{ color: 'var(--color-text)' }}>⭐ Starred only</span>
            </label>

            {hasFilters && (
              <button onClick={() => { setFolderFilter(''); setStarred(false); setDateFrom(''); setDateTo(''); }}
                className="text-xs text-red-500 hover:text-red-600">Clear filters</button>
            )}
          </div>
        )}

        {/* Search history */}
        {!query && searchHistory.length > 0 && (
          <div className="mb-6 animate-fade-in">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Recent Searches</h3>
              <button onClick={clearSearchHistory} className="text-xs hover:opacity-70" style={{ color: 'var(--color-text-secondary)' }}>Clear</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((h, i) => (
                <button key={i} onClick={() => setQuery(h)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border hover:bg-black/5 transition-colors"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  <Clock size={11} />
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {query.trim() || hasFilters ? (
          <>
            <div className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
              {filteredNotes.length} result{filteredNotes.length !== 1 ? 's' : ''}{query && ` for "${query}"`}
            </div>
            {filteredNotes.length === 0 ? (
              <EmptyState
                icon={<Search size={64} />}
                title="No notes found"
                description={`No notes match "${query}". Try different keywords.`}
              />
            ) : (
              <div className="space-y-2">
                {filteredNotes.map(note => (
                  <NoteCard key={note.id} note={note} viewMode="list" searchQuery={query} />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <Search size={48} className="mx-auto mb-4 opacity-20" style={{ color: 'var(--color-text)' }} />
            <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Start typing to search your notes</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>Press ⌘K anywhere to open search</p>
          </div>
        )}
      </div>
    </div>
  );
}
