import express from 'express';
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

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
        const directoryPath = path.resolve(__dirname, '../../../public/resources/leveredge');
        console.log('Files route - Directory path:', directoryPath);
        console.log('Files route - __dirname:', __dirname);
        
        try {
            await fs.access(directoryPath);
            console.log('Directory exists:', directoryPath);
        } catch (err) {
            console.log('Creating directory:', directoryPath);
            try {
                await fs.mkdir(directoryPath, { recursive: true });
            } catch (mkdirErr) {
                console.error('Error creating directory:', mkdirErr);
                return res.status(500).json({ 
                    error: 'Unable to create directory',
                    details: mkdirErr.message
                });
            }
        }

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

// Upload file
router.post('/files/upload', upload.single('file'), (req, res) => {
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
        const filePath = path.join(__dirname, '../../../public/resources/leveredge', req.params.filename);
        await fs.unlink(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ error: 'Unable to delete file' });
    }
});

// Rename file
router.put('/files/:filename', async (req, res) => {
    try {
        const oldPath = path.join(__dirname, '../../../public/resources/leveredge', req.params.filename);
        const newName = req.body.newName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9.-]/g, '');
        const newPath = path.join(__dirname, '../../../public/resources/leveredge', newName);

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

export default router;