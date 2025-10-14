import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import filesRouter from './routes/files.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log the directory path for debugging
console.log('Server root directory:', __dirname);
console.log('Resources directory:', path.join(__dirname, '../../public/resources/leveredge'));

const app = express();
const port = process.env.PORT || 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../../public/resources/leveredge');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Sanitize filename
        const sanitizedName = file.originalname
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9.-]/g, '');
        cb(null, sanitizedName);
    }
});

const upload = multer({ storage: storage });

// Enable CORS and JSON parsing
app.use(cors({
    origin: ['http://localhost:5173', 'https://view.officeapps.live.com'],
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

// Import routes
import filesRouter from './routes/files.js';

// Use routes
app.use('/api', filesRouter);

// Serve static files with proper headers
app.use('/resources', (_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cross-Origin-Embedder-Policy', 'credentialless');
    next();
}, express.static(path.join(__dirname, '../../public/resources')));

// Ensure upload directory exists
async function ensureUploadDirectory() {
    const uploadPath = path.join(__dirname, '../../public/resources/leveredge');
    try {
        await fs.access(uploadPath);
    } catch (error) {
        await fs.mkdir(uploadPath, { recursive: true });
    }
}

// File listing endpoint
app.get('/api/files', async (req, res) => {
    try {
        const directoryPath = path.join(__dirname, '../../public/resources/leveredge');
        const files = await fs.readdir(directoryPath);

        const filePromises = files
            .filter(file => !file.startsWith('.'))
            .map(async (file) => {
                const filePath = path.join(directoryPath, file);
                const stats = await fs.stat(filePath);
                return {
                    name: file,
                    url: `/resources/leveredge/${file}`,
                    size: stats.size,
                    uploadDate: stats.mtime.toISOString().split('T')[0]
                };
            });

        const fileDetails = await Promise.all(filePromises);
        res.json(fileDetails);
    } catch (error) {
        console.error('Error reading directory:', error);
        res.status(500).json({ error: 'Unable to read directory' });
    }
});

// File upload endpoint
app.post('/api/files/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({ 
        message: 'File uploaded successfully',
        file: {
            name: req.file.filename,
            url: `/resources/leveredge/${req.file.filename}`,
            size: req.file.size,
            uploadDate: new Date().toISOString().split('T')[0]
        }
    });
});

// Delete file endpoint
app.delete('/api/files/:filename', async (req, res) => {
    try {
        const filePath = path.join(__dirname, '../../public/resources/leveredge', req.params.filename);
        await fs.unlink(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Unable to delete file' });
    }
});

// Rename file endpoint
app.put('/api/files/:filename', async (req, res) => {
    try {
        const oldPath = path.join(__dirname, '../../public/resources/leveredge', req.params.filename);
        const newName = req.body.newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9.-]/g, '');
        const newPath = path.join(__dirname, '../../public/resources/leveredge', newName);

        await fs.rename(oldPath, newPath);
        res.json({ 
            message: 'File renamed successfully',
            newName: newName,
            url: `/resources/leveredge/${newName}`
        });
    } catch (error) {
        console.error('Error renaming file:', error);
        res.status(500).json({ error: 'Unable to rename file' });
    }
});

// Start server
async function startServer() {
    try {
        await ensureUploadDirectory();
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1);
    }
}

startServer();