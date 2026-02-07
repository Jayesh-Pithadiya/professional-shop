const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items.controller');
const authenticate = require('../middleware/auth.middleware');
const { validateItem, validateIndex } = require('../validators/input.validator');
const { uploadLimiter } = require('../middleware/rateLimit.middleware');

router.get('/', itemsController.getAll);
router.post('/', authenticate, uploadLimiter, validateItem, itemsController.create);
router.delete('/:index', authenticate, validateIndex, itemsController.remove);

module.exports = router;
