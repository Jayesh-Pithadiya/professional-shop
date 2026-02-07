const fs = require('fs');
const path = require('path');
const config = require('../config/env.config');

const logsDir = path.join(__dirname, '../../logs');

// Ensure logs directory exists
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const writeLog = (level, data) => {
  const logEntry = {
    timestamp: getTimestamp(),
    level,
    ...data
  };

  const logFile = path.join(logsDir, `${level}.log`);
  const logLine = JSON.stringify(logEntry) + '\n';

  fs.appendFile(logFile, logLine, (err) => {
    if (err && config.nodeEnv === 'development') {
      console.error('Failed to write log:', err);
    }
  });

  // Also log to console in development
  if (config.nodeEnv === 'development') {
    console.log(`[${level.toUpperCase()}]`, data);
  }
};

const logger = {
  info: (data) => writeLog('info', data),
  error: (data) => writeLog('error', data),
  warn: (data) => writeLog('warn', data),
  debug: (data) => {
    if (config.nodeEnv === 'development') {
      writeLog('debug', data);
    }
  }
};

module.exports = logger;
