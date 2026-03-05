import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Pin, Trash2, Copy, MoreHorizontal, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { Note } from '../../types';
import { useNotesStore } from '../../store/notesStore';

interface NoteCardProps {
  note: Note;
  viewMode?: 'grid' | 'list';
  searchQuery?: string;
}

const COLOR_CLASSES: Record<string, string> = {
  default: 'note-color-default',
  blue: 'note-color-blue',
  green: 'note-color-green',
  yellow: 'note-color-yellow',
  red: 'note-color-red',
  purple: 'note-color-purple',
  pink: 'note-color-pink',
  orange: 'note-color-orange',
};

function highlightText(text: string, query: string): string {
  if (!query) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-highlight">$1</mark>');
}

export function NoteCard({ note, viewMode = 'grid', searchQuery = '' }: NoteCardProps) {
  const navigate = useNavigate();
  const { pinNote, starNote, deleteNote, duplicateNote, addToast } = useNotesStore();
  const [showMenu, setShowMenu] = useState(false);
  const settings = useNotesStore((s) => s.settings);

  const cardClass = `card-${settings.cardStyle}`;
  const colorClass = COLOR_CLASSES[note.color] || 'note-color-default';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this note?')) {
      deleteNote(note.id);
      addToast('Note deleted');
    }
    setShowMenu(false);
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateNote(note.id);
    addToast('Note duplicated');
    setShowMenu(false);
  };

  const preview = note.content.slice(0, 150) + (note.content.length > 150 ? '...' : '');

  if (viewMode === 'list') {
    return (
      <div
        className={`${cardClass} ${colorClass} p-4 cursor-pointer hover:opacity-90 transition-all duration-200 animate-fade-in group`}
        onClick={() => navigate(`/notes/${note.id}`)}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {note.isPinned && <Pin size={14} className="text-blue-500 flex-shrink-0" />}
              {note.isStarred && <Star size={14} className="text-yellow-500 flex-shrink-0" fill="currentColor" />}
              <h3
                className="font-semibold text-sm truncate"
                style={{ color: 'var(--color-text)' }}
                dangerouslySetInnerHTML={{ __html: highlightText(note.title || 'Untitled', searchQuery) }}
              />
              {note.subject && (
                <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                  {note.subject}
                </span>
              )}
            </div>
            <p
              className="text-xs line-clamp-1"
              style={{ color: 'var(--color-text-secondary)' }}
              dangerouslySetInnerHTML={{ __html: highlightText(preview, searchQuery) }}
            />
            {note.tags.length > 0 && (
              <div className="flex gap-1 mt-1 flex-wrap">
                {note.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {format(new Date(note.updatedAt), 'MMM d')}
            </span>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); starNote(note.id); }} className="p-1 rounded hover:bg-black/5">
                <Star size={14} className={note.isStarred ? 'text-yellow-500' : ''} style={!note.isStarred ? { color: 'var(--color-text-secondary)' } : undefined} fill={note.isStarred ? 'currentColor' : 'none'} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); pinNote(note.id); }} className="p-1 rounded hover:bg-black/5">
                <Pin size={14} className={note.isPinned ? 'text-blue-500' : ''} style={!note.isPinned ? { color: 'var(--color-text-secondary)' } : undefined} />
              </button>
              <button onClick={handleDelete} className="p-1 rounded hover:bg-black/5">
                <Trash2 size={14} className="text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${cardClass} ${colorClass} p-4 cursor-pointer hover:opacity-90 transition-all duration-200 animate-fade-in group relative`}
      onClick={() => navigate(`/notes/${note.id}`)}
    >
      {/* Actions */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); starNote(note.id); }}
          className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
        >
          <Star size={14} className={note.isStarred ? 'text-yellow-500' : ''} style={!note.isStarred ? { color: 'var(--color-text-secondary)' } : undefined} fill={note.isStarred ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
          className="p-1.5 rounded-lg hover:bg-black/10 transition-colors"
        >
          <MoreHorizontal size={14} style={{ color: 'var(--color-text-secondary)' }} />
        </button>
      </div>

      {/* Context menu */}
      {showMenu && (
        <div
          className="absolute top-10 right-3 z-10 rounded-xl shadow-xl border py-1 min-w-40 animate-fade-in"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={(e) => { e.stopPropagation(); pinNote(note.id); setShowMenu(false); }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5 transition-colors" style={{ color: 'var(--color-text)' }}>
            <Pin size={14} /> {note.isPinned ? 'Unpin' : 'Pin'}
          </button>
          <button onClick={handleDuplicate}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-black/5 transition-colors" style={{ color: 'var(--color-text)' }}>
            <Copy size={14} /> Duplicate
          </button>
          <div className="h-px mx-2 my-1" style={{ backgroundColor: 'var(--color-border)' }} />
          <button onClick={handleDelete}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-500 transition-colors">
            <Trash2 size={14} /> Delete
          </button>
        </div>
      )}

      {/* Badges */}
      <div className="flex items-center gap-1 mb-2">
        {note.isPinned && <Pin size={13} className="text-blue-500" />}
        {note.isStarred && <Star size={13} className="text-yellow-500" fill="currentColor" />}
        {note.subject && (
          <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
            {note.subject}
          </span>
        )}
      </div>

      {/* Title */}
      <h3
        className="font-semibold text-sm mb-2 line-clamp-2"
        style={{ color: 'var(--color-text)' }}
        dangerouslySetInnerHTML={{ __html: highlightText(note.title || 'Untitled', searchQuery) }}
      />

      {/* Content preview */}
      <p
        className="text-xs line-clamp-3 mb-3"
        style={{ color: 'var(--color-text-secondary)' }}
        dangerouslySetInnerHTML={{ __html: highlightText(preview, searchQuery) }}
      />

      {/* Checklist progress */}
      {note.checklist && note.checklist.length > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
            <span>{note.checklist.filter(i => i.completed).length}/{note.checklist.length} done</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${(note.checklist.filter(i => i.completed).length / note.checklist.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex gap-1 flex-wrap mb-2">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              <Tag size={10} />
              {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-1">
        <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {format(new Date(note.updatedAt), 'MMM d, yyyy')}
        </span>
        {note.images.length > 0 && (
          <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>📷 {note.images.length}</span>
        )}
      </div>
    </div>
  );
}
