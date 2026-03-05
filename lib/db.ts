import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'quicknotes.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema(db);
  }
  return db;
}

function initializeSchema(database: Database.Database): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      subject TEXT NOT NULL DEFAULT 'General',
      image_data TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

export interface Note {
  id: number;
  text: string;
  subject: string;
  image_data: string | null;
  created_at: string;
}

export function getNotes(subject?: string): Note[] {
  const database = getDb();
  if (subject && subject !== 'All') {
    const stmt = database.prepare(
      'SELECT id, text, subject, image_data, created_at FROM notes WHERE subject = ? ORDER BY created_at DESC'
    );
    return stmt.all(subject) as Note[];
  }
  const stmt = database.prepare(
    'SELECT id, text, subject, image_data, created_at FROM notes ORDER BY created_at DESC'
  );
  return stmt.all() as Note[];
}

export function createNote(
  text: string,
  subject: string,
  imageData?: string
): Note {
  const database = getDb();
  const stmt = database.prepare(
    'INSERT INTO notes (text, subject, image_data, created_at) VALUES (?, ?, ?, datetime(\'now\')) RETURNING *'
  );
  const result = stmt.get(text, subject, imageData ?? null) as Note;
  return result;
}

export function deleteNote(id: number): boolean {
  const database = getDb();
  const stmt = database.prepare('DELETE FROM notes WHERE id = ?');
  const result = stmt.run(id);
  return result.changes > 0;
}

export function getSubjects(): string[] {
  const database = getDb();
  const stmt = database.prepare(
    'SELECT DISTINCT subject FROM notes ORDER BY subject ASC'
  );
  const rows = stmt.all() as { subject: string }[];
  return rows.map((r) => r.subject);
}
