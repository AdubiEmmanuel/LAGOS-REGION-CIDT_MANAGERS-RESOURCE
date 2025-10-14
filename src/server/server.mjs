import express from 'express';
import cors from 'cors';
import path from 'path';
import multer from 'multer';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import filesRouter from './routes/files.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Server root directory:', __dirname);
console.log('Resources directory:', path.join(__dirname, '../../public/resources/leveredge'));

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://view.officeapps.live.com'
    ],
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}));
app.use(express.json());

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
    } catch (_error) {
        console.log(`Creating directory: ${uploadPath}`);
        await fs.mkdir(uploadPath, { recursive: true });
    }
}

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