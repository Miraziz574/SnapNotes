import express from 'express'
import multer, { memoryStorage } from 'multer'
import fs from 'fs'
import path from 'path'
import rateLimit from 'express-rate-limit'
import { getAllNotes, getNotesBySubject, createNote, getAllSubjects, deleteNote, getNoteById } from '../db.js'
import { extractTextAndSubject } from '../gemini.js'

const router = express.Router()
const upload = multer({ storage: memoryStorage() })

const captureLimit = rateLimit({ windowMs: 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false })
const deleteLimit = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false })

// POST /api/notes/capture
router.post('/capture', captureLimit, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No photo uploaded' })
    }

    const imageBase64 = req.file.buffer.toString('base64')
    const mimeType = req.file.mimetype || 'image/jpeg'

    const { text, subject } = await extractTextAndSubject(imageBase64, mimeType)

    const imageFilename = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`
    fs.writeFileSync(path.join('./uploads', imageFilename), req.file.buffer)

    const note = createNote(text, subject, imageFilename)
    res.status(201).json(note)
  } catch (err) {
    console.error('Capture error:', err)
    res.status(500).json({ error: err.message || 'Failed to process image' })
  }
})

// GET /api/notes
router.get('/', (req, res) => {
  try {
    const notes = getAllNotes()
    res.json(notes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/notes/subjects
router.get('/subjects', (req, res) => {
  try {
    const subjects = getAllSubjects()
    res.json(subjects)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/notes/filter/:subject
router.get('/filter/:subject', (req, res) => {
  try {
    const notes = getNotesBySubject(req.params.subject)
    res.json(notes)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/notes/:id
router.delete('/:id', deleteLimit, (req, res) => {
  try {
    const note = getNoteById(Number(req.params.id))
    const result = deleteNote(Number(req.params.id))
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Note not found' })
    }
    if (note && note.image_filename) {
      const imgPath = path.join('./uploads', note.image_filename)
      fs.unlink(imgPath, () => {})
    }
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
