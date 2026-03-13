import type { Note } from '../types';

export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="search-highlight">$1</mark>');
}

export function searchNotes(notes: Note[], query: string): Note[] {
  if (!query.trim()) return notes;
  const q = query.toLowerCase();
  return notes.filter(
    (n) =>
      n.title.toLowerCase().includes(q) ||
      n.content.toLowerCase().includes(q) ||
      n.tags.some((t) => t.toLowerCase().includes(q)) ||
      n.subject.toLowerCase().includes(q)
  );
}

export function getSearchScore(note: Note, query: string): number {
  if (!query.trim()) return 0;
  const q = query.toLowerCase();
  let score = 0;
  if (note.title.toLowerCase().includes(q)) score += 3;
  if (note.subject.toLowerCase().includes(q)) score += 2;
  if (note.tags.some((t) => t.toLowerCase().includes(q))) score += 2;
  if (note.content.toLowerCase().includes(q)) score += 1;
  return score;
}