import type { Note } from '../types';

const SUBJECT_KEYWORDS: Record<string, string[]> = {
  Mathematics: ['math', 'calculus', 'algebra', 'geometry', 'equation', 'derivative', 'integral', 'matrix', 'vector', 'theorem', 'proof', 'function', 'polynomial', 'trigonometry', 'statistics'],
  History: ['history', 'war', 'century', 'revolution', 'empire', 'dynasty', 'civilization', 'battle', 'treaty', 'independence', 'king', 'queen', 'president', 'democracy', 'colonialism'],
  Biology: ['biology', 'cell', 'dna', 'gene', 'protein', 'organism', 'species', 'evolution', 'mitosis', 'meiosis', 'photosynthesis', 'ecosystem', 'anatomy', 'membrane', 'nucleus'],
  Chemistry: ['chemistry', 'element', 'compound', 'molecule', 'atom', 'reaction', 'periodic', 'bond', 'acid', 'base', 'solution', 'mole', 'oxidation', 'electron', 'proton'],
  Physics: ['physics', 'force', 'energy', 'mass', 'velocity', 'acceleration', 'momentum', 'gravity', 'quantum', 'wave', 'frequency', 'electric', 'magnetic', 'thermodynamics', 'optics'],
  Literature: ['literature', 'novel', 'poem', 'author', 'character', 'plot', 'theme', 'metaphor', 'symbolism', 'shakespeare', 'narrative', 'protagonist', 'antagonist', 'genre', 'fiction'],
  Personal: ['goal', 'task', 'todo', 'habit', 'personal', 'daily', 'weekly', 'reminder', 'plan', 'schedule', 'journal', 'diary', 'mood', 'feeling', 'reflection'],
  Computer: ['code', 'programming', 'algorithm', 'function', 'class', 'object', 'database', 'api', 'javascript', 'python', 'react', 'html', 'css', 'software', 'development'],
};

export function autoTag(title: string, content: string): string[] {
  const text = `${title} ${content}`.toLowerCase();
  const words = text.match(/\b[a-z]{3,}\b/g) || [];
  const wordFreq: Record<string, number> = {};
  
  words.forEach((w) => {
    // Filter common stop words
    const stopWords = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'its', 'may', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'does', 'that', 'this', 'with', 'have', 'from', 'they', 'will', 'been', 'said', 'each', 'which', 'their', 'what', 'about', 'would', 'there', 'could', 'other', 'into', 'more', 'very', 'also', 'some', 'than', 'then', 'when', 'well', 'much', 'most', 'such', 'just']);
    if (!stopWords.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  });

  const tags = Object.entries(wordFreq)
    .filter(([word, count]) => count >= 1 && !['note', 'notes', 'write', 'written'].includes(word))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);

  return [...new Set(tags)];
}

export function autoFolder(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  
  let bestSubject = 'default';
  let bestScore = 0;

  for (const [subject, keywords] of Object.entries(SUBJECT_KEYWORDS)) {
    const score = keywords.reduce((sum, kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      const matches = text.match(regex);
      return sum + (matches ? matches.length : 0);
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestSubject = subject;
    }
  }

  return bestScore > 0 ? bestSubject : 'default';
}

export function suggestSubject(title: string, content: string): string {
  return autoFolder(title, content);
}

export function summarize(content: string, maxLength = 150): string {
  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  let summary = '';
  for (const sentence of sentences) {
    if (summary.length + sentence.length > maxLength) break;
    summary += sentence.trim() + '. ';
  }
  return summary.trim() || content.slice(0, maxLength) + (content.length > maxLength ? '...' : '');
}

export function detectDuplicates(note: Partial<Note>, allNotes: Note[]): Note[] {
  if (!note.content || note.content.length < 20) return [];
  
  const noteWords = new Set((note.content.toLowerCase().match(/\b[a-z]{4,}\b/g) || []));
  
  return allNotes.filter((n) => {
    if (n.id === note.id) return false;
    const nWords = new Set((n.content.toLowerCase().match(/\b[a-z]{4,}\b/g) || []));
    const intersection = [...noteWords].filter((w) => nWords.has(w)).length;
    const union = new Set([...noteWords, ...nWords]).size;
    const similarity = union > 0 ? intersection / union : 0;
    return similarity > 0.6;
  });
}

export function findSimilarNotes(note: Note, allNotes: Note[]): Note[] {
  const noteTags = new Set(note.tags);
  
  return allNotes
    .filter((n) => n.id !== note.id)
    .map((n) => {
      const nTags = new Set(n.tags);
      const commonTags = [...noteTags].filter((t) => nTags.has(t)).length;
      const subjectMatch = n.subject === note.subject ? 2 : 0;
      const score = commonTags + subjectMatch;
      return { note: n, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ note: n }) => n);
}
