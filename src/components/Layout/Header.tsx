import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, Plus, Camera } from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  rightContent?: React.ReactNode;
}

export function Header({ title, onMenuClick, rightContent }: HeaderProps) {
  const navigate = useNavigate();
  const addNote = useNotesStore((s) => s.addNote);

  const handleNewNote = () => {
    const note = addNote({
      title: '', content: '', subject: '', folder: 'default',
      tags: [], isPinned: false, isStarred: false, images: [], color: 'default',
    });
    navigate(`/notes/${note.id}`);
  };

  return (
    <header
      className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3 backdrop-blur-sm"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <button
        className="md:hidden p-2 rounded-xl hover:bg-black/5 transition-colors"
        onClick={onMenuClick}
      >
        <Menu size={20} style={{ color: 'var(--color-text)' }} />
      </button>

      <h1 className="text-xl font-bold flex-1" style={{ color: 'var(--color-text)' }}>{title}</h1>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/search')}
          className="p-2 rounded-xl hover:bg-black/5 transition-colors"
          title="Search (⌘K)"
        >
          <Search size={20} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
        <button
          onClick={() => navigate('/camera')}
          className="p-2 rounded-xl hover:bg-black/5 transition-colors hidden sm:flex"
          title="Capture"
        >
          <Camera size={20} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
        <button
          onClick={handleNewNote}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-95 shadow-sm"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">New</span>
        </button>
        {rightContent}
      </div>
    </header>
  );
}
