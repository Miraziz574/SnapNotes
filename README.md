# QuickNotes

A beautiful, production-ready note-taking web app built with React + TypeScript + Vite. Features OCR capture, smart organization, multiple themes, and PWA offline support.

## Features

- **📝 Smart Note Editor** — Auto-save, tags with AI suggestions, checklist mode, version history, image attachments
- **📷 OCR Capture** — Use your device camera or upload an image; Tesseract.js extracts the text
- **🔍 Full-text Search** — Searches titles, content, tags, and subjects with relevance ranking and search history
- **🎨 6 Themes** — Light, Dark, Ocean, Forest, Sunset, System (follows OS preference)
- **📁 Folders & Filters** — Organize notes into folders, filter by starred/pinned/date range
- **📤 Export** — PDF (jsPDF), plain text, JSON backup, clipboard copy
- **⌨️ Keyboard Shortcuts** — `Cmd/Ctrl+N` new note · `Cmd/Ctrl+K` search · `Cmd/Ctrl+S` save
- **📱 PWA** — Installable, works offline via service worker
- **🤖 AI Utilities** — Auto-tagging, subject suggestion, similar notes detection (all client-side)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | React 18 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v3 |
| State | Zustand (persisted to localStorage) |
| Routing | React Router v6 |
| Data fetching | TanStack React Query |
| OCR | Tesseract.js |
| PDF export | jsPDF + html2canvas |
| Icons | Lucide React |
| Dates | date-fns |
| PWA | vite-plugin-pwa + Workbox |

## Getting Started

```bash
npm install
npm run dev        # Development server at http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

## Project Structure

```
src/
├── types/          # TypeScript interfaces (Note, Folder, AppSettings…)
├── store/          # Zustand store — notes, folders, settings, CRUD
├── pages/          # Dashboard, Notes, NoteEditor, Camera, Search, Settings
├── components/
│   ├── Layout/     # Sidebar + Header
│   ├── Notes/      # NoteCard, NoteFilters, ChecklistItem
│   └── UI/         # Toast, Modal, Button, EmptyState, LoadingSpinner, ThemeProvider
├── hooks/          # useAutoSave, useOCR, useKeyboardShortcuts
└── utils/          # aiUtils, exportUtils, searchUtils
```

## Data Storage

All data is stored in the browser's **localStorage** under the key `quicknotes-storage`. Use **Settings → Export All Notes** to create a JSON backup you can import on another device.
