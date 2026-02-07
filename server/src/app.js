const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fileUpload = require('express-fileupload');

// Configuration
const config = require('./config/env.config');
const logger = require('./utils/logger.util');

// Middleware
const sanitizeMiddleware = require('./middleware/sanitize.middleware');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const { apiLimiter } = require('./middleware/rateLimit.middleware');

// Routes
const authRoutes = require('./routes/auth.routes');
const itemsRoutes = require('./routes/items.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const apiRoutes = require('./routes/api.routes');

const app = express();

// Security Headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration
const corsOptions = {
  origin: config.nodeEnv === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// File Upload
app.use(fileUpload({
  limits: { fileSize: config.upload.maxSize },
  abortOnLimit: true,
  createParentPath: true
}));

// Sanitize Inputs
app.use(sanitizeMiddleware);

// Static Files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rate Limiting
app.use('/api', apiLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api', authRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api', apiRoutes);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// Graceful Shutdown
process.on('SIGTERM', () => {
  logger.info({ message: 'SIGTERM received, shutting down gracefully' });
  server.close(() => {
    logger.info({ message: 'Process terminated' });
    process.exit(0);
  });
});

process.on('uncaughtException', (error) => {
  logger.error({ message: 'Uncaught Exception', error: error.message, stack: error.stack });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error({ message: 'Unhandled Rejection', reason, promise });
  process.exit(1);
});

// Start Server
const server = app.listen(config.port, () => {
  logger.info({
    message: 'Server started',
    port: config.port,
    environment: config.nodeEnv
  });
  console.log(`\n🚀 Server running on http://localhost:${config.port}`);
  console.log(`📧 Admin: ${config.admin.email}`);
  console.log(`🔒 Environment: ${config.nodeEnv}\n`);
});

module.exports = app;
