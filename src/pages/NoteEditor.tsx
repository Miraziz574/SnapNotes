import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Star, Pin, Tag, Folder,  Trash2, CheckSquare,
  Image, Download,  Clock, RotateCcw, Palette, X, Plus, AlignLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useNotesStore } from '../store/notesStore';
import { useAutoSave } from '../hooks/useAutoSave';
import { ChecklistItemComponent } from '../components/Notes/ChecklistItem';
import type { ChecklistItem } from '../types';
import { exportAsPDF, exportAsTXT, copyToClipboard } from '../utils/exportUtils';
import { autoTag, suggestSubject, findSimilarNotes } from '../utils/aiUtils';

import { Modal } from '../components/UI/Modal';

const COLORS = ['default', 'blue', 'green', 'yellow', 'red', 'purple', 'pink', 'orange'];
const COLOR_DOTS: Record<string, string> = {
  default: '#007AFF', blue: '#3B82F6', green: '#10B981', yellow: '#F59E0B',
  red: '#EF4444', purple: '#8B5CF6', pink: '#EC4899', orange: '#F97316',
};

export function NoteEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getNoteById, updateNote, deleteNote, addToast, folders, saveVersion, notes, settings } = useNotesStore();

  const note = getNoteById(id!);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [folder, setFolder] = useState(note?.folder || 'default');
  const [subject, setSubject] = useState(note?.subject || '');
  const [color, setColor] = useState(note?.color || 'default');
  const [checklist, setChecklist] = useState(note?.checklist || []);
  const [mode, setMode] = useState<'text' | 'checklist'>(note?.checklist?.length ? 'checklist' : 'text');
  const [isSaving, setIsSaving] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showVersions, setShowVersions] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!note) { navigate('/notes'); return; }
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags);
    setFolder(note.folder);
    setSubject(note.subject);
    setColor(note.color);
    setChecklist(note.checklist || []);
    setMode(note.checklist?.length ? 'checklist' : 'text');
  }, [id]);

  const save = useCallback(() => {
    if (!id) return;
    setIsSaving(true);
    updateNote(id, { title, content, tags, folder, subject, color, checklist: mode === 'checklist' ? checklist : undefined });
    setTimeout(() => setIsSaving(false), 500);
  }, [id, title, content, tags, folder, subject, color, checklist, mode, updateNote]);

  useAutoSave(save, [title, content, tags, folder, subject, color, checklist, mode], 2000, settings.autoSave);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        save();
        addToast('Note saved');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [save, addToast]);

  // Run AI suggestions when content becomes substantial enough
  const contentSnippet = content.length > 30 ? content.slice(0, 100) : '';
  useEffect(() => {
    if (!contentSnippet) return;
    const suggested = autoTag(title, contentSnippet);
    setAiSuggestions(suggested.filter(t => !tags.includes(t)).slice(0, 3));
    if (!subject) setSubject(suggestSubject(title, contentSnippet));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentSnippet]);

  if (!note) return null;

  const handleDelete = () => {
    if (confirm('Delete this note? This cannot be undone.')) {
      deleteNote(id!);
      addToast('Note deleted');
      navigate('/notes');
    }
  };

  const addTag = (tag: string) => {
    const t = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      updateNote(id!, { images: [...(note.images || []), base64] });
      addToast('Image added');
    };
    reader.readAsDataURL(file);
  };

  const addChecklistItem = () => {
    const item: ChecklistItem = { id: `cl-${Date.now()}`, text: '', completed: false };
    setChecklist([...checklist, item]);
  };

  const toggleChecklistItem = (itemId: string) => {
    setChecklist(checklist.map(i => i.id === itemId ? { ...i, completed: !i.completed } : i));
  };

  const deleteChecklistItem = (itemId: string) => {
    setChecklist(checklist.filter(i => i.id !== itemId));
  };

  const updateChecklistText = (itemId: string, text: string) => {
    setChecklist(checklist.map(i => i.id === itemId ? { ...i, text } : i));
  };

  const similarNotes = findSimilarNotes({ ...note, tags, subject }, notes);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center gap-2 px-4 py-3 backdrop-blur-sm"
        style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <button onClick={() => { save(); navigate(-1); }} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
          <ArrowLeft size={20} style={{ color: 'var(--color-text)' }} />
        </button>

        <div className="flex-1" />

        {isSaving && <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Saving...</span>}

        <button onClick={() => { updateNote(id!, { isPinned: !note.isPinned }); addToast(note.isPinned ? 'Unpinned' : 'Pinned'); }}
          className="p-2 rounded-xl hover:bg-black/5 transition-colors">
          <Pin size={18} className={note.isPinned ? 'text-blue-500' : ''} style={!note.isPinned ? { color: 'var(--color-text-secondary)' } : undefined} />
        </button>

        <button onClick={() => { updateNote(id!, { isStarred: !note.isStarred }); addToast(note.isStarred ? 'Unstarred' : 'Starred ⭐'); }}
          className="p-2 rounded-xl hover:bg-black/5 transition-colors">
          <Star size={18} className={note.isStarred ? 'text-yellow-500' : ''} fill={note.isStarred ? 'currentColor' : 'none'} style={!note.isStarred ? { color: 'var(--color-text-secondary)' } : undefined} />
        </button>

        <button onClick={() => setShowColorPicker(!showColorPicker)} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
          <Palette size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        <button onClick={() => { saveVersion(id!); addToast('Version saved'); }} className="p-2 rounded-xl hover:bg-black/5 transition-colors" title="Save version">
          <Clock size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        <button onClick={() => setShowExport(true)} className="p-2 rounded-xl hover:bg-black/5 transition-colors">
          <Download size={18} style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        <button onClick={handleDelete} className="p-2 rounded-xl hover:bg-red-50 transition-colors">
          <Trash2 size={18} className="text-red-400" />
        </button>
      </div>

      {/* Color picker */}
      {showColorPicker && (
        <div className="px-4 py-2 flex gap-2 items-center border-b animate-fade-in" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <span className="text-xs mr-1" style={{ color: 'var(--color-text-secondary)' }}>Color:</span>
          {COLORS.map((c) => (
            <button key={c} onClick={() => { setColor(c); setShowColorPicker(false); }}
              className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${color === c ? 'border-gray-800 scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: COLOR_DOTS[c] }}
            />
          ))}
        </div>
      )}

      <div className="flex-1 max-w-3xl mx-auto w-full p-4 md:p-6">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title..."
          className="w-full text-2xl md:text-3xl font-bold bg-transparent outline-none mb-4 placeholder-gray-400"
          style={{ color: 'var(--color-text)' }}
        />

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 mb-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
          {/* Subject */}
          <div className="flex items-center gap-1.5">
            <AlignLeft size={14} style={{ color: 'var(--color-text-secondary)' }} />
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject..."
              className="text-xs bg-transparent outline-none border-b border-dashed"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', minWidth: '80px' }}
            />
          </div>

          {/* Folder */}
          <div className="flex items-center gap-1.5">
            <Folder size={14} style={{ color: 'var(--color-text-secondary)' }} />
            <select
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              className="text-xs bg-transparent outline-none border-b border-dashed cursor-pointer"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            >
              {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5">
            <Clock size={14} style={{ color: 'var(--color-text-secondary)' }} />
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              {format(new Date(note.updatedAt), 'MMM d, yyyy HH:mm')}
            </span>
          </div>

          {/* Mode toggle */}
          <div className="ml-auto flex gap-1 border rounded-lg p-0.5" style={{ borderColor: 'var(--color-border)' }}>
            <button onClick={() => setMode('text')}
              className={`px-2 py-1 rounded text-xs transition-colors ${mode === 'text' ? 'text-white' : ''}`}
              style={mode === 'text' ? { backgroundColor: 'var(--color-primary)' } : { color: 'var(--color-text-secondary)' }}>
              <AlignLeft size={12} />
            </button>
            <button onClick={() => setMode('checklist')}
              className={`px-2 py-1 rounded text-xs transition-colors ${mode === 'checklist' ? 'text-white' : ''}`}
              style={mode === 'checklist' ? { backgroundColor: 'var(--color-primary)' } : { color: 'var(--color-text-secondary)' }}>
              <CheckSquare size={12} />
            </button>
          </div>
        </div>

        {/* Content / Checklist */}
        {mode === 'text' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your note..."
            className="note-editor w-full bg-transparent outline-none resize-none"
            style={{ color: 'var(--color-text)', minHeight: '300px' }}
          />
        ) : (
          <div className="space-y-1">
            {checklist.map((item) => (
              <ChecklistItemComponent
                key={item.id}
                item={item}
                onToggle={toggleChecklistItem}
                onDelete={deleteChecklistItem}
                onTextChange={updateChecklistText}
              />
            ))}
            <button onClick={addChecklistItem}
              className="flex items-center gap-2 text-sm mt-2 hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-primary)' }}>
              <Plus size={14} /> Add item
            </button>
          </div>
        )}

        {/* Images */}
        {note.images && note.images.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Images</h4>
            <div className="flex gap-2 flex-wrap">
              {note.images.map((img, i) => (
                <div key={i} className="relative group">
                  <img src={img} alt="" className="w-24 h-24 object-cover rounded-xl border" style={{ borderColor: 'var(--color-border)' }} />
                  <button
                    onClick={() => updateNote(id!, { images: note.images.filter((_, idx) => idx !== i) })}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add image button */}
        <div className="mt-6 flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl border hover:bg-black/5 transition-colors"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
          >
            <Image size={14} /> Add Image
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        {/* Tags */}
        <div className="mt-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={14} style={{ color: 'var(--color-text-secondary)' }} />
            {tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                style={{ backgroundColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}>
                #{tag}
                <button onClick={() => setTags(tags.filter(t => t !== tag))}>
                  <X size={10} />
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(tagInput); }
                if (e.key === 'Backspace' && !tagInput && tags.length > 0) setTags(tags.slice(0, -1));
              }}
              placeholder="Add tag..."
              className="text-xs bg-transparent outline-none"
              style={{ color: 'var(--color-text)', minWidth: '80px' }}
            />
          </div>

          {/* AI tag suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="mt-2 flex items-center gap-1 flex-wrap">
              <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>Suggested:</span>
              {aiSuggestions.map((s) => (
                <button key={s} onClick={() => { addTag(s); setAiSuggestions(aiSuggestions.filter(a => a !== s)); }}
                  className="text-xs px-2 py-0.5 rounded-full border border-dashed hover:bg-black/5 transition-colors"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                  +{s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Similar notes */}
        {similarNotes.length > 0 && (
          <div className="mt-8">
            <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>Similar Notes</h4>
            <div className="flex gap-2 flex-wrap">
              {similarNotes.map((n) => (
                <button key={n.id} onClick={() => navigate(`/notes/${n.id}`)}
                  className="text-xs px-3 py-1.5 rounded-xl border hover:bg-black/5 transition-colors"
                  style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                  {n.title || 'Untitled'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Version history */}
        {note.versions && note.versions.length > 0 && (
          <div className="mt-8">
            <button onClick={() => setShowVersions(!showVersions)}
              className="flex items-center gap-2 text-sm font-medium mb-2"
              style={{ color: 'var(--color-text-secondary)' }}>
              <RotateCcw size={14} /> {note.versions.length} Version{note.versions.length !== 1 ? 's' : ''}
            </button>
            {showVersions && (
              <div className="space-y-2 animate-fade-in">
                {[...note.versions].reverse().map((v) => (
                  <div key={v.id} className="card-flat rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: 'var(--color-text)' }}>{v.title || 'Untitled'}</span>
                      <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{format(new Date(v.savedAt), 'MMM d HH:mm')}</span>
                    </div>
                    <p className="text-xs line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>{v.content}</p>
                    <button onClick={() => { setContent(v.content); setTitle(v.title); addToast('Version restored'); }}
                      className="text-xs mt-2" style={{ color: 'var(--color-primary)' }}>
                      Restore this version
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Export modal */}
      <Modal isOpen={showExport} onClose={() => setShowExport(false)} title="Export Note">
        <div className="space-y-2">
          {[
            { label: '📄 Export as PDF', action: async () => { await exportAsPDF({ ...note, title, content, tags, subject }); setShowExport(false); } },
            { label: '📝 Export as TXT', action: () => { exportAsTXT({ ...note, title, content, tags, subject }); setShowExport(false); } },
            { label: '📋 Copy to Clipboard', action: async () => { await copyToClipboard(`${title}\n\n${content}`); addToast('Copied!'); setShowExport(false); } },
          ].map(({ label, action }) => (
            <button key={label} onClick={action}
              className="w-full text-left px-4 py-3 rounded-xl border hover:bg-black/5 transition-colors text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
              {label}
            </button>
          ))}
        </div>
      </Modal>
    </div>
  );
}
