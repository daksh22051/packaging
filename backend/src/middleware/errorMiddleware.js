/**
 * Centralized Error Handling Middleware for CIRCULA API
 */

// Handle 404 Route Not Found
export const notFound = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Centralized error handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Mongoose bad ObjectId / CastError
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Resource not found with invalid identifier: ${err.value}`;
    errors = [{ field: err.path, message }];
  }

  // Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `A record with ${field} '${value}' already exists.`;
    errors = [{ field, message }];
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired. Please log in again.';
  }

  // Mongoose disconnected / buffering error
  if (
    err.name === 'MongooseError' ||
    err.name === 'MongoServerSelectionError' ||
    err.message?.includes('bufferCommands') ||
    err.message?.includes('initial connection is complete')
  ) {
    statusCode = 503;
    message = 'MongoDB database is currently disconnected. System running in Preview Mode.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
