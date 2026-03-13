import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore } from '../store/notesStore';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const addNote = useNotesStore((s) => s.addNote);
  const addToast = useNotesStore((s) => s.addToast);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (!isMod) return;

      switch (e.key.toLowerCase()) {
        case 'n': {
          e.preventDefault();
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
          break;
        }
        case 'k':
          e.preventDefault();
          navigate('/search');
          break;
        case '/':
          e.preventDefault();
          navigate('/search');
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, addNote, addToast]);
}