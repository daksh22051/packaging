import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start listening
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 CIRCULA API Server running on port ${PORT}`);
    console.log(`📡 Health check available at: http://localhost:${PORT}/api/health`);
  });

  // Handle unhandled promise rejections gracefully
  process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err.message);
  });

  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Closing server gracefully...');
    server.close(() => {
      console.log('Server terminated');
    });
  });
};

startServer();
