const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validateRegister, validateLogin, validateUpdatePassword } = require('../validators/auth.validator');

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.put('/update-password', authenticate, validateUpdatePassword, authController.updatePassword);
router.get('/me', authenticate, authController.getMe);

module.exports = router;
