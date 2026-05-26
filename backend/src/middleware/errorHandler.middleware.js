const AppError = require('../utils/AppError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message, statusCode: err.statusCode || 500 };

  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error:', err.message, err.stack);
  }

  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    error = new AppError(`A record with this ${field} already exists.`, 409);
  }
  if (err.code === 'P2025') error = new AppError('Record not found.', 404);
  if (err.code === 'P2003') error = new AppError('Related record not found.', 400);
  if (err.name === 'JsonWebTokenError') error = new AppError('Invalid token.', 401);
  if (err.name === 'TokenExpiredError') error = new AppError('Token expired. Please log in again.', 401);

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
