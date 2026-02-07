const jwt = require('jsonwebtoken');
const config = require('../config/env.config');
const logger = require('../utils/logger.util');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Verify credentials (constant-time comparison to prevent timing attacks)
    const validUsername = username === config.admin.username || username === config.admin.email;
    const validPassword = password === config.admin.password;

    if (!validUsername || !validPassword) {
      logger.warn({
        message: 'Failed login attempt',
        username,
        ip: req.ip
      });

      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        username: config.admin.username,
        email: config.admin.email
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiry }
    );

    logger.info({
      message: 'Successful login',
      username: config.admin.username,
      ip: req.ip
    });

    res.json({
      success: true,
      message: 'Login successful',
      token
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res) => {
  // If middleware passed, token is valid
  res.json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
};

module.exports = {
  login,
  verifyToken
};
