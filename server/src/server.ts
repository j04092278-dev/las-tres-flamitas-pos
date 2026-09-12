import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

dotenv.config();

const app = express();

// ============ CORS ============
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, health checks)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS bloqueado para: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

// ============ Health Check ============
app.get('/health', (_req, res) =>
  res.json({ ok: true, service: 'flamitas-api', timestamp: new Date().toISOString() })
);

app.get('/', (_req, res) =>
  res.json({ message: '🍔 LAS TRES FLAMITAS API', version: '1.0.0' })
);

// ============ API ============
app.use('/api', routes);

// ============ Errores ============
app.use(notFoundHandler);
app.use(errorHandler);

// ============ Listen ============
const PORT = Number(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API corriendo en puerto ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS: ${allowedOrigins.join(', ')}`);
});