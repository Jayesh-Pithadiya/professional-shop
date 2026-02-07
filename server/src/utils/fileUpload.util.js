const path = require('path');
const fs = require('fs');
const config = require('../config/env.config');

const uploadsDir = path.join(__dirname, '../../uploads');

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const validateFile = (file) => {
  const errors = [];

  if (!file) {
    errors.push('No file uploaded');
    return { valid: false, errors };
  }

  // Check file size
  if (file.size > config.upload.maxSize) {
    errors.push(`File too large. Maximum size is ${config.upload.maxSize / (1024 * 1024)}MB`);
  }

  // Check mime type
  if (!config.upload.allowedTypes.includes(file.mimetype)) {
    errors.push(`Invalid file type. Allowed types: ${config.upload.allowedTypes.join(', ')}`);
  }

  // Check file extension
  const ext = path.extname(file.name).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
  if (!allowedExts.includes(ext)) {
    errors.push(`Invalid file extension. Allowed: ${allowedExts.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

const uploadFile = async (file) => {
  const validation = validateFile(file);
  
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  // Generate safe filename
  const timestamp = Date.now();
  const ext = path.extname(file.name);
  const safeName = `${timestamp}${ext}`;
  const filePath = path.join(uploadsDir, safeName);

  // Move file
  await file.mv(filePath);

  return `/uploads/${safeName}`;
};

const deleteFile = (filePath) => {
  try {
    const fullPath = path.join(__dirname, '../..', filePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return true;
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
  return false;
};

module.exports = {
  uploadFile,
  deleteFile,
  validateFile
};
