const { readJSON, writeJSON } = require('../utils/fileSystem.util');
const { uploadFile, deleteFile } = require('../utils/fileUpload.util');

const ITEMS_FILE = 'items.json';

const getAll = async (req, res, next) => {
  try {
    const items = await readJSON(ITEMS_FILE);
    res.json(items);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const items = await readJSON(ITEMS_FILE);
    const newItem = { ...req.body };

    // Handle file upload if present
    if (req.files && req.files.image) {
      const filePath = await uploadFile(req.files.image);
      newItem.src = filePath;
    }

    items.push(newItem);
    await writeJSON(ITEMS_FILE, items);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const items = await readJSON(ITEMS_FILE);
    const index = req.params.index;

    if (index >= items.length) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Delete associated file if exists
    const item = items[index];
    if (item.src) {
      deleteFile(item.src);
    }

    items.splice(index, 1);
    await writeJSON(ITEMS_FILE, items);

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  create,
  remove
};
