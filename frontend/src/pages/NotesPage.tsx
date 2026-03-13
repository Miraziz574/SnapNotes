import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Grid, List, StickyNote, Plus } from 'lucide-react';
import { useNotesStore } from '../store/notesStore';
import { Header } from '../components/Layout/Header';
import { NoteCard } from '../components/Notes/NoteCard';
import { NoteFilters } from '../components/Notes/NoteFilters';
import { EmptyState } from '../components/UI/EmptyState';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/UI/Button';

interface NotesPageProps {
  onMenuClick: () => void;
}

export function NotesPage({ onMenuClick }: NotesPageProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { getFilteredNotes, viewMode, setViewMode, setFilters, addNote, filters } = useNotesStore();

  useEffect(() => {
    const filter = searchParams.get('filter');
    const folder = searchParams.get('folder');
    if (filter === 'starred') setFilters({ isStarred: true });
    else if (filter === 'pinned') setFilters({ isPinned: true });
    if (folder) setFilters({ folder });
  }, [searchParams, setFilters]);

  const notes = getFilteredNotes();

  const handleNewNote = () => {
    const note = addNote({
      title: '', content: '', subject: '', folder: filters.folder || 'default',
      tags: [], isPinned: false, isStarred: false, images: [], color: 'default',
    });
    navigate(`/notes/${note.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Notes"
        onMenuClick={onMenuClick}
        rightContent={
          <div className="flex gap-1 border rounded-xl p-1" style={{ borderColor: 'var(--color-border)' }}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'text-white' : 'hover:bg-black/5'}`}
              style={viewMode === 'grid' ? { backgroundColor: 'var(--color-primary)' } : { color: 'var(--color-text-secondary)' }}
            >
              <Grid size={15} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'text-white' : 'hover:bg-black/5'}`}
              style={viewMode === 'list' ? { backgroundColor: 'var(--color-primary)' } : { color: 'var(--color-text-secondary)' }}
            >
              <List size={15} />
            </button>
          </div>
        }
      />

      <NoteFilters />

      <div className="flex-1 p-4 md:p-6">
        {notes.length === 0 ? (
          <EmptyState
            icon={<StickyNote size={64} />}
            title="No notes found"
            description="Create your first note or adjust the filters to find what you're looking for."
            action={
              <Button onClick={handleNewNote} icon={<Plus size={16} />}>
                Create Note
              </Button>
            }
          />
        ) : (
          <>
            <div className="mb-3 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {notes.length} note{notes.length !== 1 ? 's' : ''}
            </div>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} viewMode="grid" searchQuery={filters.query} />
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {notes.map((note) => (
                  <NoteCard key={note.id} note={note} viewMode="list" searchQuery={filters.query} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}