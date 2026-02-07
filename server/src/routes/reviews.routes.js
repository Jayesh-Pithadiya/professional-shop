const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviews.controller');
const authenticate = require('../middleware/auth.middleware');
const { validateReview, validateIndex } = require('../validators/input.validator');

router.get('/', reviewsController.getAll);
router.post('/', authenticate, validateReview, reviewsController.create);
router.delete('/:index', authenticate, validateIndex, reviewsController.remove);

module.exports = router;
