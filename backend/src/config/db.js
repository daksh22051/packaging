import mongoose from 'mongoose';

// Disable Mongoose command buffering so queries fail fast when disconnected
mongoose.set('bufferCommands', false);

let isConnected = false;

/**
 * Connect to MongoDB with graceful error handling and retry logic
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.warn('⚠️  MONGO_URI is not defined in environment variables. Running in disconnected mode.');
    return false;
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB runtime connection error:', err.message);
      isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB connection lost.');
      isConnected = false;
    });

    return true;
  } catch (error) {
    isConnected = false;
    console.error('❌ MongoDB Connection Error:', error.message);
    console.warn('⚠️  Continuing server execution without active database connection.');
    return false;
  }
};

/**
 * Return current MongoDB connection state string
 */
export const getConnectionStatus = () => {
  if (mongoose.connection.readyState === 1) return 'connected';
  if (mongoose.connection.readyState === 2) return 'connecting';
  if (mongoose.connection.readyState === 3) return 'disconnecting';
  return 'disconnected';
};

export const isDbConnected = () => mongoose.connection.readyState === 1;
