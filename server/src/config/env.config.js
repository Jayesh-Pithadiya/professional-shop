require('dotenv').config();

const validateEnv = () => {
  const required = ['JWT_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD', 'ADMIN_EMAIL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }
};

validateEnv();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: '24h',
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    email: process.env.ADMIN_EMAIL
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  upload: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    loginMax: 5
  }
};
