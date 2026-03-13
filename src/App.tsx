import { useState, useEffect, useCallback } from 'react'

interface Note {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

type ActiveView = 'list' | 'edit' | 'new'

const STORAGE_KEY = 'quicknotes_data'

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const styles = {
  app: {
    fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    minHeight: '100vh',
    backgroundColor: '#f0f4f8',
    color: '#1a202c',
  } as React.CSSProperties,

  header: {
    backgroundColor: '#2d3748',
    color: '#fff',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  } as React.CSSProperties,

  logo: {
    fontSize: '1.3rem',
    fontWeight: 700,
    letterSpacing: '-0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,

  main: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '32px 16px',
  } as React.CSSProperties,

  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
    flexWrap: 'wrap' as const,
    gap: '12px',
  } as React.CSSProperties,

  searchInput: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #cbd5e0',
    fontSize: '0.95rem',
    width: '260px',
    outline: 'none',
    backgroundColor: '#fff',
    transition: 'border-color 0.2s',
  } as React.CSSProperties,

  btnPrimary: {
    padding: '10px 20px',
    backgroundColor: '#4a6cf7',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s, transform 0.1s',
  } as React.CSSProperties,

  btnDanger: {
    padding: '8px 14px',
    backgroundColor: 'transparent',
    color: '#e53e3e',
    border: '1px solid #e53e3e',
    borderRadius: '6px',
    fontSize: '0.85rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  btnSecondary: {
    padding: '8px 16px',
    backgroundColor: 'transparent',
    color: '#4a5568',
    border: '1px solid #cbd5e0',
    borderRadius: '6px',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,

  emptyState: {
    textAlign: 'center' as const,
    padding: '80px 24px',
    color: '#718096',
  } as React.CSSProperties,

  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '16px',
  } as React.CSSProperties,

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '16px',
  } as React.CSSProperties,

  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.15s',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,

  cardTitle: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: '#2d3748',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,

  cardPreview: {
    fontSize: '0.875rem',
    color: '#718096',
    lineHeight: 1.5,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    flex: 1,
  } as React.CSSProperties,

  cardFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '8px',
    paddingTop: '12px',
    borderTop: '1px solid #f0f4f8',
  } as React.CSSProperties,

  cardDate: {
    fontSize: '0.75rem',
    color: '#a0aec0',
  } as React.CSSProperties,

  editor: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    border: '1px solid #e2e8f0',
  } as React.CSSProperties,

  editorHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  } as React.CSSProperties,

  titleInput: {
    width: '100%',
    padding: '10px 0',
    border: 'none',
    borderBottom: '2px solid #e2e8f0',
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#2d3748',
    outline: 'none',
    backgroundColor: 'transparent',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  contentTextarea: {
    width: '100%',
    minHeight: '320px',
    padding: '16px 0',
    border: 'none',
    fontSize: '1rem',
    lineHeight: 1.75,
    color: '#4a5568',
    outline: 'none',
    resize: 'vertical' as const,
    backgroundColor: 'transparent',
    fontFamily: 'inherit',
    boxSizing: 'border-box' as const,
  } as React.CSSProperties,

  editorFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #f0f4f8',
    flexWrap: 'wrap' as const,
    gap: '12px',
  } as React.CSSProperties,

  badge: {
    display: 'inline-block',
    padding: '3px 10px',
    backgroundColor: '#ebf4ff',
    color: '#3182ce',
    borderRadius: '99px',
    fontSize: '0.78rem',
    fontWeight: 600,
  } as React.CSSProperties,
}

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as Note[]) : []
    } catch {
      return []
    }
  })

  const [view, setView] = useState<ActiveView>('list')
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const [draftTitle, setDraftTitle] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  }, [notes])

  const filteredNotes = notes
    .filter((n) => {
      const q = search.toLowerCase()
      return n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  const openNew = useCallback(() => {
    setActiveNote(null)
    setDraftTitle('')
    setDraftContent('')
    setView('new')
  }, [])

  const openEdit = useCallback((note: Note) => {
    setActiveNote(note)
    setDraftTitle(note.title)
    setDraftContent(note.content)
    setDeleteConfirm(null)
    setView('edit')
  }, [])

  const saveNote = useCallback(() => {
    const now = new Date().toISOString()
    const trimTitle = draftTitle.trim() || 'Untitled'
    const trimContent = draftContent.trim()

    if (view === 'new') {
      const newNote: Note = {
        id: generateId(),
        title: trimTitle,
        content: trimContent,
        createdAt: now,
        updatedAt: now,
      }
      setNotes((prev) => [newNote, ...prev])
    } else if (activeNote) {
      setNotes((prev) =>
        prev.map((n) =>
          n.id === activeNote.id
            ? { ...n, title: trimTitle, content: trimContent, updatedAt: now }
            : n,
        ),
      )
    }
    setView('list')
  }, [view, activeNote, draftTitle, draftContent])

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id))
      if (view === 'edit') setView('list')
      setDeleteConfirm(null)
    },
    [view],
  )

  const cancelEdit = useCallback(() => {
    setView('list')
    setDeleteConfirm(null)
  }, [])

  const isDirty =
    view === 'new'
      ? draftTitle.trim() !== '' || draftContent.trim() !== ''
      : activeNote
        ? draftTitle !== activeNote.title || draftContent !== activeNote.content
        : false

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>
          <span>📝</span>
          <span>QuickNotes</span>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#a0aec0' }}>
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </span>
      </header>

      <main style={styles.main}>
        {/* List view */}
        {view === 'list' && (
          <>
            <div style={styles.toolbar}>
              <input
                style={styles.searchInput}
                type="search"
                placeholder="Search notes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                style={styles.btnPrimary}
                onClick={openNew}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3b5bdb')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4a6cf7')
                }
              >
                + New Note
              </button>
            </div>

            {filteredNotes.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>{search ? '🔍' : '📄'}</div>
                <h2 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: '#4a5568' }}>
                  {search ? 'No matching notes' : 'No notes yet'}
                </h2>
                <p style={{ margin: 0, fontSize: '0.95rem' }}>
                  {search
                    ? 'Try a different search term.'
                    : 'Click "+ New Note" to create your first note.'}
                </p>
              </div>
            ) : (
              <div style={styles.grid}>
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    style={styles.card}
                    onClick={() => openEdit(note)}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'
                      el.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)'
                      el.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={styles.cardTitle}>{note.title || 'Untitled'}</div>
                    {note.content && (
                      <div style={styles.cardPreview}>{note.content}</div>
                    )}
                    <div style={styles.cardFooter}>
                      <span style={styles.cardDate}>{formatDate(note.updatedAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Editor view (new / edit) */}
        {(view === 'new' || view === 'edit') && (
          <div style={styles.editor}>
            <div style={styles.editorHeader}>
              <button
                style={styles.btnSecondary}
                onClick={cancelEdit}
                title="Back to list"
              >
                ← Back
              </button>
              {view === 'edit' && activeNote && (
                <span style={styles.badge}>
                  Editing
                </span>
              )}
              {view === 'new' && (
                <span style={{ ...styles.badge, backgroundColor: '#f0fff4', color: '#276749' }}>
                  New Note
                </span>
              )}
            </div>

            <input
              style={styles.titleInput}
              type="text"
              placeholder="Note title…"
              value={draftTitle}
              maxLength={120}
              onChange={(e) => setDraftTitle(e.target.value)}
              onFocus={(e) => ((e.currentTarget as HTMLInputElement).style.borderBottomColor = '#4a6cf7')}
              onBlur={(e) => ((e.currentTarget as HTMLInputElement).style.borderBottomColor = '#e2e8f0')}
              autoFocus
            />

            <textarea
              style={styles.contentTextarea}
              placeholder="Write your note here…"
              value={draftContent}
              onChange={(e) => setDraftContent(e.target.value)}
            />

            <div style={styles.editorFooter}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  style={{
                    ...styles.btnPrimary,
                    opacity: isDirty || view === 'new' ? 1 : 0.5,
                  }}
                  onClick={saveNote}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#3b5bdb')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLButtonElement).style.backgroundColor = '#4a6cf7')
                  }
                >
                  {view === 'new' ? 'Create Note' : 'Save Changes'}
                </button>
                <button style={styles.btnSecondary} onClick={cancelEdit}>
                  Cancel
                </button>
              </div>

              {view === 'edit' && activeNote && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {deleteConfirm === activeNote.id ? (
                    <>
                      <span style={{ fontSize: '0.85rem', color: '#718096' }}>Delete this note?</span>
                      <button
                        style={{ ...styles.btnDanger, backgroundColor: '#e53e3e', color: '#fff' }}
                        onClick={() => deleteNote(activeNote.id)}
                      >
                        Yes, delete
                      </button>
                      <button
                        style={styles.btnSecondary}
                        onClick={() => setDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      style={styles.btnDanger}
                      onClick={() => setDeleteConfirm(activeNote.id)}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.backgroundColor = '#fff5f5'
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLButtonElement
                        el.style.backgroundColor = 'transparent'
                      }}
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              )}

              {view === 'edit' && activeNote && (
                <span style={styles.cardDate}>
                  Last updated {formatDate(activeNote.updatedAt)}
                </span>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
