import React from 'react'

export default function SubjectFilter({ subjects, selectedSubject, onSubjectChange }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Filter by Subject:
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => onSubjectChange('')}
          className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            selectedSubject === ''
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600'
          }`}
        >
          All
        </button>
        {subjects.map(subject => (
          <button
            key={subject}
            onClick={() => onSubjectChange(subject)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              selectedSubject === subject
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-purple-400 hover:text-purple-600'
            }`}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  )
}
