import React, { useState, useEffect } from 'react'
import Camera from './components/Camera.jsx'
import NotesList from './components/NotesList.jsx'

export default function App() {
  const [notes, setNotes] = useState([])
  const [subjects, setSubjects] = useState([])
  const [selectedSubject, setSelectedSubject] = useState('')
  const [activeTab, setActiveTab] = useState('capture')

  useEffect(() => {
    fetchNotes()
    fetchSubjects()
  }, [])

  async function fetchNotes() {
    try {
      const res = await fetch('/api/notes')
      const data = await res.json()
      setNotes(data)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    }
  }

  async function fetchSubjects() {
    try {
      const res = await fetch('/api/notes/subjects')
      const data = await res.json()
      setSubjects(data)
    } catch (err) {
      console.error('Failed to fetch subjects:', err)
    }
  }

  async function handleSubjectChange(subject) {
    setSelectedSubject(subject)
    try {
      const url = subject ? `/api/notes/filter/${encodeURIComponent(subject)}` : '/api/notes'
      const res = await fetch(url)
      const data = await res.json()
      setNotes(data)
    } catch (err) {
      console.error('Failed to filter notes:', err)
    }
  }

  function handleNoteAdded(note) {
    setNotes(prev => [note, ...prev])
    setSubjects(prev => prev.includes(note.subject) ? prev : [...prev, note.subject].sort())
  }

  function handleNoteDeleted(id) {
    setNotes(prev => prev.filter(n => n.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-5 text-center">
          <h1 className="text-3xl font-bold tracking-tight">SnapNotes 📝</h1>
          <p className="text-purple-100 mt-1 text-sm">Capture &amp; Organize Your Notes</p>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 flex">
          <button
            onClick={() => setActiveTab('capture')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'capture'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📷 Capture
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-3 text-sm font-semibold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'notes'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            📚 My Notes
            {notes.length > 0 && (
              <span className="bg-purple-100 text-purple-700 text-xs rounded-full px-2 py-0.5">
                {notes.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        {activeTab === 'capture' ? (
          <Camera onNoteAdded={(note) => { handleNoteAdded(note); setActiveTab('notes') }} />
        ) : (
          <NotesList
            notes={notes}
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSubjectChange={handleSubjectChange}
            onNoteDeleted={handleNoteDeleted}
          />
        )}
      </main>
    </div>
  )
}
