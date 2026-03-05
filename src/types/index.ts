export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface NoteVersion {
  id: string;
  content: string;
  title: string;
  savedAt: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  subject: string;
  folder: string;
  tags: string[];
  isPinned: boolean;
  isStarred: boolean;
  images: string[];
  createdAt: string;
  updatedAt: string;
  color: string;
  checklist?: ChecklistItem[];
  reminder?: string;
  versions?: NoteVersion[];
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export type Theme = 'light' | 'dark' | 'system' | 'ocean' | 'forest' | 'sunset';
export type Font = 'sf-pro' | 'roboto' | 'georgia' | 'mono';
export type CardStyle = 'flat' | 'elevated' | 'gradient';

export interface AppSettings {
  theme: Theme;
  font: Font;
  cardStyle: CardStyle;
  accentColor: string;
  autoSave: boolean;
  biometricLock: boolean;
  showOnboarding: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export type SortField = 'updatedAt' | 'createdAt' | 'title' | 'subject';
export type SortOrder = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

export interface SearchFilters {
  query: string;
  folder: string;
  tags: string[];
  isStarred: boolean;
  isPinned: boolean;
  dateFrom: string;
  dateTo: string;
  sortField: SortField;
  sortOrder: SortOrder;
}
