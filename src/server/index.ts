import app from './app';
import { ensureUploadDirectory } from './utils/directory';

const port = Number(process.env.PORT || 3001);

async function startServer() {
  try {
    await ensureUploadDirectory();

    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on port ${port}`);
    });

    server.on('error', (err: unknown) => {
      console.error('Server error:', err);
      process.exit(1);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();
