const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '../../data');

const readJSON = async (filename) => {
  try {
    const filePath = path.join(dataDir, filename);
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File doesn't exist, return empty array
      return [];
    }
    throw error;
  }
};

const writeJSON = async (filename, data) => {
  try {
    const filePath = path.join(dataDir, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    throw new Error(`Failed to write ${filename}: ${error.message}`);
  }
};

module.exports = {
  readJSON,
  writeJSON
};
