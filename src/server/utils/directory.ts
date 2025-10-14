import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function ensureUploadDirectory() {
    const uploadPath = path.join(__dirname, '../../../public/resources/leveredge');
    try {
        await fs.access(uploadPath);
    } catch (error) {
        // Directory doesn't exist, create it
        await fs.mkdir(uploadPath, { recursive: true });
    }
}