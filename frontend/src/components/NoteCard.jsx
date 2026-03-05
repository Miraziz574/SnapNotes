import React, { useState } from 'react'

const SUBJECT_COLORS = {
  Math: 'bg-blue-100 text-blue-700',
  Mathematics: 'bg-blue-100 text-blue-700',
  Science: 'bg-green-100 text-green-700',
  Biology: 'bg-emerald-100 text-emerald-700',
  Chemistry: 'bg-yellow-100 text-yellow-700',
  Physics: 'bg-cyan-100 text-cyan-700',
  History: 'bg-amber-100 text-amber-700',
  English: 'bg-pink-100 text-pink-700',
  Literature: 'bg-rose-100 text-rose-700',
  Geography: 'bg-teal-100 text-teal-700',
  'Computer Science': 'bg-indigo-100 text-indigo-700',
  Art: 'bg-purple-100 text-purple-700',
  Music: 'bg-fuchsia-100 text-fuchsia-700',
  General: 'bg-gray-100 text-gray-600',
}

function getSubjectColor(subject) {
  return SUBJECT_COLORS[subject] || 'bg-gray-100 text-gray-600'
}

export default function NoteCard({ note, onDelete }) {
  const [showFull, setShowFull] = useState(false)
  const [copied, setCopied] = useState(false)

  const text = note.text || ''
  const isLong = text.length > 150
  const displayText = showFull || !isLong ? text : text.slice(0, 150) + '…'

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback silent fail
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this note? This cannot be undone.')) return
    try {
      const res = await fetch(`/api/notes/${note.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        alert('Failed to delete note: ' + (data.error || 'Server error'))
        return
      }
      onDelete(note.id)
    } catch (err) {
      alert('Failed to delete note: ' + err.message)
    }
  }

  const formattedDate = note.timestamp
    ? new Date(note.timestamp).toLocaleString()
    : ''

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col overflow-hidden">
      {note.image_filename && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={`/uploads/${note.image_filename}`}
            alt="Note"
            className="w-full h-full object-cover"
            onError={e => { e.target.style.display = 'none' }}
          />
        </div>
      )}

      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getSubjectColor(note.subject)}`}>
            {note.subject || 'General'}
          </span>
          <span className="text-xs text-gray-400 shrink-0">{formattedDate}</span>
        </div>

        <p className="text-gray-700 text-sm leading-relaxed flex-1 whitespace-pre-wrap break-words">
          {displayText}
        </p>

        {isLong && (
          <button
            onClick={() => setShowFull(p => !p)}
            className="text-xs text-purple-600 hover:text-purple-800 font-medium self-start"
          >
            {showFull ? 'Show less ▲' : 'Show more ▼'}
          </button>
        )}

        <div className="flex items-center gap-2 pt-1 border-t border-gray-50 mt-1">
          <button
            onClick={handleCopy}
            title="Copy text"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors px-2 py-1 rounded-lg hover:bg-purple-50"
          >
            {copied ? '✅ Copied' : '📋 Copy'}
          </button>
          <button
            onClick={handleDelete}
            title="Delete note"
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 ml-auto"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  )
}
