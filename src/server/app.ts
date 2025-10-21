import express from 'express';
import cors from 'cors';
import path from 'path';
import filesRouter from './routes/files';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://lagos-region-cidt-managers-resource.vercel.app'
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin) return callback(null, true);
    return allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  exposedHeaders: ['Content-Disposition']
};

app.use(express.json());
app.options('*', cors(corsOptions));
app.use('/api', cors(corsOptions), filesRouter);

app.use((_req, res, next) => {
  res.setHeader('Vary', 'Origin');
  next();
});

app.use(
  '/resources',
  (req, res, next) => {
    const origin = req.get('Origin') || '';
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
  },
  express.static(path.join(__dirname, '../../public/resources'), {
    setHeaders: (res, filePath) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
      res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
      if (filePath.endsWith('.xlsx') || filePath.endsWith('.xls')) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      } else if (filePath.endsWith('.pptx') || filePath.endsWith('.ppt')) {
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
      }
    }
  })
);

export default app;
