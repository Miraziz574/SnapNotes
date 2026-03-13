import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  StickyNote, LayoutDashboard, Search, Camera, Settings,
  Plus, Folder, Star, Pin, ChevronRight, ChevronDown, X, FolderPlus
} from 'lucide-react';
import { useNotesStore } from '../../store/notesStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { folders, notes, addNote, addFolder, addToast } = useNotesStore();
  const [foldersExpanded, setFoldersExpanded] = useState(true);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderInput, setShowFolderInput] = useState(false);

  const handleNewNote = () => {
    const note = addNote({
      title: '',
      content: '',
      subject: '',
      folder: 'default',
      tags: [],
      isPinned: false,
      isStarred: false,
      images: [],
      color: 'default',
    });
    navigate(`/notes/${note.id}`);
    onClose();
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    addFolder({ name: newFolderName.trim(), color: '#007AFF' });
    addToast(`Folder "${newFolderName}" created`);
    setNewFolderName('');
    setShowFolderInput(false);
  };

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/notes', icon: StickyNote, label: 'All Notes' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/camera', icon: Camera, label: 'Capture' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  const noteCountForFolder = (folderId: string) => {
    if (folderId === 'default') return notes.length;
    return notes.filter(n => n.folder === folderId).length;
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
              <StickyNote size={16} className="text-white" />
            </div>
            <span className="text-base font-bold" style={{ color: 'var(--color-text)' }}>QuickNotes</span>
          </div>
          <button className="md:hidden p-1 rounded-lg hover:bg-black/5" onClick={onClose}>
            <X size={18} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        </div>

        {/* New Note Button */}
        <div className="px-4 mb-4">
          <button
            onClick={handleNewNote}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-95 shadow-sm"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            <Plus size={16} />
            New Note
            <span className="ml-auto text-xs opacity-70 hidden lg:block">⌘N</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="px-3 space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'text-white'
                    : 'hover:bg-black/5'
                }`
              }
              style={({ isActive }) => ({
                backgroundColor: isActive ? 'var(--color-primary)' : undefined,
                color: isActive ? 'white' : 'var(--color-text)',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-4 my-4 h-px" style={{ backgroundColor: 'var(--color-border)' }} />

        {/* Quick filters */}
        <div className="px-3 space-y-0.5">
          <NavLink
            to="/notes?filter=starred"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-black/5"
            style={{ color: 'var(--color-text)' }}
          >
            <Star size={16} className="text-yellow-500" />
            Starred
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              {notes.filter(n => n.isStarred).length}
            </span>
          </NavLink>
          <NavLink
            to="/notes?filter=pinned"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all hover:bg-black/5"
            style={{ color: 'var(--color-text)' }}
          >
            <Pin size={16} className="text-blue-500" />
            Pinned
            <span className="ml-auto text-xs px-1.5 py-0.5 rounded-md" style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
              {notes.filter(n => n.isPinned).length}
            </span>
          </NavLink>
        </div>

        {/* Divider */}
        <div className="mx-4 my-4 h-px" style={{ backgroundColor: 'var(--color-border)' }} />

        {/* Folders */}
        <div className="px-3">
          <button
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:bg-black/5 mb-1"
            style={{ color: 'var(--color-text-secondary)' }}
            onClick={() => setFoldersExpanded(!foldersExpanded)}
          >
            {foldersExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            FOLDERS
            <button
              className="ml-auto p-0.5 rounded hover:text-blue-500"
              onClick={(e) => { e.stopPropagation(); setShowFolderInput(true); setFoldersExpanded(true); }}
            >
              <FolderPlus size={14} />
            </button>
          </button>

          {foldersExpanded && (
            <div className="space-y-0.5 animate-fade-in">
              {folders.map((folder) => (
                <NavLink
                  key={folder.id}
                  to={folder.id === 'default' ? '/notes' : `/notes?folder=${folder.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all hover:bg-black/5"
                  style={{ color: 'var(--color-text)' }}
                >
                  <Folder size={16} style={{ color: folder.color }} />
                  <span className="flex-1 truncate">{folder.name}</span>
                  <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                    {noteCountForFolder(folder.id)}
                  </span>
                </NavLink>
              ))}

              {showFolderInput && (
                <div className="flex gap-1 px-1 py-1 animate-fade-in">
                  <input
                    autoFocus
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFolder();
                      if (e.key === 'Escape') { setShowFolderInput(false); setNewFolderName(''); }
                    }}
                    placeholder="Folder name..."
                    className="flex-1 px-2 py-1 rounded-lg text-sm outline-none border"
                    style={{ backgroundColor: 'var(--color-bg)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  />
                  <button onClick={handleAddFolder} className="px-2 py-1 rounded-lg bg-blue-500 text-white text-xs">
                    Add
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom spacer */}
        <div className="h-8" />
      </aside>
    </>
  );
}