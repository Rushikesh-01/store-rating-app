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

const validateStore = [
  body('name').trim().isLength({ min: 20, max: 60 }).withMessage('Store name must be between 20 and 60 characters'),
  body('email').trim().isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('address').trim().notEmpty().withMessage('Address is required').isLength({ max: 400 }).withMessage('Address must not exceed 400 characters'),
  body('ownerId').isInt({ min: 1 }).withMessage('Valid owner ID is required'),
  validate,
];

const validateRating = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5'),
  body('storeId').isInt({ min: 1 }).withMessage('Valid store ID is required'),
  validate,
];

const validateCreateUser = [
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

module.exports = { validateStore, validateRating, validateCreateUser };
