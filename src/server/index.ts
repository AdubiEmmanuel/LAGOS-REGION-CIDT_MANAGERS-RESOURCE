import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import filesRouter from './routes/files';
import { ensureUploadDirectory } from './utils/directory';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
// Serve static files with proper headers
app.use('/resources', (_req, res, next) => {
    // Add headers needed for file preview
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
    res.header('Cross-Origin-Embedder-Policy', 'credentialless');
    next();
}, express.static(path.join(__dirname, '../../public/resources'), {
    setHeaders: (res, filePath) => {
        // Set proper content type for Office files
        if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
            res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        } else if (filePath.endsWith('.pptx') || filePath.endsWith('.ppt')) {
            res.set('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        }
    }
}));
app.use('/api', filesRouter);

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