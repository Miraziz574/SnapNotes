# SnapNotes 📝

SnapNotes is a full-stack web application that lets you capture photos of handwritten notes, extract the text using Google Gemini AI, and organize them by subject.

## Features

- 📷 **Live camera capture** — take photos directly in the browser
- 🤖 **AI-powered text extraction** — uses Google Gemini 2.0 Flash to read handwriting
- 🏷️ **Automatic subject detection** — notes are categorized (Math, Science, History, etc.)
- 🔍 **Filter by subject** — quickly find notes by topic
- 📋 **Copy to clipboard** — one-click text copying
- 🗑️ **Delete notes** — manage your note library
- 📱 **Mobile-first design** — works great on phones and desktops

## Prerequisites

- **Node.js 18+**
- **Google Gemini API key** (free tier available)

## Getting a Gemini API Key

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API Key**
4. Copy the key for the setup step below

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

### Frontend

```bash
cd frontend
npm install
```

## Running in Development

Start the backend (in one terminal):

```bash
cd backend
npm run dev
```

Start the frontend (in another terminal):

```bash
cd frontend
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

> The frontend dev server proxies `/api` and `/uploads` requests to the backend on port 3001.

## Project Structure

```
SnapNotes/
├── backend/
│   ├── routes/
│   │   └── notes.js      # API routes
│   ├── db.js             # SQLite database helpers
│   ├── gemini.js         # Google Gemini AI integration
│   ├── server.js         # Express server entry point
│   ├── .env.example      # Environment variable template
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Camera.jsx        # Camera capture UI
    │   │   ├── NoteCard.jsx      # Individual note display
    │   │   ├── NotesList.jsx     # Notes grid view
    │   │   └── SubjectFilter.jsx # Subject filter buttons
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    └── package.json
```

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, better-sqlite3
- **AI**: Google Gemini 2.0 Flash
