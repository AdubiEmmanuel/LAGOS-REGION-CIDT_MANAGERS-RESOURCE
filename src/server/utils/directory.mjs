import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function ensureDirectoryExists() {
    const directoryPath = path.join(__dirname, '../../../public/resources/leveredge');
    try {
        await fs.access(directoryPath);
    } catch (_) {
        await fs.mkdir(directoryPath, { recursive: true });
    }
    return directoryPath;
}

export async function listFiles() {
    const directoryPath = await ensureDirectoryExists();
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

    return Promise.all(filePromises);
}