import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import notesRouter from './routes/notes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

fs.mkdirSync('./uploads', { recursive: true })

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static('./uploads'))
app.use('/api/notes', notesRouter)

// Serve static frontend build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/dist/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`QuickNotes backend running on port ${PORT}`)
})
