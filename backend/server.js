import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fs from 'fs'
import notesRouter from './routes/notes.js'

const app = express()
const PORT = process.env.PORT || 3001

fs.mkdirSync('./uploads', { recursive: true })

app.use(cors())
app.use(express.json())

app.use('/uploads', express.static('./uploads'))
app.use('/api/notes', notesRouter)

app.listen(PORT, () => {
  console.log(`SnapNotes backend running on port ${PORT}`)
})
