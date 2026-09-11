import express from 'express';
import cors from 'cors';
import { getConnectionStatus } from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import materialRoutes from './routes/materialRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

// Middleware imports
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const app = express();

// CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      // In development or if allowedOrigins contains origin or matches AIS dev origin
      if (
        allowedOrigins.length === 0 ||
        allowedOrigins.includes(origin) ||
        process.env.NODE_ENV !== 'production' ||
        origin.includes('.run.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = getConnectionStatus();
  res.status(200).json({
    success: true,
    message: 'CIRCULA API is running',
    database: dbStatus,
  });
});

// Root API welcome
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CIRCULA B2B Circular Materials Exchange REST API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/materials', materialRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/ai', aiRoutes);

// Error Handling Middlewares (only intercept unhandled /api requests to allow Vite SPA fallthrough)
app.use((req, res, next) => {
  const url = req.originalUrl || req.url || '';
  if (url.startsWith('/api')) {
    return notFound(req, res, next);
  }
  next();
});
app.use(errorHandler);

export default app;
