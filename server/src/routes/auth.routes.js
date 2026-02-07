const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { validateLogin } = require('../validators/input.validator');
const { loginLimiter } = require('../middleware/rateLimit.middleware');
const authenticate = require('../middleware/auth.middleware');

router.post('/login', loginLimiter, validateLogin, authController.login);
router.get('/verify', authenticate, authController.verifyToken);

module.exports = router;
