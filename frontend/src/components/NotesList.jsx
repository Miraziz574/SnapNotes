import React from 'react'
import SubjectFilter from './SubjectFilter.jsx'
import NoteCard from './NoteCard.jsx'

export default function NotesList({ notes, subjects, selectedSubject, onSubjectChange, onNoteDeleted }) {
  return (
    <div>
      <SubjectFilter
        subjects={subjects}
        selectedSubject={selectedSubject}
        onSubjectChange={onSubjectChange}
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {notes.length === 0
            ? 'No notes found'
            : `${notes.length} note${notes.length !== 1 ? 's' : ''}${selectedSubject ? ` in ${selectedSubject}` : ''}`}
        </p>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No notes yet</h3>
          <p className="text-gray-400 text-sm">
            {selectedSubject
              ? `No notes found for "${selectedSubject}". Try a different subject.`
              : 'Start by capturing a photo of your handwritten notes!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} onDelete={onNoteDeleted} />
          ))}
        </div>
      )}
    </div>
  )
}
