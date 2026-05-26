const { body, validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  next();
};

const validateRegister = [
  body('name').trim().isLength({ min: 20, max: 60 }).withMessage('Name must be between 20 and 60 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('Password must contain at least one special character'),
  body('address').optional().isLength({ max: 400 }).withMessage('Address must not exceed 400 characters'),
  body('role').optional().isIn(['ADMIN', 'USER', 'STORE_OWNER']).withMessage('Invalid role'),
  validate,
];

const validateLogin = [
  body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

const validateUpdatePassword = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8, max: 16 }).withMessage('Password must be 8–16 characters')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('New password must contain at least one special character'),
  validate,
];

module.exports = { validateRegister, validateLogin, validateUpdatePassword };
