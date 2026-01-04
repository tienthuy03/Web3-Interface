import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 4000

app.use(cors())

// đảm bảo folder tồn tại
const imageDir = path.join(__dirname, 'public/images')
const docDir = path.join(__dirname, 'public/documents')

fs.mkdirSync(imageDir, { recursive: true })
fs.mkdirSync(docDir, { recursive: true })

// cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, imageDir)
        } else {
            cb(null, docDir)
        }
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + '-' + file.originalname
        cb(null, uniqueName)
    }
})

const upload = multer({ storage })

// static file
app.use('/public', express.static(path.join(__dirname, 'public')))

// API upload
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const folder = req.file.mimetype.startsWith('image/')
        ? 'images'
        : 'documents'

    res.json({
        success: true,
        path: `/public/${folder}/${req.file.filename}`
    })
})

app.listen(PORT, () => {
    console.log(`🚀 Upload server running at http://localhost:${PORT}`)
})
