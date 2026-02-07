const express = require('express');
const router = express.Router();
const { services, journey, contact } = require('../controllers/generic.controller');
const authenticate = require('../middleware/auth.middleware');
const { validateIndex } = require('../validators/input.validator');

// Services routes
router.get('/services', services.getAll);
router.post('/services', authenticate, services.create);
router.delete('/services/:index', authenticate, validateIndex, services.remove);

// Journey routes
router.get('/journey', journey.getAll);
router.post('/journey', authenticate, journey.create);
router.delete('/journey/:index', authenticate, validateIndex, journey.remove);

// Contact routes
router.get('/contact', contact.getAll);
router.post('/contact', authenticate, contact.update);

module.exports = router;
