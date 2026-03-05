import Database from 'better-sqlite3'

const db = new Database('./snapnotes.db')

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT,
    subject TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    image_filename TEXT
  )
`)

export function getAllNotes() {
  return db.prepare('SELECT * FROM notes ORDER BY timestamp DESC').all()
}

export function getNotesBySubject(subject) {
  return db.prepare('SELECT * FROM notes WHERE subject = ? ORDER BY timestamp DESC').all(subject)
}

export function createNote(text, subject, imageFilename) {
  const stmt = db.prepare('INSERT INTO notes (text, subject, image_filename) VALUES (?, ?, ?)')
  const result = stmt.run(text, subject, imageFilename)
  return db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid)
}

export function getNoteById(id) {
  return db.prepare('SELECT * FROM notes WHERE id = ?').get(id)
}

export function deleteNote(id) {
  return db.prepare('DELETE FROM notes WHERE id = ?').run(id)
}

export function getAllSubjects() {
  return db.prepare('SELECT DISTINCT subject FROM notes WHERE subject IS NOT NULL ORDER BY subject').all().map(row => row.subject)
}

export default db
