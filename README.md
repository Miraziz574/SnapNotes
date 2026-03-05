# QuickNotes

A polished, iOS/macOS-style notes application with AI-powered text extraction. Capture images of handwritten notes, textbooks, or whiteboards, and QuickNotes uses Google Gemini AI to extract the text and organize it by subject.

## Features

- 📷 **Camera Capture** — Use your device camera to photograph notes, documents, or whiteboards
- 🤖 **AI Text Extraction** — Google Gemini Vision extracts and categorizes text automatically
- 📚 **Subject Filtering** — Notes are automatically tagged with subjects (Math, Physics, etc.)
- 🔍 **Search** — Full-text search across all your notes
- 📋 **Copy to Clipboard** — Copy note text with one tap
- 🗑️ **Delete Notes** — Remove notes with confirmation dialog
- 🌙 **Dark Mode** — Full light & dark mode support
- 💾 **Local SQLite Storage** — All data stored locally with better-sqlite3

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS** (Apple-inspired custom config)
- **better-sqlite3** (SQLite database)
- **@google/generative-ai** (Gemini Vision API)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Gemini API Key

Copy the example env file and add your key:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free API key at [Google AI Studio](https://makersuite.google.com/app/apikey).

> **Note:** The app works without a Gemini API key — camera capture and note storage still function, but AI text extraction will show a placeholder message.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production

```bash
npm run build
npm start
```

## Usage

1. **Notes Tab** — Browse all saved notes, filter by subject, search, copy, or delete
2. **Camera Tab** — Tap the shutter button to capture an image, then "Extract Text" to run AI extraction
3. **Settings Tab** — Toggle dark mode, view API key configuration instructions

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── notes/route.ts       # GET notes, DELETE note
│   │   └── capture/route.ts     # POST image → AI extraction + save
│   ├── camera/page.tsx          # Camera capture page
│   ├── settings/page.tsx        # Settings page
│   ├── layout.tsx               # Root layout with BottomNav
│   ├── page.tsx                 # Notes list (home)
│   └── globals.css
├── components/
│   ├── BottomNav.tsx            # iOS-style tab bar
│   ├── NoteCard.tsx             # Note card with actions
│   ├── SubjectPill.tsx          # Subject filter pill
│   └── LoadingSpinner.tsx       # Activity indicator
├── lib/
│   ├── db.ts                    # SQLite database layer
│   └── gemini.ts                # Gemini AI integration
└── quicknotes.db                # Auto-created SQLite database
```

## License

MIT