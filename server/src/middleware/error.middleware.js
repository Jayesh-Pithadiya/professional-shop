const config = require('../config/env.config');
const logger = require('../utils/logger.util');

const errorHandler = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  // Don't leak error details in production
  const isDev = config.nodeEnv === 'development';

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: isDev ? err.details : undefined
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access'
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    message: isDev ? err.message : 'Internal server error',
    stack: isDev ? err.stack : undefined
  });
};

const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
};

module.exports = { errorHandler, notFoundHandler };
