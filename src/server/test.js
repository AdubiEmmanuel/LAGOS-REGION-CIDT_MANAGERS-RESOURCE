import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testDirectory() {
    try {
        const directoryPath = path.join(__dirname, '../../public/resources/leveredge');
        console.log('Directory path:', directoryPath);
        
        // Create directory if it doesn't exist
        await fs.mkdir(directoryPath, { recursive: true });
        console.log('Directory created/exists');
        
        // List files
        const files = await fs.readdir(directoryPath);
        console.log('Files in directory:', files);
    } catch (error) {
        console.error('Error:', error);
    }
}

testDirectory();