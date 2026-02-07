const { readJSON, writeJSON } = require('../utils/fileSystem.util');

const createGenericController = (filename) => {
  return {
    getAll: async (req, res, next) => {
      try {
        const data = await readJSON(filename);
        res.json(data);
      } catch (error) {
        next(error);
      }
    },

    create: async (req, res, next) => {
      try {
        const data = await readJSON(filename);
        const newItem = {
          ...req.body,
          createdAt: new Date().toISOString()
        };

        data.push(newItem);
        await writeJSON(filename, data);
        x
        res.status(201).json({
          success: true,
          message: 'Item created successfully',
          data: newItem
        });
      } catch (error) {
        next(error);
      }
    },

    update: async (req, res, next) => {
      try {
        await writeJSON(filename, req.body);

        res.json({
          success: true,
          message: 'Updated successfully',
          data: req.body
        });
      } catch (error) {
        next(error);
      }
    },

    remove: async (req, res, next) => {
      try {
        const data = await readJSON(filename);
        const index = req.params.index;

        if (index >= data.length) {
          return res.status(404).json({
            success: false,
            message: 'Item not found'
          });
        }

        data.splice(index, 1);
        await writeJSON(filename, data);

        res.json({
          success: true,
          message: 'Item deleted successfully'
        });
      } catch (error) {
        next(error);
      }
    }
  };
};

module.exports = {
  services: createGenericController('services.json'),
  journey: createGenericController('journey.json'),
  contact: createGenericController('contact.json')
};
