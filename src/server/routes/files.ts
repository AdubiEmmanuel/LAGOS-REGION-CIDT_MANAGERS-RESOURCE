import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

type FileInfo = {
    name: string;
    url: string;
    size: number;
    uploadDate: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        const uploadPath = path.join(__dirname, '../../../public/resources/leveredge');
        cb(null, uploadPath);
    },
    filename: function (_req, file, cb) {
        // Sanitize filename - replace spaces with hyphens and make lowercase
        const sanitizedName = file.originalname
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9.-]/g, '');
        cb(null, sanitizedName);
    }
});

const upload = multer({ storage: storage });

// Set Content-Security-Policy header to allow Microsoft Office Online viewer
router.use((_req, res, next) => {
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self' https://view.officeapps.live.com");
    next();
});



// Get list of files
router.get('/files', async (_req, res) => {
    try {
        // Ensure the resources directory exists
        const directoryPath = path.join(__dirname, '../../../public/resources/leveredge');
        
        console.log('Directory path:', directoryPath);
        
        try {
            await fs.access(directoryPath);
        } catch {
            console.log('Creating directory:', directoryPath);
            await fs.mkdir(directoryPath, { recursive: true });
        }
        
        const files = await fs.readdir(directoryPath);
        console.log('Files found:', files);

        // Filter out system files and get file stats
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
                } as FileInfo;
            });

        const fileDetails = await Promise.all(filePromises);
        
        if (!fileDetails || fileDetails.length === 0) {
            res.json([]); // Return empty array if no files found
        } else {
            res.json(fileDetails);
        }
    } catch (error) {
        console.error('Error reading directory:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(500).json({ error: `Unable to read directory: ${errorMessage}` });
    }
});

// Upload file
router.post('/upload', upload.single('file'), (req, res) => {
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

// Delete file
router.delete('/files/:filename', async (req, res) => {
    try {
        const filename = decodeURIComponent(req.params.filename);
        const filePath = path.join(__dirname, '../../../public/resources/leveredge', filename);
        
        // Check if file exists before attempting to delete
        try {
            await fs.access(filePath);
        } catch (error) {
            return res.status(404).json({ error: 'File not found' });
        }

        await fs.unlink(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Unable to delete file: ' + (error as Error).message });
    }
});

export default router;